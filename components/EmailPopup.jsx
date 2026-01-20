import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

// CC4E colors
const colors = {
  bg: '#1C1C1C',
  bgLight: '#252525',
  teal: '#1DD3B0',
  coral: '#FF5856',
  coralDark: '#e54d4b',
  white: '#ffffff',
  gray300: '#d1d5db',
  gray500: '#6b7280',
}

const Spinner = () => (
  <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24">
    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

// Analytics helper
const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Shipped: Cheatsheet variant won A/B test
// Timing test concluded: 10s won (better conversion outweighs lower reach)
const VARIANT = 'cheatsheet'

export default function EmailPopup() {
  const { asPath } = useRouter()
  const isChinese = asPath === '/zh' || asPath.startsWith('/zh/')
  const seenKey = isChinese ? 'cc4e-popup-seen-zh' : 'cc4e-popup-seen'
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem(seenKey)
    if (hasSeenPopup) return

    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
      trackEvent('popup_shown', { popup_type: 'email_signup', source: 'cc4e', variant: VARIANT, locale: isChinese ? 'zh' : 'en' })
    }, 10000)

    return () => clearTimeout(timer)
  }, [isChinese, seenKey])

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem(seenKey, 'true')
    trackEvent('popup_closed', { popup_type: 'email_signup', source: 'cc4e', variant: VARIANT, locale: isChinese ? 'zh' : 'en' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('https://fullstackpm.com/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'cc4e-popup',
          publication: 'cc4e',
          utm_source: 'ccforeveryone',
          utm_medium: 'popup',
          utm_campaign: 'popup-cheatsheet',
          landing_page: window.location.pathname,
          referrer: document.referrer || 'direct',
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        localStorage.setItem(seenKey, 'true')
        trackEvent('popup_submitted', { popup_type: 'email_signup', source: 'cc4e', variant: VARIANT, locale: isChinese ? 'zh' : 'en' })
        setTimeout(() => {
          setIsVisible(false)
        }, 3000)
      } else {
        setStatus('error')
        setErrorMessage(data.error || (isChinese ? '出错了，请稍后重试。' : 'Something went wrong. Please try again.'))
      }
    } catch (err) {
      setStatus('error')
      setErrorMessage(isChinese ? '网络错误，请稍后重试。' : 'Network error. Please try again.')
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* Overlay */}
      <div className="popup-overlay" onClick={handleClose} />

      {/* Popup */}
      <div className="popup-container">
        {/* Close button */}
        <button className="popup-close" onClick={handleClose} aria-label={isChinese ? '关闭弹窗' : 'Close popup'}>
          &times;
        </button>

        {status === 'success' ? (
          <div className="popup-content">
            <div className="popup-success">
              <span className="popup-success-icon">&#10003;</span>
              <h3>{isChinese ? '谢谢！' : 'Thank you!'}</h3>
              <p>{isChinese ? '请查看你的邮箱获取速查表！' : 'Check your inbox for the cheat sheet!'}</p>
            </div>
          </div>
        ) : (
          <div className="popup-content">
            {/* Header */}
            <div className="popup-header">
              <h2>{isChinese ? '想把完整课程发到你的邮箱吗？' : 'Want the full course in your inbox?'}</h2>
              <p className="popup-subhead">
                {isChinese ? (
                  <>
                    我会提醒你回来学习，并发送一份 <span className="highlight">附赠速查表</span>。 <strong>完全免费。</strong>
                  </>
                ) : (
                  <>
                    I'll remind you to come back + send you a <span className="highlight">bonus cheat sheet</span>. <strong>100% free.</strong>
                  </>
                )}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="popup-form">
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isChinese ? 'you@email.com（你的邮箱）' : 'you@email.com'}
                required
                disabled={status === 'loading'}
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <><Spinner /> {isChinese ? '发送中…' : 'Sending...'}</>
                ) : (
                  (isChinese ? '把课程发给我' : 'Send me the course')
                )}
              </button>
            </form>
            {status === 'error' && (
              <p className="popup-error">{errorMessage}</p>
            )}
            <p className="popup-disclaimer">{isChinese ? '不发垃圾邮件，随时可取消订阅。' : 'No spam. Unsubscribe anytime.'}</p>
          </div>
        )}

        <div className="popup-footer">
          {isChinese ? (
            <>由 <a href="https://x.com/carlvellotti" target="_blank" rel="noopener noreferrer">Carl Vellotti</a> 用 🧡 和 🥞 制作</>
          ) : (
            <>Made with 🧡 and 🥞 by <a href="https://x.com/carlvellotti" target="_blank" rel="noopener noreferrer">Carl Vellotti</a></>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 9998;
          animation: fadeIn 0.3s ease;
        }

        .popup-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          background: ${colors.bg};
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
          border-top: 3px solid ${colors.coral};
        }

        .popup-close {
          position: absolute;
          top: 12px;
          right: 16px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid #444;
          border-radius: 4px;
          font-size: 20px;
          line-height: 1;
          color: ${colors.gray500};
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }
        .popup-close:hover {
          background: ${colors.bgLight};
          color: ${colors.white};
          border-color: #666;
        }

        .popup-content {
          padding: 32px 24px;
          max-width: 700px;
          margin: 0 auto;
        }

        .popup-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .popup-header h2 {
          color: ${colors.white};
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .popup-subhead {
          color: ${colors.gray300};
          font-size: 16px;
          margin: 0;
        }

        .popup-subhead .underline,
        .underline {
          text-decoration: underline;
        }

        .highlight {
          color: ${colors.teal};
          font-weight: 600;
        }

        .popup-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 24px;
        }

        .popup-column h4 {
          color: ${colors.coral};
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 12px 0;
        }

        .popup-column ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .popup-column li {
          color: ${colors.gray300};
          font-size: 14px;
          margin-bottom: 8px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .bullet {
          color: ${colors.teal};
        }

        .popup-tagline {
          text-align: center;
          color: ${colors.white};
          font-size: 18px;
          margin: 0 0 24px 0;
        }

        .popup-tagline .underline {
          text-decoration: underline;
        }

        .popup-form {
          display: flex;
          gap: 12px;
          max-width: 400px;
          margin: 0 auto;
        }

        .popup-form input {
          flex: 1;
          padding: 12px 16px;
          font-size: 14px;
          font-family: inherit;
          background: ${colors.bg};
          border: 1px solid #444;
          border-radius: 8px;
          outline: none;
          transition: all 0.2s;
          color: ${colors.white};
        }
        .popup-form input::placeholder {
          color: ${colors.gray500};
        }
        .popup-form input:focus {
          border-color: ${colors.teal};
          box-shadow: 0 0 0 2px rgba(29, 211, 176, 0.2);
        }
        .popup-form input:disabled {
          opacity: 0.5;
        }

        .popup-form button {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          color: ${colors.white};
          background: ${colors.coral};
          border: none;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .popup-form button:hover {
          background: ${colors.coralDark};
        }
        .popup-form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .popup-error {
          margin: 12px 0 0;
          font-size: 13px;
          color: ${colors.coral};
          text-align: center;
        }

        .popup-disclaimer {
          margin: 12px 0 0;
          font-size: 12px;
          color: ${colors.gray500};
          text-align: center;
        }

        .popup-footer {
          padding: 12px 24px;
          background: ${colors.bgLight};
          border-top: 1px solid #333;
          font-size: 13px;
          color: ${colors.gray500};
          text-align: center;
        }
        .popup-footer a {
          color: ${colors.coral};
          text-decoration: none;
        }
        .popup-footer a:hover {
          text-decoration: underline;
        }

        .popup-success {
          text-align: center;
          padding: 20px 0;
        }
        .popup-success-icon {
          font-size: 48px;
          color: ${colors.teal};
          display: block;
          margin-bottom: 16px;
        }
        .popup-success h3 {
          font-size: 24px;
          font-weight: 700;
          color: ${colors.white};
          margin: 0 0 8px;
        }
        .popup-success p {
          color: ${colors.gray300};
          margin: 0;
        }

        @media (max-width: 600px) {
          .popup-columns {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .popup-form {
            flex-direction: column;
          }
          .popup-tagline {
            font-size: 16px;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}
