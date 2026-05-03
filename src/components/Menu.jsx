import { useState, useRef, useEffect, useCallback } from 'react'
import { CATEGORIES, CAT_META, MENU_ITEMS, POPULAR_IDS, RECOMMENDED_IDS, TRENDING_IDS } from '../data/menuData'
import ItemCard from './ItemCard'
import CategoriesPage from './CategoriesPage'
import ProductDetailPage from './ProductDetailPage'
import { useCart } from '../context/CartContext'

/* ── Banners ──────────────────────────────────────────────────── */
const BANNERS = [
  {
    id: 1, title: 'Our Best Seller!', subtitle: 'Loved by thousands, now at your table',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    cta: 'Order Now', from: '#ea580c', to: '#f97316', itemId: 'm1',
  },
  {
    id: 2, title: "Chef's Special!", subtitle: 'Freshly crafted, limited availability',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
    cta: 'Try Now', from: '#7c3aed', to: '#a855f7', itemId: 'p1',
  },
  {
    id: 3, title: 'Smash Burger Drop!', subtitle: 'Double patty, limited time offer',
    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&q=80',
    cta: 'Grab It', from: '#0f766e', to: '#14b8a6', itemId: 'b5',
  },
]

const NAV_TABS = [
  { id: 'home', label: 'Home', icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 21V12h6v9" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { id: 'categories', label: 'Categories', icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round"/>
    </svg>
  )},
  { id: 'cart', label: 'My Cart', icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
      <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { id: 'profile', label: 'Profile', icon: (a) => (
    <svg viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="4" strokeLinecap="round"/>
    </svg>
  )},
]

/* ── Star rating ─────────────────────────────────────────────── */
function StarRating({ rating = 4.5 }) {
  return (
    <span className="flex items-center gap-1">
      <svg viewBox="0 0 20 20" fill="#facc15" className="w-3.5 h-3.5">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <span className="text-xs font-semibold text-yellow-400">{rating}</span>
    </span>
  )
}

