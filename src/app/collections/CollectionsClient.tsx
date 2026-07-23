'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'
import type { StoreProduct } from '@/lib/product-data'
const collections = [
  {
    id: 'shoes',
    name: 'Shoes & Sneakers',
    subtitle: 'Every step, considered.',
    description: 'Statement sneakers, smart shoes, and everyday footwear curated for comfort, polish, and presence.',
    image: '/assets/images/shoes-hero.jpg',
    categories: ['shoes', 'shoe', 'footwear', 'sneakers', 'sneaker'],
    href: '/shoes',
  },
  {
    id: 'bags',
    name: 'Bags & Carry',
    subtitle: 'Structured pieces for movement.',
    description: 'Totes, crossbody pieces, clutches, and carry essentials selected for everyday use and standout occasions.',
    image: '/assets/images/bento-lifestyle.png',
    categories: ['bags', 'bag', 'accessories'],
    href: '/bags',
  },
  {
    id: 'clothes',
    name: 'Clothes & Fits',
    subtitle: 'Looks that hold attention.',
    description: 'Clothes and outfit pieces chosen for Nigerian pace, business days, weekends, and moments that need polish.',
    image: '/assets/images/modern-collection-poster.png',
    categories: ['clothes', 'clothing', 'wear', 'apparel'],
    href: '/clothes',
  },
  {
    id: 'details',
    name: 'Belts, Frames & Jewelry',
    subtitle: 'The finish matters.',
    description: 'Belts, eyeglasses, jewelry, watches, and finishing accessories that complete the whole look.',
    image: '/assets/images/luxury-collection-poster.png',
    categories: ['belts', 'belt', 'eyeglasses', 'glasses', 'frames', 'jewelry', 'watches', 'watch', 'accessories'],
    href: '/belts',
  },
]
type CollectionsClientProps = {
  products: StoreProduct[]
}

export default function CollectionsClient({ products }: CollectionsClientProps) {

  const productsByCollection = useMemo(() => {
    return collections.reduce<Record<string, StoreProduct[]>>((acc, collection) => {
      acc[collection.id] = products
        .filter((product) => collection.categories.includes(product.category.toLowerCase()))
        .slice(0, 4)
      return acc
    }, {})
  }, [products])

  return (
    <div className="bg-white overflow-x-hidden">
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
          Explore shoes, bags, clothes, belts, eyeglasses, watches, jewelry, and accessories grouped from the products uploaded in the admin dashboard.
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
                      href={collection.href}
                      className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-slate-100 transition-colors"
                    >
                      Explore Collection <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-8">
                    <h3 className="text-2xl font-serif text-slate-900">Featured from {collection.name}</h3>
                    <Link href={collection.href} className="text-sm font-medium text-slate-500 hover:text-slate-900">View Category</Link>
                  </div>

                  {collectionProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {collectionProducts.map((product, idx) => (
                        <ProductCard key={product.id} product={product} index={idx} />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-slate-50 py-12 text-center text-slate-400">
                      No products in this category yet.
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

