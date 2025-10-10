'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { useCart } from './CartContext'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image: string
  model3d?: string
  description?: string
  isNew?: boolean
  isBestSeller?: boolean
  discount?: number
}

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.slug,
    })
  }

  const originalPrice = product.discount
    ? Math.round(product.price / (1 - product.discount / 100))
    : product.price

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="glass-card overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square mb-4 overflow-hidden rounded-xl bg-midnight-3">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col space-y-2">
              {product.isNew && (
                <span className="px-2 py-1 bg-teal text-midnight text-xs font-semibold rounded-full">
                  New
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-2 py-1 bg-gold text-midnight text-xs font-semibold rounded-full">
                  Best Seller
                </span>
              )}
              {product.discount && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 glass rounded-full text-silver hover:text-teal transition-colors"
                title="Add to wishlist"
              >
                <Heart size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 glass rounded-full text-silver hover:text-teal transition-colors"
                title="Quick view"
              >
                <Eye size={16} />
              </motion.button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="text-silver font-medium text-sm line-clamp-2 group-hover:text-teal transition-colors">
              {product.name}
            </h3>

            {product.description && (
              <p className="text-silver-dark text-xs line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-teal font-bold text-lg">
                ₦{product.price.toLocaleString()}
              </span>
              {product.discount && (
                <span className="text-silver-dark text-sm line-through">
                  ₦{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <motion.button
        onClick={handleAddToCart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div className="w-full bg-teal text-midnight py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center space-x-2 hover:bg-teal-dark transition-colors">
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </div>
      </motion.button>
    </motion.div>
  )
}
