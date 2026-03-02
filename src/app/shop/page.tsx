'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import { allProducts } from '@/lib/products'
import { Suspense } from 'react'

type ShopProduct = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizeStaticProducts(): ShopProduct[] {
  return allProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    isNew: product.isNew,
  }))
}

function normalizeApiProduct(product: any): ShopProduct {
  const slug = product.slug || toSlug(product.name || '')
  const image = product.image || product.images?.[0] || '/assets/images/heritage-classic-v2.png'

  return {
    id: String(product.id || product._id || slug),
    slug,
    name: product.name || 'Untitled Product',
    price: Number(product.price || 0),
    image,
    category: String(product.category || 'Uncategorized'),
    isNew: Boolean(product.isNew),
  }
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ShopContent />
    </Suspense>
  )
}

function ShopContent() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState<ShopProduct[]>(() => normalizeStaticProducts())

  useEffect(() => {
    let isCancelled = false

    async function loadProducts() {
      try {
        const res = await fetch('/api/products?limit=200', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok || !data?.success || !Array.isArray(data?.data)) return

        const apiProducts = data.data
          .map(normalizeApiProduct)
          .filter((product: ShopProduct) => product.slug)

        if (isCancelled) return

        setProducts((prev) => {
          const combined = [...prev, ...apiProducts]
          const seen = new Set<string>()
          return combined.filter((product) => {
            const key = product.slug
            if (seen.has(key)) return false
            seen.add(key)
            return true
          })
        })
      } catch (error) {
        console.error('Error fetching shop products:', error)
      }
    }

    loadProducts()
    return () => {
      isCancelled = true
    }
  }, [])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  )

  useEffect(() => {
    if (selectedCategory !== 'all' && !categories.includes(selectedCategory)) {
      setSelectedCategory('all')
    }
  }, [categories, selectedCategory])

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((product) => product.category === selectedCategory)

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
