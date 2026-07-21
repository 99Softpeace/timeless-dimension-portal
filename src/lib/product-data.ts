import dbConnect from '@/lib/db'
import Product from '@/models/Product'

export type StoreProduct = {
  id: string
  slug: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
  discount?: number
}

type ProductCache = {
  products: StoreProduct[]
  expiresAt: number
}

const PRODUCT_CACHE_TTL_MS = 5 * 60 * 1000
let productCache: ProductCache | null = null

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function normalizeProduct(product: any): StoreProduct {
  const object = typeof product?.toObject === 'function' ? product.toObject({ virtuals: true }) : product
  const slug = object.slug || toSlug(object.name || '')

  return {
    id: String(object.id || object._id || slug),
    slug,
    name: object.name || 'Untitled Product',
    price: Number(object.price || 0),
    image: object.image || object.images?.[0] || '/assets/images/heritage-classic-v2.png',
    category: String(object.category || 'Uncategorized'),
    isNew: Boolean(object.isNew),
    isBestSeller: Boolean(object.isBestSeller),
    isFeatured: Boolean(object.isFeatured),
    discount: object.discount === undefined ? undefined : Number(object.discount),
  }
}

export function clearStoreProductsCache() {
  productCache = null
}

export async function getStoreProducts(): Promise<StoreProduct[]> {
  const now = Date.now()
  if (productCache && productCache.expiresAt > now) {
    return productCache.products
  }

  try {
    await dbConnect()
    const products = await (Product as any)
      .find({ $or: [{ isActive: true }, { isActive: { $exists: false } }] })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true })

    const normalized = products.map(normalizeProduct).filter((product: StoreProduct) => product.slug)
    productCache = {
      products: normalized,
      expiresAt: now + PRODUCT_CACHE_TTL_MS,
    }
    return normalized
  } catch (error) {
    console.error('Error loading store products:', error)
    return productCache?.products || []
  }
}

