import { useCart } from '../context/CartContext'

/* Fork + Knife brand icon */
function BagulIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 6v8c0 2.2 1.8 4 4 4v16a2 2 0 004 0V18c2.2 0 4-1.8 4-4V6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="16" y1="6" x2="16" y2="14" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
      <line x1="22" y1="6" x2="22" y2="14" stroke="white" strokeWidth="2.8" strokeLinecap="round"/>
      <path d="M32 6c0 0 6 4 6 12H32V36a2 2 0 01-4 0V6h4z" fill="rgba(255,255,255,0.9)"/>
    </svg>
  )
}

export default function Header() {
  const { tableNumber } = useCart()

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/[0.06]">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">

        {/* Logo + Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-500 to-amber-400 flex items-center justify-center shadow-md shadow-brand-500/40">
            <BagulIcon />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-white text-lg leading-tight tracking-tight">
              Bagul
            </h1>
            <p className="text-dark-400 text-[10px] leading-none tracking-wide">
              powered by qr dining
            </p>
          </div>
        </div>

        {/* Table badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-brand-500/15 border border-brand-500/30 px-3 py-1.5 rounded-full">
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-brand-400" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 18H20M7 6V18M17 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="text-brand-300 font-semibold text-xs">
            Table {tableNumber}
          </span>
        </div>
      </div>
    </header>
  )
}
