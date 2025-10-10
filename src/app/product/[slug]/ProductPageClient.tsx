'use client'

import dynamic from "next/dynamic"
import Image from "next/image"
import { Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import ProductCard from "@/components/ProductCard"

const ProductShowcase3D = dynamic(() => import("@/components/ProductShowcase3D"), { ssr: false })

export default function ProductPageClient({ product }: { product: any }) {
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="w-full h-[500px] bg-midnight-3 rounded-xl overflow-hidden">
              <ProductShowcase3D modelUrl={product.model3d} autoRotate={false} className="h-full" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image: string, index: number) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-midnight-3">
                  <Image src={image} alt={`${product.name} view ${index + 1}`} width={200} height={200} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-display font-bold text-silver">{product.name}</h1>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(product.rating) ? "text-gold fill-current" : "text-silver-dark"} />
              ))}
              <span className="ml-2 text-silver-dark">{product.rating} ({product.reviews} reviews)</span>
            </div>
            <p className="text-silver-dark">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
