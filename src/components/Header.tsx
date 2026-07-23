'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react'
import CartDrawer from './CartDrawer'
import { useCart } from './CartContext'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/watches', label: 'Watches' },
  { href: '/bags', label: 'Bags' },
  { href: '/clothes', label: 'Clothes' },
  { href: '/belts', label: 'Belts' },
  { href: '/eyeglasses', label: 'Eyeglasses' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const pathname = usePathname()

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-6 sm:pt-6 md:px-12 lg:px-16">
        <div className="liquid-glass flex items-center justify-between rounded-xl px-3 py-2 text-white sm:px-4">
          <Link href="/" className="relative z-10 text-xl font-semibold tracking-tight sm:text-2xl">
            SENATOR
          </Link>

          <nav className="relative z-10 hidden lg:flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-white/90 transition-colors hover:text-gray-300">
                {link.label}
              </Link>
            ))}

          </nav>

          <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
            {user ? (
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/orders" className="text-sm font-medium text-white/85 transition-colors hover:text-white">
                  My Orders
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-white/80 transition-colors hover:text-white" aria-label="Admin dashboard">
                    <LayoutDashboard size={20} />
                  </Link>
                )}
                <button onClick={logout} className="text-white/80 transition-colors hover:text-red-200" aria-label="Log out">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden h-10 items-center justify-center rounded-lg border border-white/25 px-4 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-950 lg:inline-flex">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center h-10 w-10 rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label="Open cart"
            >
              <ShoppingCart size={18} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white transition-colors hover:text-gray-300"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <motion.div
        initial={false}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'auto' : 'none'
        }}
        className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden pt-28 px-6 text-white"
      >
        <nav className="flex flex-col space-y-6 text-center">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif">
              {link.label}
            </Link>
          ))}

          <Link href="/collections" onClick={() => setIsMenuOpen(false)} className="text-xl text-white/75">Collections</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-xl text-white/75">Our Story</Link>
          {!user && (
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-lg text-white/70 mt-4">Sign In</Link>
          )}
          {user && (
            <>
              <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="text-lg text-white/80 mt-2 flex items-center justify-center gap-2">
                <ShoppingBag size={18} />
                My Orders
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-lg text-white/80 flex items-center justify-center gap-2">
                  <LayoutDashboard size={18} />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  logout()
                }}
                className="mx-auto mt-4 flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-red-300/30 bg-red-500/15 px-6 py-3 text-base font-semibold text-red-100 shadow-sm transition-colors hover:bg-red-500/25"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </>
          )}
        </nav>
      </motion.div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
