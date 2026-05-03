import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter') // enter | hold | exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('exit'), 2500)
    const t3 = setTimeout(() => onDone(), 3050)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      className={`splash-overlay ${phase === 'exit' ? 'splash-overlay--exit' : ''}`}
      aria-label="Loading"
      role="status"
    >
      {/* Radial glow */}
      <div className="splash-glow" aria-hidden="true" />

      {/* Logo */}
      <div className={`splash-logo ${phase !== 'enter' ? 'splash-logo--visible' : ''}`}>
        {/* Icon container */}
        <div className="splash-icon-wrap">
          <div className="splash-icon-ring" aria-hidden="true" />
          <div className="splash-icon">
            {/* Fork + Knife SVG */}
            <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
              {/* Fork */}
              <path d="M14 6v8c0 2.2 1.8 4 4 4v20a2 2 0 004 0V18c2.2 0 4-1.8 4-4V6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="16" y1="6" x2="16" y2="14" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
              <line x1="22" y1="6" x2="22" y2="14" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
              {/* Knife */}
              <path d="M32 6c0 0 6 4 6 12H32V38a2 2 0 01-4 0V6h4z" fill="rgba(255,255,255,0.85)" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Brand text */}
        <div className="splash-text-wrap">
          <h1 className="splash-name">Bagul</h1>
          <p className="splash-tagline">powered by qr dining</p>
        </div>
      </div>

      {/* Loading dots */}
      <div className="splash-dots" aria-hidden="true">
        <span className="splash-dot splash-dot--1" />
        <span className="splash-dot splash-dot--2" />
        <span className="splash-dot splash-dot--3" />
      </div>
    </div>
  )
}
