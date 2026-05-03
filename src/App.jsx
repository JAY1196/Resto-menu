import { useState, useCallback } from 'react'
import { CartProvider } from './context/CartContext'
import Header       from './components/Header' // leaving import but removed usage just in case or we can delete it

import Menu         from './components/Menu'
import CartDrawer   from './components/CartDrawer'
import Toast        from './components/Toast'
import SplashScreen from './components/SplashScreen'

function getInitialTable() {
  try {
    const params = new URLSearchParams(window.location.search)
    return params.get('table') || '5'
  } catch {
    return '5'
  }
}

export default function App() {
  const [splashDone,   setSplashDone]   = useState(false)
  const [cartOpen,     setCartOpen]     = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const openCart  = useCallback(() => setCartOpen(true),  [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  const handleOrderPlaced = useCallback(() => {
    setCartOpen(false)
    setToastVisible(true)
  }, [])

  if (!splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />
  }

  return (
    <CartProvider initialTable={getInitialTable()}>
      <Menu onCartOpen={openCart} />
      <CartDrawer isOpen={cartOpen} onClose={closeCart} onOrderPlaced={handleOrderPlaced} />
      <Toast message="Order Sent! 🎉" isVisible={toastVisible} onHide={() => setToastVisible(false)} />
    </CartProvider>
  )
}
