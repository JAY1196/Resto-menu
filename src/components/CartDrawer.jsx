import { useEffect, useRef, useState, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import SuccessScreen from './SuccessScreen'

/* ── Config ──────────────────────────────────────────────────── */
const WHATSAPP_NUMBER = '919999999999'

/* ── Helper: Build professional WhatsApp message ─────────────── */
function buildWhatsAppMessage({ items, tableNumber, totalPrice, instructions }) {
  const lines = [
    `🧾 *New Order Received*`,
    ``,
    `📍 Table: ${tableNumber}`,
    ``,
    `🍽️ Items:`,
    ...items.map(i => `• ${i.name} x${i.qty} — ₹${i.price * i.qty}`),
    ``,
    `💰 Total: ₹${totalPrice}`,
  ]

  if (instructions && instructions.trim()) {
    lines.push(``)
    lines.push(`📝 Instructions:`)
    lines.push(instructions.trim())
  }

  lines.push(``)
  lines.push(`📲 Ordered via QR System`)

  return lines.join('\n')
}

/* ── Helper: Build WhatsApp URL ───────────────────────────────── */
function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/* ── Waiter SVG Icon ─────────────────────────────────────────── */
const WaiterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M4 20v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ── WhatsApp SVG Icon ───────────────────────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

/* ── Cart Drawer ─────────────────────────────────────────────── */
export default function CartDrawer({ isOpen, onClose, onOrderPlaced }) {
  const { items, tableNumber, totalPrice, addItem, removeItem, clearCart, setTable } = useCart()
  const drawerRef  = useRef(null)
  const [localTable,    setLocalTable]    = useState(tableNumber)
  const [instructions,  setInstructions]  = useState('')
  const [showSuccess,   setShowSuccess]   = useState(false)
  const whatsappUrlRef = useRef('')

  /* Keep local table in sync with context */
  useEffect(() => { setLocalTable(tableNumber) }, [tableNumber])

  /* Close on outside tap */
  useEffect(() => {
    function handleOutside(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose()
      }
    }
    if (isOpen) {
      const id = setTimeout(() => document.addEventListener('pointerdown', handleOutside), 150)
      return () => {
        clearTimeout(id)
        document.removeEventListener('pointerdown', handleOutside)
      }
    }
  }, [isOpen, onClose])

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  /* ── Place Order ────────────────────────────────────────────── */
  const handlePlaceOrder = useCallback(() => {
    if (items.length === 0 || showSuccess) return
    setTable(localTable)

    const message = buildWhatsAppMessage({ items, tableNumber: localTable, totalPrice, instructions })
    const url = buildWhatsAppUrl(message)
    whatsappUrlRef.current = url

    window.open(url, '_blank') // Open immediately to bypass popup blocker

    setShowSuccess(true)  // mount full-screen overlay
  }, [items, showSuccess, localTable, totalPrice, instructions, setTable])

  /* Called by SuccessScreen after its 1800ms animation completes */
  const handleSuccessComplete = useCallback(() => {
    clearCart()
    setInstructions('')
    setShowSuccess(false)
    onOrderPlaced()   // dismiss any toast in parent
    onClose()
  }, [clearCart, onOrderPlaced, onClose])

  /* ── Call Waiter ────────────────────────────────────────────── */
  const handleCallWaiter = useCallback(() => {
    const message = `Customer at Table ${localTable || tableNumber} needs assistance`
    const url     = buildWhatsAppUrl(message)
    window.open(url, '_blank')
  }, [localTable, tableNumber])

  return (
    <>
      {/* Full-screen success overlay — mounts on order confirm */}
      {showSuccess && <SuccessScreen onComplete={handleSuccessComplete} />}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 z-50 max-w-2xl mx-auto bg-dark-900 border border-white/[0.08] rounded-t-3xl shadow-2xl
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '90dvh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-dark-600" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <div>
            <h2 className="font-display font-bold text-white text-xl">Your Order</h2>
            <p className="text-dark-400 text-xs mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''} selected</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90dvh - 320px)' }}>
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center gap-3 py-14 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-1">
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-dark-500" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-dark-300 font-medium text-sm">Your cart is empty</p>
              <p className="text-dark-500 text-xs">Add items from the menu to get started</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.04] px-5">
              {items.map(item => (
                <li key={item.id} className="flex items-center gap-3 py-4">
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />

                  {/* Name + price */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                    <p className="text-brand-400 text-sm font-bold mt-0.5">₹{item.price * item.qty}</p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 bg-dark-800 rounded-full px-1 py-1 border border-dark-600 flex-shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="qty-btn bg-dark-700 hover:bg-dark-600 w-7 h-7 text-sm"
                    >
                      −
                    </button>
                    <span className="text-white font-bold text-sm w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => addItem(item)}
                      className="qty-btn bg-brand-500 hover:bg-brand-400 w-7 h-7 text-sm"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Special Instructions */}
          {items.length > 0 && (
            <div className="px-5 pb-3 pt-1">
              <label className="block text-dark-300 text-xs font-medium mb-1.5">
                Any special instructions?
              </label>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Less spicy, no onions, extra sauce…"
                rows={2}
                className="input-field resize-none text-xs leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-safe-bottom pb-6 pt-4 border-t border-white/[0.06] space-y-3">
          {/* Table number input */}
          <div className="flex items-center gap-3">
            <label className="text-dark-300 text-xs font-medium whitespace-nowrap">Table No.</label>
            <input
              type="text"
              value={localTable}
              onChange={e => setLocalTable(e.target.value)}
              className="input-field !py-2 !text-center w-20 text-sm font-bold"
              maxLength={3}
            />
            <p className="text-dark-500 text-xs">Change if different from QR</p>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-xs">Order Total</p>
              <p className="text-white font-bold text-2xl">
                ₹<span className="gradient-text">{totalPrice}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-dark-500 text-[10px]">Taxes &amp; service charge</p>
              <p className="text-dark-500 text-[10px]">may be added at billing</p>
            </div>
          </div>

          {/* Primary CTA — Place Order */}
          <button
            id="btn-place-order"
            onClick={handlePlaceOrder}
            disabled={items.length === 0}
            className={`btn-primary flex items-center justify-center gap-2 relative overflow-hidden
              ${items.length === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-orange-500/60'}`}
          >
            <WhatsAppIcon />
            Place Order on WhatsApp
          </button>

          {/* Secondary CTA — Call Waiter */}
          <button
            id="btn-call-waiter"
            onClick={handleCallWaiter}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl
              border border-dark-600 bg-dark-800 text-dark-200 text-sm font-medium
              hover:bg-dark-700 hover:border-dark-500 hover:text-white
              active:scale-95 transition-all duration-200"
          >
            <WaiterIcon />
            Need help? Call waiter
          </button>

          {/* Branding */}
          <p className="text-center text-dark-600 text-[10px]">
            Order placed via QR system · Powered by{' '}
            <span className="text-dark-400 font-semibold">Smart QR Ordering</span>
          </p>
        </div>
      </div>
    </>
  )
}
