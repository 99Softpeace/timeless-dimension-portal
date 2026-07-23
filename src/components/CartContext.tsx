'use client'

import { createContext, useContext, useEffect, useReducer, useRef, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug: string
  selectedColor?: string
  cartKey?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'HYDRATE_CART'; payload: CartItem[] }

const initialState: CartState = {
  items: [],
  isOpen: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE_CART':
      return { ...state, items: action.payload }

    case 'ADD_ITEM': {
      const incomingCartKey = `${action.payload.id}::${action.payload.selectedColor || ''}`
      const existingItem = state.items.find(item => (item.cartKey || item.id) === incomingCartKey)
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            (item.cartKey || item.id) === incomingCartKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      
      return {
        ...state,
        items: [...state.items, { ...action.payload, cartKey: incomingCartKey, quantity: 1 }],
      }
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => (item.cartKey || item.id) !== action.payload),
      }
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          (item.cartKey || item.id) === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      }
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    
    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      }
    
    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (isOpen: boolean) => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const hydrated = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function hydrateCart() {
      const localItems = (() => { try { return JSON.parse(localStorage.getItem('senator-cart') || '[]') } catch { return [] } })()
      const token = localStorage.getItem('token')
      let items = Array.isArray(localItems) ? localItems : []
      if (token) {
        try {
          const response = await fetch('/api/cart', { headers: { Authorization: `Bearer ${token}` } })
          const result = await response.json()
          if (response.ok && Array.isArray(result.data) && result.data.length) items = result.data
        } catch (error) { console.error('Could not restore saved cart:', error) }
      }
      if (!cancelled) { dispatch({ type: 'HYDRATE_CART', payload: items }); hydrated.current = true }
    }
    hydrateCart()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    localStorage.setItem('senator-cart', JSON.stringify(state.items))
    const token = localStorage.getItem('token')
    if (!token) return
    const timer = window.setTimeout(() => {
      fetch('/api/cart', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ items: state.items }) }).catch((error) => console.error('Could not save cart:', error))
    }, 500)
    return () => window.clearTimeout(timer)
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const setCartOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_CART_OPEN', payload: isOpen })
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
