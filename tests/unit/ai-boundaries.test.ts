import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { afterEach, describe, expect, it } from 'vitest'

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '../../..')
const checkerPath = path.join(repoRoot, 'scripts/check-ai-boundaries.mjs')
const execFileAsync = promisify(execFile)

let tempRoot: string | undefined

async function createTempProject() {
  tempRoot = await mkdtemp(path.join(tmpdir(), 'ai-boundaries-'))
  return tempRoot
}

async function writeProjectFile(root: string, filePath: string, content: string) {
  const absolutePath = path.join(root, filePath)
  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, content, { encoding: 'utf8', flag: 'w' })
}

async function runChecker(root: string) {
  try {
    const result = await execFileAsync('node', [checkerPath, root], { cwd: repoRoot })
    return {
      exitCode: 0,
      stdout: result.stdout,
      stderr: result.stderr,
    }
  }
  catch (error) {
    const execError = error as { code?: number, stdout?: string, stderr?: string }
    return {
      exitCode: execError.code ?? 1,
      stdout: execError.stdout ?? '',
      stderr: execError.stderr ?? '',
    }
  }
}

afterEach(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true })
    tempRoot = undefined
  }
})

describe('check-ai-boundaries', () => {
  it('拒绝页面直接导入 mock，拒绝 ui 源码区导入业务边界', async () => {
    const root = await createTempProject()

    await Promise.all([
      writeProjectFile(root, 'app/pages/index.vue', `
<script setup lang="ts">
import { products } from '#server/mocks/products'
</script>
`),
      writeProjectFile(root, 'app/components/ui/button.vue', `
<script setup lang="ts">
import LoginForm from '@/features/login/LoginForm.vue'
</script>
`),
      writeProjectFile(root, 'app/features/login/LoginForm.vue', `
<template><form /></template>
`),
    ])

    const result = await runChecker(root)

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain('页面不得直接导入 mock 数据源')
    expect(result.stdout).toContain('app/components/ui 是 shadcn-vue 源码区')
  })

  it('拒绝客户端组件间接触达服务端边界和服务端环境变量模块', async () => {
    const root = await createTempProject()

    await Promise.all([
      writeProjectFile(root, 'app/features/profile/RecommendationsPanel.vue', `
<script setup lang="ts">
import { readProfile } from '@/lib/profile'
</script>
`),
      writeProjectFile(root, 'app/lib/profile.ts', `
import { getCurrentUserProfile } from '#server/queries/user'
export const readProfile = getCurrentUserProfile
`),
      writeProjectFile(root, 'app/features/login/LoginForm.vue', `
<script setup lang="ts">
import { env } from '#server/utils/env'
</script>
`),
    ])

    const result = await runChecker(root)

    expect(result.exitCode).toBe(1)
    expect(result.stdout).toContain('客户端模块不得直接或间接导入服务端模块')
    expect(result.stdout).toContain('客户端模块不得直接或间接导入服务端环境变量模块')
  })

  it('允许符合 Nuxt 分层规则的导入', async () => {
    const root = await createTempProject()

    await Promise.all([
      writeProjectFile(root, 'app/pages/index.vue', `
<script setup lang="ts">
import { getProducts } from '#server/queries/products'
const products = await getProducts()
</script>
<template>{{ products.length }}</template>
`),
      writeProjectFile(root, 'app/features/login/LoginForm.vue', `
<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
</script>
<template><Button type="submit">登录</Button></template>
`),
      writeProjectFile(root, 'app/components/ui/button/Button.vue', `
<template><button /></template>
`),
    ])

    const result = await runChecker(root)

    expect(result.exitCode).toBe(0)
    expect(result.stdout).toContain('AI 边界检查通过')
  })
})
