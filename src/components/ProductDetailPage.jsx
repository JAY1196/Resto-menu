import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { MENU_ITEMS } from '../data/menuData'
import { triggerCartAnimation } from '../utils/animations'

const BADGE_STYLES = {
  "Chef's Pick": 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Bestseller':  'bg-green-500/20  text-green-400  border-green-500/30',
  'Spicy':       'bg-red-500/20    text-red-400    border-red-500/30',
  'Seasonal':    'bg-sky-500/20    text-sky-400    border-sky-500/30',
  'Summer Hit':  'bg-pink-500/20   text-pink-400   border-pink-500/30',
  'Veg':         'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'No Alcohol':  'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

function StarRating({ rating }) {
  return (
    <span className="flex items-center gap-1">
      <svg viewBox="0 0 20 20" fill="#facc15" className="w-4 h-4">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <span className="text-sm font-bold text-yellow-400">{rating}</span>
      <span className="text-xs text-zinc-500">(120+ reviews)</span>
    </span>
  )
}

function SimilarCard({ item, onView }) {
  const { addItem, qtyOf } = useCart()
  const qty = qtyOf(item.id)
  return (
    <button
      className="similar-card"
      onClick={() => onView(item)}
    >
      <div className="similar-card-img-wrap">
        <img 
          src={item.image} 
          alt={item.name} 
          className="similar-card-img" 
          loading="lazy" 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' }}
        />
      </div>
      <div className="similar-card-body">
        <p className="similar-card-name">{item.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="similar-card-price">₹{item.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); triggerCartAnimation(e); addItem(item) }}
            className={`similar-add-btn ${qty > 0 ? 'similar-add-btn--added' : ''}`}
          >
            {qty > 0 ? qty : '+'}
          </button>
        </div>
      </div>
    </button>
  )
}

export default function ProductDetailPage({ item, onBack }) {
  const { addItem, removeItem, qtyOf } = useCart()
  const [qty, setQty] = useState(1)
  const cartQty = qtyOf(item.id)

  const handleAddToCart = (e) => {
    triggerCartAnimation(e)
    for (let i = 0; i < qty; i++) addItem(item)
  }

  /* Similar items: same category, exclude current */
  const similarItems = MENU_ITEMS.filter(
    m => m.category === item.category && m.id !== item.id
  ).slice(0, 6)

  const rating = item.rating ?? 4.5

  const DESCRIPTIONS = {
    default: 'A carefully crafted dish made with the finest ingredients, prepared fresh by our expert chefs. Every bite is a celebration of authentic flavors and culinary artistry that you will want to experience again and again.',
  }

  const longDesc = DESCRIPTIONS[item.id] ?? DESCRIPTIONS.default

  return (
    <div className="product-page">
      {/* Hero image */}
      <div className="product-hero">
        <img 
          src={item.image} 
          alt={item.name} 
          className="product-hero-img" 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80' }}
        />
        {/* Gradient overlay */}
        <div className="product-hero-overlay" />
        {/* Back button */}
        <button
          onClick={onBack}
          className="product-back-btn"
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {/* Badge on image */}
        {item.badge && (
          <span className={`product-badge ${BADGE_STYLES[item.badge] ?? 'bg-dark-700 text-dark-200 border-dark-600'}`}>
            {item.badge}
          </span>
        )}
      </div>

      {/* Scrollable content */}
      <div className="product-content">

        {/* Name & Veg indicator */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="product-name">{item.name}</h2>
          <span className={`flex-shrink-0 mt-1 w-5 h-5 rounded-sm border-2 flex items-center justify-center ${item.veg ? 'border-green-500' : 'border-red-500'}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`} />
          </span>
        </div>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={rating} />
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="product-price">₹{item.price}</span>
          <span className="text-zinc-600 line-through text-sm">₹{Math.round(item.price * 1.2)}</span>
          <span className="text-green-400 text-xs font-semibold bg-green-500/10 px-2 py-0.5 rounded-full">20% OFF</span>
        </div>

        {/* Description */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-2">About this dish</h3>
          <p className="text-sm text-zinc-500 leading-relaxed">{item.description}. {longDesc}</p>
        </div>

        {/* Tags row */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['Fresh', 'Hygienic', 'Chef Crafted', item.veg ? 'Pure Veg' : 'Non-Veg'].map(tag => (
            <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold text-zinc-300">Quantity</span>
          <div className="flex items-center gap-4 bg-zinc-900 rounded-full px-2 py-1 border border-white/10">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xl bg-zinc-800 hover:bg-zinc-700 transition-colors active:scale-90"
            >
              −
            </button>
            <span className="text-white font-bold text-lg w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xl bg-brand-500 hover:bg-brand-400 transition-colors active:scale-90"
            >
              +
            </button>
          </div>
        </div>

        {/* Similar items */}
        {similarItems.length > 0 && (
          <div className="mb-28">
            <div className="section-header mb-3">
              <h3 className="section-title">You May Also Like</h3>
            </div>
            <div className="similar-scroll-track">
              {similarItems.map(si => (
                <SimilarCard key={si.id} item={si} onView={onBack} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Add to Cart bar */}
      <div className="product-sticky-bar">
        <div className="product-sticky-inner">
          <div>
            <p className="text-xs text-zinc-500">Total price</p>
            <p className="text-white font-bold text-lg">₹{item.price * qty}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="product-add-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
