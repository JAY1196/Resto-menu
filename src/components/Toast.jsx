import { useEffect, useState } from 'react'

export default function Toast({ message, isVisible, onHide }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    /* Auto-hide after 2.8s */
    const hideTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => {
        setExiting(false)
        onHide()
      }, 300)
    }, 2800)

    return () => clearTimeout(hideTimer)
  }, [isVisible, onHide])

  if (!isVisible && !exiting) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none ${
        exiting ? 'animate-toast-exit' : 'animate-toast-enter'
      }`}
    >
      <div className="flex items-center gap-3 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-emerald-500/40 min-w-[270px] max-w-xs">
        {/* Animated checkmark circle */}
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 relative">
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse-ring" />
          <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div>
          <p className="font-semibold text-sm leading-tight">✅ {message}</p>
          <p className="text-emerald-100 text-[11px] mt-0.5">Opening WhatsApp…</p>
        </div>
      </div>
    </div>
  )
}
