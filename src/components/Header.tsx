'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart, LogOut, LayoutDashboard, ShoppingBag, ChevronDown } from 'lucide-react'
import CartDrawer from './CartDrawer'
import { useCart } from './CartContext'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/watches', label: 'Watches', audiences: true },
  { href: '/bags', label: 'Bags', audiences: true },
  { href: '/clothes', label: 'Clothes', audiences: true },
  { href: '/shoes', label: 'Shoes', audiences: true },
  { href: '/belts', label: 'Belts', audiences: true },
  { href: '/eyeglasses', label: 'Eyeglasses', audiences: true },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null)
  const { items } = useCart()
  const { user, logout, isAdmin } = useAuth()
  const pathname = usePathname()

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 sm:px-6 sm:pt-6 md:px-12 lg:px-16">
        <div className="liquid-glass header-glass flex items-center justify-between rounded-xl px-3 py-2 text-white sm:px-4">
          <Link href="/" className="relative z-10 text-xl font-semibold tracking-tight sm:text-2xl">
            SENATOR
          </Link>

          <nav className="relative z-10 hidden items-center gap-4 text-sm lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <div key={link.href} className="group relative py-2">
                <Link href={link.href} className="flex items-center gap-1.5 whitespace-nowrap font-medium text-white/90 transition-colors hover:text-white">
                  {link.label}
                  {link.audiences && <ChevronDown size={14} className="text-white/50 transition-transform duration-200 group-hover:rotate-180" />}
                </Link>
                {link.audiences && (
                  <div className="pointer-events-none invisible absolute left-1/2 top-full w-36 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/95 p-1.5 shadow-xl shadow-black/25 backdrop-blur-xl">
                      <Link href={`${link.href}/men`} className="block rounded-lg px-3 py-2.5 font-medium text-white/70 transition hover:bg-white/10 hover:text-white">Men</Link>
                      <Link href={`${link.href}/women`} className="block rounded-lg px-3 py-2.5 font-medium text-white/70 transition hover:bg-white/10 hover:text-white">Women</Link>
                      <Link href={`${link.href}/unisex`} className="block rounded-lg px-3 py-2.5 font-medium text-white/70 transition hover:bg-white/10 hover:text-white">Unisex</Link>
                    </div>
                  </div>
                )}
              </div>
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
        className="fixed inset-0 z-40 overflow-y-auto bg-black/95 px-4 pb-10 pt-24 text-white backdrop-blur-xl lg:hidden"
      >
        <nav className="mx-auto flex max-w-lg flex-col gap-6 text-center">
          <div className="border-y border-white/10 text-left">
            <p className="py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">Shop categories</p>
            {navLinks.map((link) => (
              <div key={link.href} className="border-t border-white/10 first:border-t-0">
                {link.audiences ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setMobileCategoryOpen((current) => current === link.href ? null : link.href)}
                      className="flex min-h-14 w-full items-center justify-between py-4 text-left text-lg font-medium text-white"
                      aria-expanded={mobileCategoryOpen === link.href}
                    >
                      {link.label}
                      <ChevronDown size={18} className={`text-white/45 transition-transform ${mobileCategoryOpen === link.href ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid overflow-hidden transition-all duration-200 ${mobileCategoryOpen === link.href ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="min-h-0">
                        <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/[0.05] p-2 text-center text-sm font-semibold">
                          <Link href={`${link.href}/men`} onClick={() => { setIsMenuOpen(false); setMobileCategoryOpen(null) }} className="rounded-lg px-2 py-3 text-white/65 active:bg-white/10">Men</Link>
                          <Link href={`${link.href}/women`} onClick={() => { setIsMenuOpen(false); setMobileCategoryOpen(null) }} className="rounded-lg bg-white px-2 py-3 text-black active:bg-white/80">Women</Link>
                          <Link href={`${link.href}/unisex`} onClick={() => { setIsMenuOpen(false); setMobileCategoryOpen(null) }} className="rounded-lg px-2 py-3 text-white/65 active:bg-white/10">Unisex</Link>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href={link.href} onClick={() => setIsMenuOpen(false)} className="flex min-h-14 items-center py-4 text-lg font-medium text-white">
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
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
