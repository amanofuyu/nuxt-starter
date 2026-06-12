#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const defaultRoot = path.resolve(fileURLToPath(import.meta.url), '../..')
const root = path.resolve(process.argv[2] ?? defaultRoot)
const appRoot = path.join(root, 'app')
const serverRoot = path.join(root, 'server')
const sharedRoot = path.join(root, 'shared')

const ignoredDirectories = new Set([
  '.git',
  '.nuxt',
  '.output',
  'coverage',
  'dist',
  'node_modules',
  'playwright-report',
  'test-results',
])

const importPatterns = [
  /\bfrom\s+['"]([^'"]+)['"]/g,
  /import\s*['"]([^'"]+)['"]/g,
  /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
]

const violations = []

function toPosix(filePath) {
  return filePath.split(path.sep).join('/')
}

function relativeToRoot(filePath) {
  return toPosix(path.relative(root, filePath))
}

async function collectSourceFiles(directory) {
  const files = []

  async function visit(currentDirectory) {
    let entries = []

    try {
      entries = await readdir(currentDirectory, { withFileTypes: true })
    }
    catch {
      return
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!ignoredDirectories.has(entry.name)) {
          await visit(path.join(currentDirectory, entry.name))
        }
        continue
      }

      if (entry.isFile() && /\.(?:ts|vue)$/.test(entry.name)) {
        files.push(path.join(currentDirectory, entry.name))
      }
    }
  }

  await visit(directory)
  return files
}

function getImportSpecifiers(content) {
  const specifiers = []

  for (const line of content.split(/\r?\n/)) {
    for (const pattern of importPatterns) {
      pattern.lastIndex = 0
      let match = pattern.exec(line)
      while (match) {
        specifiers.push(match[1])
        match = pattern.exec(line)
      }
    }
  }

  return specifiers
}

function resolveImport(filePath, specifier) {
  if (specifier.startsWith('@/') || specifier.startsWith('~/')) {
    return path.join(appRoot, specifier.slice(2))
  }

  if (specifier.startsWith('~~/')) {
    return path.join(root, specifier.slice(3))
  }

  if (specifier.startsWith('#server/')) {
    return path.join(serverRoot, specifier.slice('#server/'.length))
  }

  if (specifier.startsWith('#shared/')) {
    return path.join(sharedRoot, specifier.slice('#shared/'.length))
  }

  if (specifier.startsWith('.')) {
    return path.resolve(path.dirname(filePath), specifier)
  }

  return undefined
}

async function pointsAtFile(importedPath, targetFile) {
  if (!importedPath) {
    return false
  }

  const normalizedTarget = path.resolve(targetFile)
  const candidates = [
    importedPath,
    `${importedPath}.ts`,
    `${importedPath}.vue`,
    path.join(importedPath, 'index.ts'),
    path.join(importedPath, 'index.vue'),
  ]

  return candidates.some(candidate => path.resolve(candidate) === normalizedTarget)
}

async function pointsInto(importedPath, targetDirectory) {
  if (!importedPath) {
    return false
  }

  const normalizedTarget = path.resolve(targetDirectory)
  const candidates = [
    importedPath,
    `${importedPath}.ts`,
    `${importedPath}.vue`,
    path.join(importedPath, 'index.ts'),
    path.join(importedPath, 'index.vue'),
  ]

  for (const candidate of candidates) {
    const normalizedCandidate = path.resolve(candidate)
    if (normalizedCandidate === normalizedTarget || normalizedCandidate.startsWith(`${normalizedTarget}${path.sep}`)) {
      return true
    }

    try {
      const candidateStat = await stat(normalizedCandidate)
      const realCandidate = candidateStat.isDirectory()
        ? normalizedCandidate
        : path.dirname(normalizedCandidate)
      if (realCandidate === normalizedTarget || realCandidate.startsWith(`${normalizedTarget}${path.sep}`)) {
        return true
      }
    }
    catch {
      // 路径可能还没有扩展名或是包导入，继续用静态路径判断。
    }
  }

  return false
}

async function resolveImportFile(importedPath) {
  if (!importedPath) {
    return undefined
  }

  const candidates = [
    importedPath,
    `${importedPath}.ts`,
    `${importedPath}.vue`,
    path.join(importedPath, 'index.ts'),
    path.join(importedPath, 'index.vue'),
  ]

  for (const candidate of candidates) {
    try {
      const candidateStat = await stat(candidate)
      if (candidateStat.isFile()) {
        return path.resolve(candidate)
      }
    }
    catch {
      // 只追踪仓库内存在的源码模块。
    }
  }

  return undefined
}

