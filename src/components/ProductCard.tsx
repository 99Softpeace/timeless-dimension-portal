'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export interface ProductCardItem {
  slug: string
  name: string
  image: string
  price: number
  isNew?: boolean
}

interface ProductCardProps {
  product: ProductCardItem
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04 }}
      className="group relative flex flex-col items-center text-center cursor-pointer"
    >
      <Link href={`/product/${product.slug}`} className="block w-full">
        <div className="relative aspect-square w-full rounded-[2rem] bg-slate-50 overflow-hidden mb-6 transition-colors duration-500 group-hover:bg-slate-100">
          {product.isNew && (
            <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
              New
            </div>
          )}

          <div className="absolute inset-0 p-8 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              priority={index < 4}
            />
          </div>
        </div>

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
