import { useState } from 'react'
import { useCart } from '../context/CartContext'

const VEG_DOT = (
  <span className="inline-flex items-center justify-center w-4 h-4 border border-green-500 rounded-sm flex-shrink-0">
    <span className="w-2 h-2 bg-green-500 rounded-full" />
  </span>
)

const NON_VEG_DOT = (
  <span className="inline-flex items-center justify-center w-4 h-4 border border-red-500 rounded-sm flex-shrink-0">
    <span className="w-2 h-2 bg-red-500 rounded-full" />
  </span>
)

const BADGE_STYLES = {
  "Chef's Pick": 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Bestseller':  'bg-green-500/20  text-green-400  border-green-500/30',
  'Spicy':       'bg-red-500/20    text-red-400    border-red-500/30',
  'Seasonal':    'bg-sky-500/20    text-sky-400    border-sky-500/30',
  'Summer Hit':  'bg-pink-500/20   text-pink-400   border-pink-500/30',
  'Veg':         'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'No Alcohol':  'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

export default function ItemCard({ item }) {
  const { addItem, removeItem, qtyOf } = useCart()
  const [imgLoaded, setImgLoaded] = useState(false)
  const qty = qtyOf(item.id)

  return (
    <div className="glass rounded-none overflow-hidden flex flex-col group transition-all duration-300 hover:border-brand-500/30 hover:translate-x-1 hover:translate-y-1">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden bg-dark-800">
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Badge */}
        {item.badge && (
          <span
            className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-none border-2 border-[#3f3a35] ${BADGE_STYLES[item.badge] ?? 'bg-dark-700 text-dark-200'} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
          >
            {item.badge}
          </span>
        )}
        {/* Veg / Non-veg indicator */}
        <span className="absolute top-2.5 right-2.5">
          {item.veg ? VEG_DOT : NON_VEG_DOT}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-white text-sm leading-snug">{item.name}</h3>
        <p className="text-dark-400 text-xs leading-relaxed flex-1">{item.description}</p>

        <div className="flex items-center justify-between mt-1">
          {/* Price */}
          <span className="text-white font-bold text-base">
            ₹<span className="text-brand-400">{item.price}</span>
          </span>

          {/* Add / Quantity control */}
          {qty === 0 ? (
            <button
              onClick={() => addItem(item)}
              className="flex items-center gap-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-none border-2 border-transparent transition-all duration-150 active:translate-x-1 active:translate-y-1 shadow-[4px_4px_0px_0px_#991b1b] active:shadow-none"
            >
              <span className="text-base leading-none">+</span> ADD
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-dark-800 rounded-none px-1 py-1 border-2 border-brand-500/40 animate-bounce-in shadow-[4px_4px_0px_0px_#991b1b]">
              <button
                onClick={() => removeItem(item.id)}
                className="qty-btn bg-dark-700 hover:bg-dark-600 w-7 h-7 rounded-none"
              >
                −
              </button>
              <span className="text-white font-bold text-sm w-4 text-center">{qty}</span>
              <button
                onClick={() => addItem(item)}
                className="qty-btn bg-brand-500 hover:bg-brand-400 w-7 h-7 rounded-none"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
