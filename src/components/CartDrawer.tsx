'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from './CartContext'
import Link from 'next/link'
import Image from 'next/image'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-midnight-2 border-l border-glass-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-glass-border">
              <h2 className="text-xl font-display font-semibold text-silver">
                Shopping Cart
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-silver-dark hover:text-teal transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-silver-dark mb-4" />
                  <h3 className="text-lg font-medium text-silver mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-silver-dark text-sm mb-6">
                    Add some watches to get started
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="btn-primary"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 glass rounded-xl"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-midnight-3">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-silver font-medium text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-teal font-semibold text-sm">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-silver-dark hover:text-teal transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-silver text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-silver-dark hover:text-teal transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-silver-dark hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-glass-border p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-silver font-medium">Total:</span>
                  <span className="text-2xl font-display font-bold text-teal">
                    ₦{getTotalPrice().toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full btn-primary text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                  
                  <button
                    onClick={clearCart}
                    className="w-full text-silver-dark hover:text-red-400 transition-colors text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
