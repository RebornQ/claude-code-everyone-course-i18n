import React from 'react'
import { useRouter } from 'next/router'
import DefaultLayout from 'nextra-theme-docs'

import { getLocaleFromPath } from './lib/locale'

function getChinesePageMap(pageMap: unknown) {
  if (!Array.isArray(pageMap)) return pageMap

  const zhFolder = pageMap.find((item) => {
    if (!item || typeof item !== 'object') return false
    const route = (item as { route?: unknown }).route
    const children = (item as { children?: unknown }).children
    return route === '/zh' && Array.isArray(children)
  }) as { children?: unknown } | undefined

  return zhFolder?.children ?? pageMap
}

function getChineseThemeConfig(themeConfig: any) {
  return {
    ...themeConfig,
    search: {
      ...themeConfig?.search,
      placeholder: '搜索文档…',
      loading: '加载中…',
      error: '搜索索引加载失败。',
      emptyResult: (
        <span className="_block _select-none _p-8 _text-center _text-sm _text-gray-400">
          未找到结果。
        </span>
      )
    },
    toc: {
      ...themeConfig?.toc,
      title: '本页目录',
      backToTop: '返回顶部'
    }
  }
}

function getEnglishThemeConfig(themeConfig: any) {
  const tocBackToTop = themeConfig?.toc?.backToTop
  if (tocBackToTop !== true) return themeConfig

  return {
    ...themeConfig,
    toc: {
      ...themeConfig?.toc,
      backToTop: 'Scroll to top'
    }
  }
}

export default function Layout(props: any) {
  const { asPath } = useRouter()
  const isChinese = getLocaleFromPath(asPath) === 'zh'
  const localeKey = isChinese ? 'zh' : 'en'

  const pageOpts = props?.pageOpts
  const pageMap = pageOpts?.pageMap
  const localePageMap = isChinese ? getChinesePageMap(pageMap) : pageMap

  const nextPageOpts =
    localePageMap && localePageMap !== pageMap ? { ...pageOpts, pageMap: localePageMap } : pageOpts
  const nextThemeConfig = isChinese
    ? getChineseThemeConfig(props?.themeConfig)
    : getEnglishThemeConfig(props?.themeConfig)

  return <DefaultLayout key={localeKey} {...props} themeConfig={nextThemeConfig} pageOpts={nextPageOpts} />
}
