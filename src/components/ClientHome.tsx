"use client"
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion' // <-- 1. RE-ENABLED FRAMER MOTION

// Dynamically import the heavy 3D showcase
const ProductShowcase3D: any = dynamic(() => import('@/components/ProductShowcase3D') as any, {
  ssr: false,
  loading: () => <div className="w-full h-96 lg:h-[500px] flex items-center justify-center text-silver-dark">Loading 3D...</div>,
})

import ProductCard from '@/components/ProductCard'

// Mock data
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

export default function ClientHome() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 nigerian-pattern opacity-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* <-- 2. SWAPPED THE ORDER OF THE GRID COLUMNS --> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* 3D Showcase (Now on the Left) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }} // Animate from the left
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-1" // Explicitly set order
            >
              <div className="h-96 lg:h-[500px]">
                {/* <-- 3. ACTIVATED THE 3D SHOWCASE --> */}
                {mounted ? (
                  <ProductShowcase3D 
                    modelUrl="/assets/models/hero-watch.glb"
                    autoRotate={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-silver-dark">Loading 3D...</div>
                )}
                </div>
              
              {/* Floating elements for futuristic feel */}
              <motion.div
                animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 w-20 h-20 bg-teal/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -right-4 w-16 h-16 bg-gold/20 rounded-full blur-xl"
              />
            </motion.div>

            {/* Hero Content (Now on the Right) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }} // Animate from the right
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 order-2 lg:order-2 text-center lg:text-left" // <-- 4. ADJUSTED TEXT ALIGNMENT
            >
              <div className="space-y-4">
                <motion.h1 
                  className="hero-title font-display font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Fragments of{' '}
                  <span className="text-gradient">Forever</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-silver-dark max-w-xl leading-relaxed mx-auto lg:mx-0" // Centered on mobile
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  A curated collection of mechanical and hybrid wristwatches — 
                  rendered in high fidelity 3D. Experience time in a new dimension.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" // Centered on mobile
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link href="/shop" className="btn-primary text-center">
                  Explore the Orbit
                </Link>
                <Link href="/collections" className="btn-secondary text-center">
                  View Collections
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-8 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="text-center">
                  <div className="text-2xl font-display font-bold text-teal">500+</div>
                  <div className="text-sm text-silver-dark">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-bold text-gold">50+</div>
                  <div className="text-sm text-silver-dark">Watch Models</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display font-bold text-teal">5★</div>
                  <div className="text-sm text-silver-dark">Average Rating</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section (No changes needed here) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-silver mb-4">
              Featured Timepieces
            </h2>
            <p className="text-silver-dark text-lg max-w-2xl mx-auto">
              Discover our most popular watches, each one a masterpiece of 
              precision and style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/shop" className="btn-primary">
              View All Watches
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section (No changes needed here) */}
      <section className="py-20 bg-midnight-3/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-silver mb-4">
              Why Choose Timeless?
            </h2>
            <p className="text-silver-dark text-lg max-w-2xl mx-auto">
              We bring you the finest timepieces with cutting-edge technology 
              and exceptional service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '3D Visualization',
                description: 'Experience watches in stunning 3D before you buy',
                icon: '🎯',
              },
              {
                title: 'Nigerian Crafted',
                description: 'Designed with Nigerian culture and heritage in mind',
                icon: '🇳🇬',
              },
              {
                title: 'Premium Quality',
                description: 'Only the finest materials and Swiss movements',
                icon: '💎',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="glass-card text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-display font-semibold text-silver mb-3">
                  {feature.title}
                </h3>
                <p className="text-silver-dark leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}