'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { motion } from 'framer-motion'
import { Grid, List } from 'lucide-react'

type ProductFilter = 'all' | 'new' | 'best-seller' | 'sale' | 'accessories'

type ProductListingPageProps = {
  title: string
  description: string
  emptyMessage: string
  filter: ProductFilter
}

type ListingProduct = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isBestSeller?: boolean
  discount?: number
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizeApiProduct(product: any): ListingProduct {
  const slug = product.slug || toSlug(product.name || '')
  return {
    id: String(product.id || product._id || slug),
    slug,
    name: product.name || 'Untitled Product',
    price: Number(product.price || 0),
    image: product.image || product.images?.[0] || '/assets/images/heritage-classic-v2.png',
    category: String(product.category || 'Uncategorized'),
    isNew: Boolean(product.isNew),
    isBestSeller: Boolean(product.isBestSeller),
    discount: product.discount === undefined ? undefined : Number(product.discount),
  }
}

function applyFilter(product: ListingProduct, filter: ProductFilter) {
  const category = product.category.toLowerCase()
  if (filter === 'new') return product.isNew
  if (filter === 'best-seller') return product.isBestSeller
  if (filter === 'sale') return Number(product.discount || 0) > 0
  if (filter === 'accessories') return category.includes('accessor') || category.includes('strap') || category.includes('bracelet')
  return true
}

export default function ProductListingPage({ title, description, emptyMessage, filter }: ProductListingPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState<ListingProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadProducts() {
      try {
        setLoading(true)
        const res = await fetch('/api/products?limit=200', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok || !data?.success || !Array.isArray(data?.data)) return

        const nextProducts = data.data
          .map(normalizeApiProduct)
          .filter((product: ListingProduct) => product.slug)

        if (!isCancelled) setProducts(nextProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      isCancelled = true
    }
  }, [])

  const filteredProducts = useMemo(
    () => products.filter((product) => applyFilter(product, filter)),
    [filter, products]
  )

  return (
    <motion.div
      className="pt-24 pb-16 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-glass-border pb-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">{title}</h1>
            <p className="text-silver-dark text-lg max-w-2xl">{description}</p>
          </div>

          <div className="flex glass rounded-lg p-1 mt-4 md:mt-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-teal text-midnight' : 'text-silver-dark hover:text-silver'}`}
              aria-label="Grid view"
            >
              <Grid size={20} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-teal text-midnight' : 'text-silver-dark hover:text-silver'}`}
              aria-label="List view"
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-silver-dark text-xl">{loading ? 'Loading products...' : emptyMessage}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
