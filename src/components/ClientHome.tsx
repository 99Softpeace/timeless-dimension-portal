"use client"
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import { allProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import Testimonials from '@/components/Testimonials'
import Newsletter from '@/components/Newsletter'
import NeuralBackground from '@/components/ui/flow-field-background'

// Dynamically import the heavy 3D showcase
const ProductShowcase3D: any = dynamic(() => import('@/components/ProductShowcase3D') as any, {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 lg:h-[500px] flex flex-col items-center justify-center text-silver-dark/50 gap-4">
      <Loader2 className="animate-spin text-teal" size={48} />
      <span className="text-sm tracking-widest uppercase">Loading Dimensions...</span>
    </div>
  ),
})

// Use the first 4 products as featured
const featuredProducts = allProducts.slice(0, 4)

export default function ClientHome() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 lg:pt-0 bg-[#F5F5F7]">
        {/* Animated Background - Subtle & Elegant */}
        <div className="absolute inset-0 z-0 opacity-30">
          <NeuralBackground
            color="#A1A1AA" // Cool Gray 400
            speed={0.2}
            particleCount={200}
            trailOpacity={0.05}
          />
        </div>

        {/* No dark overlay needed for light theme */}

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* Image (Top on Mobile, Right on Desktop) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
            >
              <div className="w-full h-[45vh] lg:h-[650px] flex items-center justify-center relative">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-[300px] h-[300px] lg:w-[500px] lg:h-[500px]"
                >
                  <Image
                    src="/assets/images/luxury-watch-hero.png"
                    alt="Senator Luxury Watch"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Hero Content (Bottom on Mobile, Left on Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8 order-2 lg:order-1 text-center lg:text-left relative z-20 pb-12 lg:pb-0"
            >
              <div className="space-y-6">
                <motion.h1
                  className="font-serif text-5xl lg:text-7xl leading-tight text-midnight tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Fragments of <br />
                  <span className="italic text-teal-700">Forever</span>
                </motion.h1>

                <motion.p
                  className="text-lg lg:text-xl text-midnight/70 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Precision engineering meets timeless design. Discover the collection that redefines how you perceive every second.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <Link href="/shop" className="btn-primary rounded-full px-10 py-4 text-lg w-full sm:w-auto hover:scale-105 transition-transform shadow-lg shadow-teal-700/20">
                  Shop Now
                </Link>
                <Link href="/collections" className="bg-transparent border border-midnight/20 text-midnight rounded-full px-10 py-4 text-lg w-full sm:w-auto hover:bg-midnight/5 transition-colors">
                  Explore
                </Link>
              </motion.div>

              {/* Stats Integrated into Text Column */}
              <motion.div
                className="grid grid-cols-3 gap-8 pt-8 border-t border-midnight/10 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-serif font-bold text-midnight">500+</div>
                  <div className="text-xs tracking-widest text-midnight/60 uppercase mt-1">Happy Clients</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-serif font-bold text-midnight">50+</div>
                  <div className="text-xs tracking-widest text-midnight/60 uppercase mt-1">Models</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-serif font-bold text-midnight">5★</div>
                  <div className="text-xs tracking-widest text-midnight/60 uppercase mt-1">Rating</div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Bento Grid Features Section - Apple Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Rebranded to Senator */}
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
              Engineering Excellence
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
              Every detail is meticulously crafted to ensure longevity, precision, and timeless style.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
            {/* Card 1: Mechanical Movement (Large) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-slate-100"
            >
              <Image
                src="/assets/images/bento-mechanical.png"
                alt="Swiss Mechanical Movement"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Swiss Precision</h3>
                <p className="text-slate-200">Self-winding mechanical movement with 42-hour power reserve.</p>
              </div>
            </motion.div>

            {/* Card 2: Sapphire Crystal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-3xl bg-slate-100"
            >
              <Image
                src="/assets/images/bento-sapphire.png"
                alt="Sapphire Crystal"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Sapphire Glass</h3>
                <p className="text-slate-200">Scratch-resistant synthetic sapphire crystal.</p>
              </div>
            </motion.div>

            {/* Card 3: Lifestyle (Tall) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="md:row-span-1 relative group overflow-hidden rounded-3xl bg-slate-100"
            >
              <Image
                src="/assets/images/bento-lifestyle.png"
                alt="Lifestyle"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Quiet Luxury</h3>
                <p className="text-slate-200">Designed for the boardroom and the boardwalk.</p>
              </div>
            </motion.div>

            {/* Card 4: Warranty/Service (Text Only) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="md:col-span-2 relative overflow-hidden rounded-3xl bg-[#0B1020] flex items-center justify-center p-12 text-center border border-white/5"
            >
              <div className="relative z-10">
                <h3 className="text-5xl font-display font-bold text-teal mb-4">10 Year</h3>
                <h4 className="text-2xl font-serif text-white mb-4">International Warranty</h4>
                <p className="text-slate-400 max-w-md mx-auto">We stand behind every timepiece with a decade-long guarantee of performance and reliability.</p>
              </div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 filter contrast-100 brightness-100"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial Showcase - Oura Style */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image
                src="/assets/images/bento-lifestyle.png"
                alt="Lifestyle Editorial"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight">
                Designed for <br />
                <span className="italic text-teal-600">Nigerian Excellence.</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                We don't just import watches; we curate timepieces that resonate with the ambition, style, and heritage of the modern Nigerian leader. From Lagos to Abuja, the Senator Collection is a symbol of arrival.
              </p>
              <div className="pt-4">
                <Link href="/collections" className="btn-primary rounded-full px-12 py-5 text-lg shadow-xl shadow-teal-500/20">
                  Explore Collections
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}