export const LOCALE_STORAGE_KEY = 'cc4e-locale'
export const ZH_PREFIX = '/zh'

export type Locale = 'en' | 'zh'

export function getLocaleFromPath(path: string): Locale {
  const url = new URL(path, 'https://example.com')
  return url.pathname === ZH_PREFIX || url.pathname.startsWith(`${ZH_PREFIX}/`) ? 'zh' : 'en'
}

export function toEnglishPath(path: string): string {
  const url = new URL(path, 'https://example.com')
  const pathname = url.pathname === ZH_PREFIX ? '/' : url.pathname.replace(/^\/zh(\/|$)/, '/')
  return `${pathname}${url.search}${url.hash}`
}

export function toChinesePath(path: string): string {
  const url = new URL(path, 'https://example.com')
  const pathname =
    url.pathname === ZH_PREFIX || url.pathname.startsWith(`${ZH_PREFIX}/`)
      ? url.pathname
      : url.pathname === '/'
        ? ZH_PREFIX
        : `${ZH_PREFIX}${url.pathname}`
  return `${pathname}${url.search}${url.hash}`
}

