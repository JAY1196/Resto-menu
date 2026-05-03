import { createContext, useContext, useReducer, useCallback } from 'react'

/* ── Context ─────────────────────────────────────────────────── */
const CartContext = createContext(null)

/* ── Reducer ─────────────────────────────────────────────────── */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] }
    }

    case 'REMOVE_ITEM': {
      const existing = state.items.find(i => i.id === action.id)
      if (!existing) return state
      if (existing.qty === 1) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: i.qty - 1 } : i
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'SET_TABLE':
      return { ...state, tableNumber: action.tableNumber }

    default:
      return state
  }
}

/* ── Provider ────────────────────────────────────────────────── */
export function CartProvider({ children, initialTable = '5' }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    tableNumber: initialTable,
  })

  const addItem    = useCallback(item => dispatch({ type: 'ADD_ITEM', item }), [])
  const removeItem = useCallback(id   => dispatch({ type: 'REMOVE_ITEM', id }), [])
  const clearCart  = useCallback(()   => dispatch({ type: 'CLEAR_CART' }), [])
  const setTable   = useCallback(t    => dispatch({ type: 'SET_TABLE', tableNumber: t }), [])

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const qtyOf      = id => state.items.find(i => i.id === id)?.qty ?? 0

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        tableNumber: state.tableNumber,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        clearCart,
        setTable,
        qtyOf,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

/* ── Hook ────────────────────────────────────────────────────── */
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
