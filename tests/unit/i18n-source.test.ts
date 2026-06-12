import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '../../..')
const appRoot = path.join(repoRoot, 'app')

async function listVueFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return listVueFiles(entryPath)
    }

    return entry.isFile() && entry.name.endsWith('.vue') ? [entryPath] : []
  }))

  return files.flat()
}

describe('i18n source usage', () => {
  it('vue 源码不使用模板实例上的 $t', async () => {
    const files = await listVueFiles(appRoot)

    const offenders: string[] = []
    await Promise.all(files.map(async (file) => {
      const content = await readFile(file, 'utf8')
      if (content.includes('$t')) {
        offenders.push(path.relative(repoRoot, file))
      }
    }))

    expect(offenders).toEqual([])
  })
})
