'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Minus, Plus, Truck, ShieldCheck, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/CartContext'
import { toast } from 'sonner'
import { allProducts } from '@/lib/products'

type PageProduct = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  images: string[]
  videos: string[]
  description: string
  category: string
  isNew?: boolean
  discount?: number
  specs?: {
    movement: string
    caseSize: string
    waterResistance: string
    strapMaterial: string
  }
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizeProduct(raw: any): PageProduct {
  const slug = raw.slug || toSlug(raw.name || '')
  const image = raw.image || raw.images?.[0] || '/assets/images/heritage-classic-v2.png'
  const images = Array.isArray(raw.images) && raw.images.length > 0 ? raw.images : [image]
  const videos = Array.isArray(raw.videos) ? raw.videos.filter(Boolean) : []

  return {
    id: String(raw.id || raw._id || slug),
    slug,
    name: raw.name || 'Untitled Product',
    price: Number(raw.price || 0),
    image,
    images,
    videos,
    description: raw.description || '',
    category: String(raw.category || 'Collection'),
    isNew: Boolean(raw.isNew),
    discount: raw.discount ? Number(raw.discount) : undefined,
    specs: raw.specs,
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const staticProduct = useMemo(() => allProducts.find((p) => p.slug === params.slug), [params.slug])
  const [product, setProduct] = useState<PageProduct | null>(() =>
    staticProduct ? normalizeProduct(staticProduct) : null
  )
  const [loading, setLoading] = useState(!staticProduct)

  useEffect(() => {
    if (staticProduct) {
      setProduct(normalizeProduct(staticProduct))
      setLoading(false)
      return
    }

    let isCancelled = false

    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${params.slug}`, { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok || !data?.success || !data?.data) {
          if (!isCancelled) setProduct(null)
          return
        }

        if (!isCancelled) {
          setProduct(normalizeProduct(data.data))
        }
      } catch (error) {
        console.error('Error fetching product details:', error)
        if (!isCancelled) setProduct(null)
      } finally {
        if (!isCancelled) setLoading(false)
      }
    }

    fetchProduct()
    return () => {
      isCancelled = true
    }
  }, [params.slug, staticProduct])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex items-center justify-center bg-white text-slate-500">
        Loading product...
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center justify-center text-center bg-white">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Timepiece Not Found</h1>
        <p className="text-slate-500 mb-8 font-light">The model you are looking for does not exist in our archives.</p>
        <Link href="/shop" className="border-b border-slate-900 pb-1 uppercase tracking-widest text-sm hover:text-slate-600 transition-colors">
          Return to Collection
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      })
    }
    toast.success(`Added ${quantity} ${product.name} to cart`)
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-12">
          <Link href="/shop" className="text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors uppercase tracking-widest text-xs font-mono">
            <ArrowLeft size={14} /> Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Left: Sticky Image Section */}
          <div className="relative lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative aspect-square w-full bg-slate-50 rounded-[2rem] overflow-hidden"
            >
              {/* Product Image */}
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain mix-blend-multiply"
                  priority
                />
              </div>

              {/* New Badge */}
              {product.isNew && (
                <div className="absolute top-6 left-6 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                  New Arrival
                </div>
              )}
            </motion.div>

            {(product.images.length > 1 || product.videos.length > 0) && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {product.images.slice(0, 6).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50">
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {product.videos.slice(0, 3).map((video, index) => (
                  <video
                    key={`${video}-${index}`}
                    src={video}
                    controls
                    className="aspect-square w-full rounded-2xl bg-black object-cover"
                    aria-label={`${product.name} video ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-12 py-4"
          >
            {/* Header */}
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2 block">
                {product.category} Series
              </span>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4 border-b border-slate-100 pb-8">
                <span className="text-3xl font-mono text-slate-900">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.discount && (
                  <span className="text-lg text-red-500 font-medium">
                    -{product.discount}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg text-slate-600 font-light leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Technical Specs Grid */}
            {product.specs && (
              <div className="border-t border-slate-100 pt-8">
                <h3 className="font-serif text-xl text-slate-900 mb-6">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block mb-1">Movement</span>
                    <span className="text-slate-900 font-medium">{product.specs.movement}</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block mb-1">Case</span>
                    <span className="text-slate-900 font-medium">{product.specs.caseSize}</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block mb-1">Resistance</span>
                    <span className="text-slate-900 font-medium">{product.specs.waterResistance}</span>
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block mb-1">Strap</span>
                    <span className="text-slate-900 font-medium">{product.specs.strapMaterial}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-6">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center text-slate-900 font-mono font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-slate-900 text-white py-4 px-8 flex items-center justify-between hover:bg-teal-700 transition-colors group"
                >
                  <span className="font-medium tracking-wide">ADD TO CART</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <Truck size={18} />
                  <span className="text-xs uppercase tracking-wider">Free Delivery In & Outside Lagos</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <ShieldCheck size={18} />
                  <span className="text-xs uppercase tracking-wider">10 Year Warranty</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  )
}
