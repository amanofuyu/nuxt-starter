import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(fileURLToPath(import.meta.url), '../../..')
const localeFiles = {
  en: path.join(repoRoot, 'i18n/locales/en-US.json'),
  zh: path.join(repoRoot, 'i18n/locales/zh-CN.json'),
}

async function readMessages(filePath: string) {
  return JSON.parse(await readFile(filePath, 'utf8')) as Record<string, unknown>
}

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix]
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key
    return flattenKeys(child, nextPrefix)
  })
}

function collectEmptyStrings(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') {
    return value.trim() ? [] : [prefix]
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return []
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key
    return collectEmptyStrings(child, nextPrefix)
  })
}

describe('i18n messages', () => {
  it('中英文语言包 key 完全一致且没有空文案', async () => {
    const [zhMessages, enMessages] = await Promise.all([
      readMessages(localeFiles.zh),
      readMessages(localeFiles.en),
    ])

    expect(flattenKeys(enMessages).sort()).toEqual(flattenKeys(zhMessages).sort())
    expect(collectEmptyStrings(zhMessages)).toEqual([])
    expect(collectEmptyStrings(enMessages)).toEqual([])
  })
})
