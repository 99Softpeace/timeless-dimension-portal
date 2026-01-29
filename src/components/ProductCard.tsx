'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative flex flex-col items-center text-center cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block w-full">
        {/* Image Container - Square Aspect Ratio with Oura-style "Floating" look */}
        <div className="relative aspect-square w-full rounded-[2rem] bg-slate-50 overflow-hidden mb-6 transition-colors duration-500 group-hover:bg-slate-100">

          {/* Badge - Minimalist Pill */}
          {product.isNew && (
            <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
              New
            </div>
          )}

          {/* Product Image */}
          <div className="absolute inset-0 p-8 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>

        {/* Minimalist Typography */}
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-slate-900 font-sans tracking-tight">
            {product.name}
          </h3>
          <p className="text-sm text-slate-500 font-sans">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