function addViolation(filePath, specifier, reason) {
  violations.push({
    file: relativeToRoot(filePath),
    reason,
    specifier,
  })
}

function isPage(relativePath) {
  return relativePath.startsWith('app/pages/') && relativePath.endsWith('.vue')
}

function isUiComponent(relativePath) {
  return relativePath.startsWith('app/components/ui/')
}

function isClientModule(relativePath, content) {
  return relativePath.startsWith('app/features/')
    || relativePath.startsWith('app/composables/')
    || relativePath.startsWith('app/plugins/')
    || /\b(?:window|document|localStorage|useQuery|useForm|onMounted)\b/.test(content)
}

async function checkFile(filePath) {
  const content = await readFile(filePath, 'utf8')
  const relativePath = relativeToRoot(filePath)
  const imports = getImportSpecifiers(content)

  for (const specifier of imports) {
    const importedPath = resolveImport(filePath, specifier)
    const importsServer = await pointsInto(importedPath, serverRoot)
    const importsMocks = await pointsInto(importedPath, path.join(serverRoot, 'mocks'))
    const importsFeatures = await pointsInto(importedPath, path.join(appRoot, 'features'))

    if (isClientModule(relativePath, content) && importsServer) {
      addViolation(filePath, specifier, '客户端模块不得直接导入服务端模块')
    }

    if (isPage(relativePath) && importsMocks) {
      addViolation(filePath, specifier, '页面不得直接导入 mock 数据源')
    }

    if (isUiComponent(relativePath) && (importsFeatures || importsServer || importsMocks)) {
      addViolation(filePath, specifier, 'app/components/ui 是 shadcn-vue 源码区，不得导入业务模块、服务端模块或 mock 数据')
    }
  }
}

async function findForbiddenDependency(startFile, fileImports, isForbiddenImport) {
  const visited = new Set()
  const queue = [{
    chain: [],
    file: path.resolve(startFile),
  }]

  while (queue.length > 0) {
    const current = queue.shift()

    if (!current || visited.has(current.file)) {
      continue
    }

    visited.add(current.file)

    const imports = fileImports.get(current.file) ?? []
    for (const specifier of imports) {
      const importedPath = resolveImport(current.file, specifier)
      const nextChain = [...current.chain, `${relativeToRoot(current.file)} -> ${specifier}`]

      if (await isForbiddenImport(importedPath)) {
        return nextChain
      }

      const nextFile = await resolveImportFile(importedPath)
      if (nextFile && nextFile.startsWith(appRoot) && !visited.has(nextFile)) {
        queue.push({
          chain: nextChain,
          file: nextFile,
        })
      }
    }
  }

  return undefined
}

const files = [
  ...await collectSourceFiles(appRoot),
  ...await collectSourceFiles(serverRoot),
  ...await collectSourceFiles(sharedRoot),
]
const fileImports = new Map()
const fileContents = new Map()

for (const file of files) {
  const content = await readFile(file, 'utf8')
  fileImports.set(path.resolve(file), getImportSpecifiers(content))
  fileContents.set(path.resolve(file), content)
}

await Promise.all(files.map(checkFile))

for (const file of files) {
  const content = fileContents.get(path.resolve(file)) ?? ''
  if (!isClientModule(relativeToRoot(file), content)) {
    continue
  }

  const serverChain = await findForbiddenDependency(file, fileImports, importedPath => pointsInto(importedPath, serverRoot))
  if (serverChain && serverChain.length > 1) {
    addViolation(file, serverChain.join(' => '), '客户端模块不得直接或间接导入服务端模块')
  }

  const envChain = await findForbiddenDependency(file, fileImports, importedPath => pointsAtFile(importedPath, path.join(serverRoot, 'utils/env.ts')))
  if (envChain) {
    addViolation(file, envChain.join(' => '), '客户端模块不得直接或间接导入服务端环境变量模块')
  }
}

if (violations.length > 0) {
  console.log('AI 边界检查失败：')
  for (const violation of violations) {
    console.log(`- ${violation.reason}: ${violation.file} -> ${violation.specifier}`)
  }
  process.exit(1)
}

console.log('AI 边界检查通过')
