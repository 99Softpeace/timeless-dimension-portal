'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart, User, Heart, LogOut, LayoutDashboard } from 'lucide-react'
import CartDrawer from './CartDrawer'
import { useCart } from './CartContext'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const pathname = usePathname()

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  if (pathname.startsWith('/admin')) return null

  // Always White Header - Oura Style
  // Fixes visibility issues ensuring dark text on light background is always grounded
  const headerClass = 'bg-white/95 backdrop-blur-md py-4 border-b border-black/5'
  const textColor = 'text-slate-900'
  const hoverColor = 'hover:text-teal-600'

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* 1. Logo (Far Left) */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className={`text-2xl font-serif font-bold tracking-tighter ${textColor}`}>
                SENATOR
              </span>
            </Link>

            {/* 2. Desktop Navigation (Centered) */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <Link href="/" className={`text-sm font-medium ${textColor} ${hoverColor} transition-colors uppercase tracking-wide`}>
                Home
              </Link>
              <Link href="/shop" className={`text-sm font-medium ${textColor} ${hoverColor} transition-colors uppercase tracking-wide`}>
                Shop
              </Link>
              <Link href="/collections" className={`text-sm font-medium ${textColor} ${hoverColor} transition-colors uppercase tracking-wide`}>
                Collections
              </Link>
              <Link href="/about" className={`text-sm font-medium ${textColor} ${hoverColor} transition-colors uppercase tracking-wide`}>
                Our Story
              </Link>
            </nav>

            {/* 3. Icons / Actions (Far Right) */}
            <div className="flex items-center gap-6">

              {/* User/Admin */}
              {user ? (
                <div className="hidden sm:flex items-center gap-4">
                  {isAdmin && (
                    <Link href="/admin" className={`${textColor}/60 ${hoverColor}`}>
                      <LayoutDashboard size={20} />
                    </Link>
                  )}
                  <button onClick={logout} className={`${textColor}/60 hover:text-red-500`}>
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link href="/login" className={`hidden sm:block ${textColor} ${hoverColor} font-medium text-sm`}>
                  Sign In
                </Link>
              )}

              {/* Cart - Oura Style circular border */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative group flex items-center justify-center w-10 h-10 rounded-full border border-slate-900/20 hover:border-slate-900/50 transition-all`}
              >
                <ShoppingCart size={18} className={`${textColor} group-hover:scale-110 transition-transform`} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden ${textColor} ${hoverColor} transition-colors`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none'
        }}
        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden pt-24 px-6"
      >
        <nav className="flex flex-col space-y-6 text-center">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif text-midnight">Home</Link>
          <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif text-midnight">Shop</Link>
          <Link href="/collections" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif text-midnight">Collections</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-serif text-midnight">Our Story</Link>
          {/* Mobile Auth */}
          {!user && (
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-lg text-midnight/60 mt-4">Sign In</Link>
          )}
        </nav>
      </motion.div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
