'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart, User, Search, Heart } from 'lucide-react'
import CartDrawer from './CartDrawer'
import { useCart } from './CartContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass backdrop-blur-md border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal to-gold rounded-lg flex items-center justify-center">
                <span className="text-midnight font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-display font-bold text-gradient">
                Senator Watches
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-silver hover:text-teal transition-colors">
                Home
              </Link>
              <Link href="/shop" className="text-silver hover:text-teal transition-colors">
                Shop
              </Link>
              <Link href="/collections" className="text-silver hover:text-teal transition-colors">
                Collections
              </Link>
              <Link href="/about" className="text-silver hover:text-teal transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-silver hover:text-teal transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-silver hover:text-teal transition-colors">
                <Search size={20} />
              </button>
              <button className="p-2 text-silver hover:text-teal transition-colors">
                <Heart size={20} />
              </button>
              <Link href="/login" className="p-2 text-silver hover:text-teal transition-colors">
                <User size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-silver hover:text-teal transition-colors"
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-teal text-midnight text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-silver hover:text-teal transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isMenuOpen ? 'auto' : 0 }}
            className="md:hidden overflow-hidden"
          >
            <nav className="py-4 space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-silver hover:text-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="block px-4 py-2 text-silver hover:text-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/collections"
                className="block px-4 py-2 text-silver hover:text-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-silver hover:text-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-silver hover:text-teal transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

