'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ArrowRight, Trash2 } from 'lucide-react'
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-100">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1 block">
                  YOUR SELECTION
                </span>
                <h2 className="text-3xl font-serif font-bold text-slate-900">
                  Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-4xl mb-4 text-slate-300">∅</span>
                  <h3 className="text-lg font-serif font-medium text-slate-900 mb-2">
                    Your cart is empty.
                  </h3>
                  <p className="text-slate-500 text-sm mb-8 font-light">
                    Time waits for no one.
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="border-b border-slate-900 pb-1 text-sm uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-6 group"
                    >
                      {/* Square Image */}
                      <div className="relative w-24 h-24 bg-slate-50 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2 mix-blend-multiply"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-lg text-slate-900 leading-tight pr-4">
                              {item.name}
                            </h4>
                            <p className="font-mono text-sm text-slate-600">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-slate-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-slate-900 text-sm font-mono w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-slate-400 hover:text-red-600 uppercase tracking-wider underline decoration-slate-200 hover:decoration-red-200 underline-offset-4 transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-slate-100 p-8 space-y-6 bg-slate-50/50">
                <div className="flex justify-between items-end">
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Subtotal</span>
                  <span className="text-3xl font-serif font-bold text-slate-900">
                    ₦{getTotalPrice().toLocaleString()}
                  </span>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full bg-slate-900 text-white py-4 px-6 flex items-center justify-between hover:bg-teal-700 transition-colors group"
                  >
                    <span className="font-medium tracking-wide text-sm">PROCEED TO CHECKOUT</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </Link>

                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest py-2"
                  >
                    Empty Cart
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
