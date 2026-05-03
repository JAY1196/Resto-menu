import { useEffect, useState } from 'react'

/* ── SuccessScreen ───────────────────────────────────────────────
   Full-screen success overlay shown after order placement.
   Calls `onComplete()` after 1800ms, which triggers the WhatsApp
   redirect in the parent. Animates in smoothly with no jank.
──────────────────────────────────────────────────────────────── */
export default function SuccessScreen({ onComplete }) {
  /* Stagger the content entrance after the overlay fades in */
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    /* Small delay so overlay fade finishes before content pops in */
    const contentTimer = setTimeout(() => setContentVisible(true), 180)

    /* Trigger redirect after 1800ms */
    const redirectTimer = setTimeout(() => onComplete(), 1800)

    return () => {
      clearTimeout(contentTimer)
      clearTimeout(redirectTimer)
    }
  }, [onComplete])

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-label="Order confirmed"
      className="success-overlay"
    >
      {/* Ambient glow blobs — decorative only */}
      <div className="success-glow-top"    aria-hidden="true" />
      <div className="success-glow-bottom" aria-hidden="true" />

      {/* Centered content */}
      <div
        className={`success-content ${contentVisible ? 'success-content--visible' : ''}`}
        aria-hidden={!contentVisible}
      >
        {/* ── Checkmark circle ── */}
        <div className="success-circle-wrap">
          {/* Outer pulse rings */}
          <span className="success-ring success-ring--1" aria-hidden="true" />
          <span className="success-ring success-ring--2" aria-hidden="true" />

          {/* Main circle */}
          <div className="success-circle">
            {/* Inner glow */}
            <div className="success-circle-glow" aria-hidden="true" />

            {/* Checkmark SVG */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="success-check"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 12.5L9.5 18L20 7"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="success-check-path"
              />
            </svg>
          </div>
        </div>

        {/* ── Text block ── */}
        <div className="success-text">
          <h1 className="success-heading">Order Confirmed</h1>

          <div className="success-subtext-group">
            <p className="success-subtext">Preparing your order…</p>
            <p className="success-subtext success-subtext--secondary">
              {/* WhatsApp icon inline */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="success-wa-icon" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Notifying restaurant via WhatsApp
            </p>
          </div>

          {/* Progress bar */}
          <div className="success-progress-track" aria-hidden="true">
            <div className="success-progress-bar" />
          </div>
        </div>
      </div>
    </div>
  )
}
