'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import { allProducts } from '@/lib/products'
import { Suspense } from 'react'

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopContent />
    </Suspense>
  )
}

function ShopContent() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const categories = ['all', 'classic', 'modern', 'luxury']

  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">

      {/* Minimal Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
          The Collection
        </h1>

        {/* Simple Pill Filters */}
        <div className="flex justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Grid - Oura Style */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 text-slate-400">
            No timepieces found in this category.
          </div>
        )}
      </div>
    </div>
  )
}
