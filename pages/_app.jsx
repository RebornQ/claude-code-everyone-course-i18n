import '../styles/globals.css'
import EmailPopup from '../components/EmailPopup'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  LOCALE_STORAGE_KEY,
  getLocaleFromPath,
  toChinesePath,
  toEnglishPath,
} from '../lib/locale'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady || typeof window === 'undefined') return

    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (!storedLocale) {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, getLocaleFromPath(router.asPath))
      return
    }

    const preferredLocale = storedLocale === 'zh' ? 'zh' : 'en'
    const currentLocale = getLocaleFromPath(router.asPath)
    if (preferredLocale === currentLocale) return

    const targetPath = preferredLocale === 'zh' ? toChinesePath(router.asPath) : toEnglishPath(router.asPath)
    if (targetPath !== router.asPath) {
      router.replace(targetPath)
    }
  }, [router.isReady, router.asPath, router])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleRouteChangeStart = (url) => {
      const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
      if (!storedLocale) return

      const preferredLocale = storedLocale === 'zh' ? 'zh' : 'en'
      const nextLocale = getLocaleFromPath(url)
      if (preferredLocale === nextLocale) return

      const targetPath = preferredLocale === 'zh' ? toChinesePath(url) : toEnglishPath(url)
      if (targetPath !== url) {
        router.replace(targetPath)
      }
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events, router])

  return (
    <>
      <Component {...pageProps} />
      <EmailPopup />
    </>
  )
}
