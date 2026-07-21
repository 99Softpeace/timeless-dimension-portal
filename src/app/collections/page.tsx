'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'

const collections = [
  {
    id: 'heritage',
    name: 'The Heritage Series',
    subtitle: 'Timeless Nigerian craftsmanship.',
    description: 'A tribute to the roots that ground us. The Heritage Series combines traditional Nigerian motifs with exacting horology standards.',
    image: '/assets/images/heritage-collection-poster.png',
    categories: ['heritage', 'classic'],
  },
  {
    id: 'modern',
    name: 'Modern Architecture',
    subtitle: 'Designed for the new age.',
    description: 'Clean lines, minimalist dials, and robust materials for the visionary building the future of Lagos and beyond.',
    image: '/assets/images/modern-collection-poster.png',
    categories: ['modern'],
  },
  {
    id: 'luxury',
    name: 'Senator Reserve',
    subtitle: 'The pinnacle of success.',
    description: 'Rare materials, refined finishing, and the strongest expressions of the Senator collection.',
    image: '/assets/images/luxury-collection-poster.png',
    categories: ['luxury'],
  },
]

type CollectionProduct = {
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

function normalizeApiProduct(product: any): CollectionProduct {
  const slug = product.slug || toSlug(product.name || '')
  return {
    id: String(product.id || product._id || slug),
    slug,
    name: product.name || 'Untitled Product',
    price: Number(product.price || 0),
    image: product.image || product.images?.[0] || '/assets/images/heritage-classic-v2.png',
    category: String(product.category || 'Uncategorized'),
    isNew: Boolean(product.isNew),
  }
}

export default function CollectionsPage() {
  const [products, setProducts] = useState<CollectionProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadProducts() {
      try {
        const res = await fetch('/api/products?limit=200', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok || !data?.success || !Array.isArray(data?.data)) return

        const nextProducts = data.data
          .map(normalizeApiProduct)
          .filter((product: CollectionProduct) => product.slug)

        if (!isCancelled) setProducts(nextProducts)
      } catch (error) {
        console.error('Error loading collection products:', error)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      isCancelled = true
    }
  }, [])

  const productsByCollection = useMemo(() => {
    return collections.reduce<Record<string, CollectionProduct[]>>((acc, collection) => {
      acc[collection.id] = products
        .filter((product) => collection.categories.includes(product.category.toLowerCase()))
        .slice(0, 4)
      return acc
    }, {})
  }, [products])

  return (
    <div className="bg-white">
      <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 block"
        >
          EST. 2026 - LAGOS
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8"
        >
          Curated Chapters
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 font-light leading-relaxed"
        >
          Timepieces are not just instruments; they are stories. Explore distinct collections powered by the products uploaded from the admin dashboard.
        </motion.p>
      </div>

      <div className="space-y-0">
        {collections.map((collection) => {
          const collectionProducts = productsByCollection[collection.id] || []

          return (
            <section key={collection.id} className="relative group">
              <div className="relative h-[80vh] w-full overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/25" />

                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                  <div className="max-w-2xl text-white">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/80 mb-3">{collection.subtitle}</p>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">
                      {collection.name}
                    </h2>
                    <p className="text-lg md:text-xl font-light mb-8 drop-shadow-md text-white/90">
                      {collection.description}
                    </p>
                    <Link
                      href={`/shop?category=${collection.id}`}
                      className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-slate-100 transition-colors"
                    >
                      Shop Collection <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-8">
                    <h3 className="text-2xl font-serif text-slate-900">Featured in {collection.name}</h3>
                    <Link href="/shop" className="text-sm font-medium text-slate-500 hover:text-slate-900">View All</Link>
                  </div>

                  {collectionProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {collectionProducts.map((product, idx) => (
                        <ProductCard key={product.id} product={product} index={idx} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 py-12 text-center text-slate-400">
                      {loading ? 'Loading products...' : 'No products in this collection yet.'}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
