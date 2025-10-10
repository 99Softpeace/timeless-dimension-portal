"use client"
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

// Mock data for collections
const collections = [
  {
    id: 'heritage',
    name: 'Heritage Collection',
    description: 'Timeless pieces that honor Nigerian traditions and craftsmanship',
    image: '/assets/images/heritage-collection.svg',
    productCount: 12,
    featured: true,
  },
  {
    id: 'modern',
    name: 'Modern Collection',
    description: 'Contemporary designs for the urban professional',
    image: '/assets/images/modern-collection.svg',
    productCount: 8,
  },
  {
    id: 'luxury',
    name: 'Luxury Collection',
    description: 'Premium timepieces for the discerning collector',
    image: '/assets/images/luxury-collection.svg',
    productCount: 15,
  },
  {
    id: 'nigerian-pride',
    name: 'Nigerian Pride',
    description: 'Celebrating the spirit and culture of Nigeria',
    image: '/assets/images/nigerian-pride-collection.svg',
    productCount: 6,
  },
]

const featuredProducts = [
  {
    id: '1',
    name: 'Heritage Classic',
    slug: 'heritage-classic',
    price: 250000,
    image: '/assets/images/heritage-classic.svg',
    model3d: '/assets/models/heritage-classic.glb',
    description: 'A timeless piece that embodies classic elegance',
    isNew: true,
  },
  {
    id: '2',
    name: 'Nigerian Pride',
    slug: 'nigerian-pride',
    price: 180000,
    image: '/assets/images/nigerian-pride.svg',
    model3d: '/assets/models/nigerian-pride.glb',
    description: 'Celebrating Nigerian heritage with modern craftsmanship',
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'Lagos Nights',
    slug: 'lagos-nights',
    price: 320000,
    image: '/assets/images/lagos-nights.svg',
    model3d: '/assets/models/lagos-nights.glb',
    description: 'Inspired by the vibrant energy of Lagos',
    discount: 15,
  },
  {
    id: '4',
    name: 'Golden Hour',
    slug: 'golden-hour',
    price: 280000,
    image: '/assets/images/golden-hour.svg',
    model3d: '/assets/models/golden-hour.glb',
    description: 'Capturing the magic of golden hour in Nigeria',
  },
]

export default function CollectionsPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 nigerian-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-5xl font-display font-bold text-silver mb-6">
              Our <span className="text-gradient">Collections</span>
            </h1>
            <p className="text-xl text-silver-dark max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collections, each one telling a unique story 
              of craftsmanship, heritage, and modern innovation.
            </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {collections.map((collection) => {
              return (
                <div className="group relative" key={collection.id}>
                  <Link href={`/collections/${collection.id}`}>
                    <div className="glass-card overflow-hidden">
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-midnight-3">
                        <div className="w-full h-full bg-gradient-to-br from-teal/20 to-gold/20 flex items-center justify-center">
                          <span className="text-4xl">⌚</span>
                        </div>
                        {collection.featured && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-teal text-midnight text-xs font-semibold rounded-full">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-display font-semibold text-silver group-hover:text-teal transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-silver-dark text-sm leading-relaxed">
                          {collection.description}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-teal font-semibold text-sm">
                            {collection.productCount} watches
                          </span>
                          <span className="text-silver-dark text-sm group-hover:text-teal transition-colors">
                            View Collection →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-midnight-3/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-display font-bold text-silver mb-4">
              Featured Timepieces
            </h2>
            <p className="text-silver-dark text-lg max-w-2xl mx-auto">
              Handpicked watches from our most popular collections
            </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>

            <Link href="/shop" className="btn-primary">
              Explore All Watches
            </Link>
        </div>
      </section>

      {/* Collection Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-display font-bold text-silver mb-4">
              Why Our Collections Matter
            </h2>
            <p className="text-silver-dark text-lg max-w-3xl mx-auto">
              Each collection is carefully curated to represent different aspects of 
              Nigerian culture and modern luxury.
            </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Cultural Heritage',
                description: 'Every piece tells a story of Nigerian traditions and values',
                icon: '🏛️',
              },
              {
                title: 'Modern Craftsmanship',
                description: 'Combining traditional techniques with contemporary design',
                icon: '⚡',
              },
              {
                title: 'Personal Expression',
                description: 'Find the perfect watch that reflects your unique style',
                icon: '✨',
              },
            ].map((feature) => {
              return (
                <div className="glass-card text-center" key={feature.title}>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-display font-semibold text-silver mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-silver-dark leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  )
}