import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import {
  LOCALE_STORAGE_KEY,
  getLocaleFromPath,
  toChinesePath,
  toEnglishPath
} from '../lib/locale'

export default function LanguageSwitch() {
  const { asPath } = useRouter()
  const currentLocale = getLocaleFromPath(asPath)
  const currentLabel = currentLocale === 'zh' ? '中文' : 'English'
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const options = [
    {
      locale: 'en' as const,
      label: 'English',
      title: 'Switch to English',
      href: toEnglishPath(asPath)
    },
    {
      locale: 'zh' as const,
      label: '中文',
      title: '切换到中文',
      href: toChinesePath(asPath)
    }
  ]

  useEffect(() => {
    setOpen(false)
  }, [asPath])

  useEffect(() => {
    if (!open) return

    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="switcher">
      <button
        type="button"
        className="button"
        aria-label="Language switcher"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {currentLabel}
        <span aria-hidden="true" className="caret">
          ▾
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Language options"
          className="menu"
        >
          {options.map((opt) => (
            <Link
              key={opt.locale}
              role="menuitem"
              className={['item', opt.locale === currentLocale ? 'active' : ''].join(' ')}
              href={opt.href}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.localStorage.setItem(LOCALE_STORAGE_KEY, opt.locale)
                }
                setOpen(false)
              }}
              title={opt.title}
            >
              <span className="itemContent">
                <span className="label">{opt.label}</span>
                {opt.locale === currentLocale ? (
                  <span aria-hidden="true" className="check">
                    ✓
                  </span>
                ) : null}
              </span>
            </Link>
          ))}
        </div>
      ) : null}

      <style jsx>{`
        .switcher {
          position: relative;
          display: inline-block;
        }

        .button {
          height: 1.75rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0 0.5rem;
          border: 0;
          border-radius: 0.375rem;
          background: transparent;
          font-size: 0.75rem;
          line-height: 1rem;
          font-weight: 500;
          color: #4b5563;
          transition: background-color 0.15s ease, color 0.15s ease;
          cursor: pointer;
        }

        .button:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .button:focus-visible {
          outline: 2px solid rgba(29, 211, 176, 0.35);
          outline-offset: 2px;
        }

        .button[aria-expanded='true'] {
          background: #e5e7eb;
          color: #111827;
        }

        :global(.dark) .button {
          color: #9ca3af;
        }

        :global(.dark) .button:hover {
          background: hsl(
            var(--nextra-primary-hue) var(--nextra-primary-saturation)
              var(--nextra-primary-lightness) / 0.05
          );
          color: #f9fafb;
        }

        :global(.dark) .button[aria-expanded='true'] {
          background: hsl(
            var(--nextra-primary-hue) var(--nextra-primary-saturation)
              var(--nextra-primary-lightness) / 0.1
          );
          color: #f9fafb;
        }

        .caret {
          font-size: 0.75rem;
          opacity: 0.8;
          transform: translateY(1px);
        }

        .menu {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 10px;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          overflow: auto;
          border-radius: 0.375rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          background: rgb(var(--nextra-bg), 0.8);
          backdrop-filter: blur(16px);
          min-width: 100%;
          width: max-content;
          max-height: 16rem;
          padding: 0.25rem;
          font-size: 0.875rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }

        :global(.dark) .menu {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
          text-decoration: none;
          white-space: nowrap;
          transition: background-color 0.15s ease, color 0.15s ease;
          cursor: pointer;
        }

        .itemContent {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .label {
          text-align: center;
        }

        .item:hover,
        .item:focus-visible {
          outline: none;
          background: hsl(
            var(--nextra-primary-hue) var(--nextra-primary-saturation)
              calc(var(--nextra-primary-lightness) + 52%) / 1
          );
          color: hsl(
            var(--nextra-primary-hue) var(--nextra-primary-saturation)
              calc(var(--nextra-primary-lightness) + 0%) / 1
          );
        }

        :global(.dark) .item {
          color: #f3f4f6;
        }

        :global(.dark) .item:hover {
          background: hsl(
            var(--nextra-primary-hue) var(--nextra-primary-saturation)
              calc(var(--nextra-primary-lightness) + 5%) / 0.1
          );
        }

        :global(.dark) .item:focus-visible {
          outline: none;
          background: hsl(
            var(--nextra-primary-hue) var(--nextra-primary-saturation)
              calc(var(--nextra-primary-lightness) + 5%) / 0.1
          );
        }

        .active {
          font-weight: 600;
        }

        .check {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          line-height: 1;
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}