/* ── Horizontal scroll dish card ────────────────────────────── */
function DishCard({ item, onView }) {
  const { addItem, qtyOf } = useCart()
  const qty = qtyOf(item.id)
  const rating = item.rating ?? 4.5

  return (
    <div className="dish-card" onClick={() => onView(item)}>
      <div className="dish-card-img-wrap">
        <img src={item.image} alt={item.name} className="dish-card-img" loading="lazy" />
        {item.badge && (
          <span className="dish-card-badge">{item.badge}</span>
        )}
      </div>
      <div className="dish-card-body">
        <p className="dish-card-name">{item.name}</p>
        <StarRating rating={rating} />
        <div className="flex items-center justify-between mt-2">
          <span className="dish-card-price">₹{item.price}</span>
          <button
            onClick={(e) => { e.stopPropagation(); addItem(item) }}
            className={`dish-add-btn ${qty > 0 ? 'dish-add-btn--added' : ''}`}
            aria-label={`Add ${item.name}`}
          >
            {qty > 0 ? qty : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Horizontal section ──────────────────────────────────────── */
function HScrollSection({ title, ids, onSeeAll, onView }) {
  const items = MENU_ITEMS.filter(i => ids.includes(i.id))
  return (
    <section className="mb-7">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        <button className="section-link" onClick={onSeeAll}>See all</button>
      </div>
      <div className="dish-scroll-track">
        {items.map(item => (
          <DishCard key={item.id} item={item} onView={onView} />
        ))}
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN MENU
══════════════════════════════════════════════════════════════ */
export default function Menu({ onCartOpen }) {
  const [activeTab,      setActiveTab]      = useState('home')
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [bannerIndex,    setBannerIndex]    = useState(0)
  const [searchQuery,    setSearchQuery]    = useState('')
  const [selectedItem,   setSelectedItem]   = useState(null)
  const pillsRef    = useRef(null)
  const carouselRef = useRef(null)
  const dragState   = useRef({ active: false, startX: 0, scrollLeft: 0 })
  const { totalItems, addItem } = useCart()

  /* ── Carousel sync ─────────────────────────────────────────── */
  useEffect(() => {
    const c = carouselRef.current
    if (!c) return
    const slides = Array.from(c.querySelectorAll('[data-banner-slide]'))
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          const idx = slides.indexOf(e.target)
          if (idx !== -1) setBannerIndex(idx)
        }
      }),
      { root: c, threshold: 0.6 }
    )
    slides.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const c = carouselRef.current
      if (!c) return
      const slides = c.querySelectorAll('[data-banner-slide]')
      const next = (bannerIndex + 1) % slides.length
      slides[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }, 4000)
    return () => clearInterval(id)
  }, [bannerIndex])

  const goToSlide = useCallback(idx => {
    const c = carouselRef.current
    if (!c) return
    c.querySelectorAll('[data-banner-slide]')[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [])

  const onMouseDown = e => {
    const ds = dragState.current
    ds.active = true; ds.startX = e.pageX; ds.scrollLeft = carouselRef.current.scrollLeft
    carouselRef.current.style.cursor = 'grabbing'
  }
  const onMouseMove = e => {
    if (!dragState.current.active) return
    e.preventDefault()
    carouselRef.current.scrollLeft = dragState.current.scrollLeft - (e.pageX - dragState.current.startX)
  }
  const onMouseUp = () => {
    dragState.current.active = false
    if (carouselRef.current) carouselRef.current.style.cursor = 'grab'
  }

  useEffect(() => {
    const c = pillsRef.current
    if (!c) return
    c.querySelector('[data-active="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeCategory])

  /* ── Filtered items for menu tab ───────────────────────────── */
  const filteredItems = searchQuery.trim()
    ? MENU_ITEMS.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : MENU_ITEMS.filter(i => i.category === activeCategory)

  /* ── Navigate to product detail ────────────────────────────── */
  const openItem = item => setSelectedItem(item)
  const closeItem = () => setSelectedItem(null)

  /* ── Categories page: open category → menu tab ─────────────── */
  const openCategory = cat => {
    setActiveCategory(cat)
    setActiveTab('menu')
    setSelectedItem(null)
  }

  /* ── If product detail is open, show it full-screen ─────────── */
  if (selectedItem) {
    return (
      <div className="app-shell">
        <div className="app-scroll-area">
          <ProductDetailPage item={selectedItem} onBack={closeItem} />
        </div>
        {/* Bottom nav stays */}
        <nav className="bottom-nav" role="navigation">
          {NAV_TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button key={tab.id}
                onClick={() => { setSelectedItem(null); setActiveTab(tab.id); if (tab.id === 'cart') onCartOpen() }}
                className={`bottom-nav-tab ${isActive ? 'bottom-nav-tab--active' : ''}`}
              >
                {tab.icon(isActive)}
                <span className="bottom-nav-label">{tab.label}</span>
                {tab.id === 'cart' && totalItems > 0 && (
                  <span className="bottom-nav-badge">{totalItems > 9 ? '9+' : totalItems}</span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <main className="app-scroll-area">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-28">

          {/* ── Greeting + Search ──────────────────────────────── */}
          <section className="mb-5">
            <p className="text-sm text-zinc-400 font-medium mb-0.5">Hello, Guest 👋</p>
            <h2 className="text-2xl font-bold text-white leading-tight mb-4">
              What would you<br />
              <span className="home-gradient-text">like to eat?</span>
            </h2>
            <div className="search-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-zinc-400 flex-shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search dishes, drinks…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-filter-btn" aria-label="Filter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <line x1="4" y1="6" x2="20" y2="6" strokeLinecap="round"/>
                  <line x1="7" y1="12" x2="17" y2="12" strokeLinecap="round"/>
                  <line x1="10" y1="18" x2="14" y2="18" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </section>

          {/* ── Search results ──────────────────────────────────── */}
          {searchQuery.trim() ? (
            <section className="mb-6">
              <p className="section-eyebrow mb-3">
                {filteredItems.length} result{filteredItems.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
              <div className="flex flex-col gap-3">
                {filteredItems.map(item => (
                  <PopularCard key={item.id} item={item} onAddToCart={() => addItem(item)} onView={() => openItem(item)} />
                ))}
                {filteredItems.length === 0 && (
                  <div className="py-12 text-center text-zinc-500 text-sm">No items match your search</div>
                )}
              </div>
            </section>
          ) : (
            <>
              {/* ── HOME TAB ────────────────────────────────────── */}
              {activeTab === 'home' && (
                <>
                  {/* Featured Banner */}
                  <section className="mb-6">
                    <div
                      ref={carouselRef}
                      className="banner-carousel-track"
                      onMouseDown={onMouseDown}
                      onMouseMove={onMouseMove}
                      onMouseUp={onMouseUp}
                      onMouseLeave={onMouseUp}
                    >
                      {BANNERS.map((b, i) => (
                        <div
                          key={b.id}
                          data-banner-slide
                          className="banner-slide"
                          style={{ background: `linear-gradient(135deg, ${b.from} 0%, ${b.to} 100%)` }}
                        >
                          <div className="banner-circle banner-circle--1" aria-hidden="true" />
                          <div className="banner-circle banner-circle--2" aria-hidden="true" />
                          <div className="banner-text">
                            <span className="banner-eyebrow">🔥 Featured</span>
                            <h3 className="banner-title">{b.title}</h3>
                            <p className="banner-subtitle">{b.subtitle}</p>
                            <button
                              className="banner-btn"
                              onClick={() => { const item = MENU_ITEMS.find(m => m.id === b.itemId); if (item) addItem(item) }}
                            >{b.cta}</button>
                          </div>
                          <div className="banner-img-wrap">
                            <img src={b.image} alt={b.title} className="banner-img" loading="lazy" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-3">
                      {BANNERS.map((_, i) => (
                        <button key={i} onClick={() => goToSlide(i)}
                          className={`carousel-dot ${i === bannerIndex ? 'carousel-dot--active' : ''}`}
                          aria-label={`Slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </section>

                  {/* Categories strip */}
                  <section className="mb-6">
                    <div className="section-header">
                      <h3 className="section-title">Categories</h3>
                      <button className="section-link" onClick={() => setActiveTab('categories')}>See all</button>
                    </div>
                    <div className="cat-scroll-track">
                      {CATEGORIES.map(cat => {
                        const meta = CAT_META[cat]
                        const isActive = cat === activeCategory
                        return (
                          <button
                            key={cat}
                            className="cat-chip"
                            onClick={() => { setActiveCategory(cat); setActiveTab('menu') }}
                          >
                            <div className={`cat-chip-icon ${isActive ? 'cat-chip-icon--active' : ''}`}>
                              <img
                                src={meta.image}
                                alt={cat}
                                className="cat-chip-img"
                                loading="lazy"
                              />
                            </div>
                            <span className={`cat-chip-label ${isActive ? 'cat-chip-label--active' : ''}`}>
                              {cat.split(' ')[0]}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </section>

                  {/* Popular Dishes */}
                  <HScrollSection
                    title="🔥 Popular Dishes"
                    ids={POPULAR_IDS}
                    onSeeAll={() => setActiveTab('menu')}
                    onView={openItem}
                  />

                  {/* Recommended */}
                  <HScrollSection
                    title="⭐ Recommended for You"
                    ids={RECOMMENDED_IDS}
                    onSeeAll={() => setActiveTab('menu')}
                    onView={openItem}
                  />

                  {/* Trending */}
                  <HScrollSection
                    title="📈 Trending Now"
                    ids={TRENDING_IDS}
                    onSeeAll={() => setActiveTab('menu')}
                    onView={openItem}
                  />
                </>
              )}

              {/* ── CATEGORIES TAB ──────────────────────────────── */}
              {activeTab === 'categories' && (
                <CategoriesPage
                  onBack={() => setActiveTab('home')}
                  onSelectCategory={openCategory}
                />
              )}

              {/* ── MENU TAB ────────────────────────────────────── */}
              {activeTab === 'menu' && (
                <>
                  {/* Pill filter bar */}
                  <div
                    ref={pillsRef}
                    className="flex gap-2 overflow-x-auto no-scrollbar py-2 mb-4 -mx-4 px-4 sticky top-[61px] z-30 bg-black/80 backdrop-blur-md"
                  >
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        data-active={cat === activeCategory}
                        className={`category-pill ${cat === activeCategory ? 'active' : 'inactive'}`}
                        onClick={() => setActiveCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <p className="section-eyebrow mb-3">{filteredItems.length} items</p>
                  <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                    {filteredItems.map(item => (
                      <div key={item.id} onClick={() => openItem(item)} className="cursor-pointer">
                        <ItemCard item={item} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── CART TAB ──────────────────────────────────────── */}
              {activeTab === 'cart' && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-zinc-600">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
                      <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg mb-1">Your cart</p>
                    <p className="text-zinc-500 text-sm">
                      {totalItems > 0 ? `${totalItems} item${totalItems !== 1 ? 's' : ''} added` : 'Nothing added yet'}
                    </p>
                  </div>
                  {totalItems > 0 && (
                    <button onClick={onCartOpen} className="btn-primary mt-2 px-8 py-3 text-sm">Review Order</button>
                  )}
                </div>
              )}

              {/* ── PROFILE TAB ──────────────────────────────────── */}
              {activeTab === 'profile' && (
                <div className="flex flex-col items-center py-16 gap-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-orange-500/30">
                    G
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-xl">Guest</p>
                    <p className="text-zinc-500 text-sm mt-1">Table scan session</p>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-2xl divide-y divide-white/[0.05] border border-white/[0.06]">
                    {['My Orders', 'Favourites', 'Dietary Preferences', 'Help & Support'].map(label => (
                      <button key={label} className="w-full flex items-center justify-between px-5 py-4 text-sm text-zinc-200 hover:text-white hover:bg-white/[0.03] transition-colors rounded-2xl">
                        <span>{label}</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-zinc-600">
                          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Floating cart button ──────────────────────────────── */}
      {totalItems > 0 && activeTab !== 'cart' && (
        <button onClick={onCartOpen} id="floating-cart-btn" className="floating-cart-btn animate-bounce-in">
          <span className="absolute inset-0 rounded-full bg-brand-500 animate-pulse-ring" />
          <div className="floating-cart-inner">
            <span className="relative">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="floating-cart-badge">{totalItems > 9 ? '9+' : totalItems}</span>
            </span>
            <span>View Cart</span>
          </div>
        </button>
      )}

      {/* ── Bottom navigation ─────────────────────────────────── */}
      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {NAV_TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); if (tab.id === 'cart') onCartOpen() }}
              className={`bottom-nav-tab ${isActive ? 'bottom-nav-tab--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon(isActive)}
              <span className="bottom-nav-label">{tab.label}</span>
              {tab.id === 'cart' && totalItems > 0 && (
                <span className="bottom-nav-badge">{totalItems > 9 ? '9+' : totalItems}</span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

/* ── Popular / Search result card ────────────────────────────── */
function PopularCard({ item, onAddToCart, onView }) {
  const { qtyOf } = useCart()
  const qty = qtyOf(item.id)
  const rating = item.rating ?? 4.5

  return (
    <div className="popular-card" onClick={onView} style={{ cursor: 'pointer' }}>
      <img src={item.image} alt={item.name} className="popular-card-img" loading="lazy" />
      <div className="popular-card-body">
        <div className="flex items-start justify-between gap-2">
          <p className="popular-card-name">{item.name}</p>
          <button
            onClick={e => { e.stopPropagation(); onAddToCart() }}
            className={`popular-add-btn ${qty > 0 ? 'popular-add-btn--added' : ''}`}
            aria-label={`Add ${item.name}`}
          >
            {qty > 0 ? qty : '+'}
          </button>
        </div>
        <p className="popular-card-desc">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <StarRating rating={rating} />
          <span className="popular-card-price">₹{item.price}</span>
        </div>
      </div>
    </div>
  )
}
