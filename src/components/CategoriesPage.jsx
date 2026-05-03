import { useState } from 'react'
import { CATEGORIES, CAT_META } from '../data/menuData'

/* Heart icon */
function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'} stroke={filled ? '#ef4444' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" className="w-4.5 h-4.5 w-[18px] h-[18px]">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* Arrow icon */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3.5 h-3.5">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function CategoriesPage({ onBack, onSelectCategory }) {
  const [liked, setLiked] = useState({})

  const toggleLike = (cat, e) => {
    e.stopPropagation()
    setLiked(prev => ({ ...prev, [cat]: !prev[cat] }))
  }

  return (
    <div className="categories-page">
      {/* Top bar */}
      <div className="categories-topbar">
        <button
          onClick={onBack}
          className="categories-back-btn"
          aria-label="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h2 className="categories-title">Categories</h2>

        {/* Bell icon */}
        <button className="categories-bell-btn" aria-label="Notifications">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Grid */}
      <div className="categories-grid">
        {CATEGORIES.map((cat) => {
          const meta = CAT_META[cat]
          const isLiked = liked[cat]
          return (
            <button
              key={cat}
              className="cat-card"
              onClick={() => onSelectCategory(cat)}
              aria-label={`Browse ${cat}`}
            >
              {/* Heart */}
              <button
                className="cat-card-heart"
                onClick={(e) => toggleLike(cat, e)}
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                <HeartIcon filled={isLiked} />
              </button>

              {/* Food image */}
              <div className="cat-card-img-wrap">
                <img
                  src={meta.image}
                  alt={cat}
                  className="cat-card-img"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="cat-card-info">
                <div>
                  <p className="cat-card-name">{cat}</p>
                  <p className="cat-card-count">{meta.count} items</p>
                </div>
                <div className="cat-card-arrow">
                  <ArrowIcon />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
