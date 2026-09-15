import { defineConfig } from 'vitepress'
import type { UserConfig } from 'vitepress'
import type { Alias, AliasOptions } from 'vite'

type Config = UserConfig & {
  vite?: UserConfig['vite']
}

function uniq(items: string[]) {
  return Array.from(new Set(items))
}

function mergeNoExternal(value: unknown): true | (string | RegExp)[] {
  if (value === true) return true
  if (Array.isArray(value)) {
    const hasNonString = value.some((item) => typeof item !== 'string')
    if (hasNonString) {
      const exists = value.some((item) => item === '@vodtv/theme')
      return exists ? value.slice() : [...value, '@vodtv/theme']
    }
    return uniq([...value, '@vodtv/theme'])
  }
  if (typeof value === 'string') return uniq([value, '@vodtv/theme'])
  if (value instanceof RegExp) return [value, '@vodtv/theme']
  return ['@vodtv/theme']
}

function mergeExclude(value?: string[]) {
  const list = Array.isArray(value) ? value : []
  return uniq([...list, '@vodtv/theme'])
}

function mergeAlias(value?: AliasOptions): Alias[] {
  const aliasList: Alias[] = [
    {
      find: /^dayjs$/,
      replacement: '@vodtv/theme/shims/dayjs'
    },
    {
      find: /^dayjs\/plugin\//,
      replacement: 'dayjs/plugin/'
    },
    {
      find: /^dayjs\/esm\/index\.js\/plugin\//,
      replacement: 'dayjs/plugin/'
    }
  ]

  if (Array.isArray(value)) {
    aliasList.push(...value)
  } else if (value && typeof value === 'object') {
    for (const [find, replacement] of Object.entries(value)) {
      aliasList.push({ find, replacement })
    }
  }

  const hasSanitizeAlias = aliasList.some((item) => {
    if (item.find instanceof RegExp) return item.find.test('@braintree/sanitize-url')
    return item.find === '@braintree/sanitize-url'
  })

  if (!hasSanitizeAlias) {
    aliasList.push({
      find: /^@braintree\/sanitize-url$/,
      replacement: '@vodtv/theme/shims/sanitize-url'
    })
  }

  return aliasList
}

export function withTheme(config: Config): UserConfig {
  const vite = config.vite ?? {}
  const ssr = {
    ...(vite.ssr ?? {}),
    noExternal: mergeNoExternal(vite.ssr?.noExternal)
  }
  const optimizeDeps = {
    ...(vite.optimizeDeps ?? {}),
    exclude: mergeExclude(vite.optimizeDeps?.exclude)
  }
  const resolve = {
    ...(vite.resolve ?? {}),
    alias: mergeAlias(vite.resolve?.alias)
  }

  return defineConfig({
    ...config,
    vite: {
      ...vite,
      ssr,
      optimizeDeps,
      resolve
    }
  })
}
