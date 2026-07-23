import { v4 as uuidv4 } from 'uuid'
import Product from '@/models/Product'
import { allProducts } from '@/lib/products'

export type CheckoutCartItem = {
  id: string
  quantity: number
  selectedColor?: string
}

export type CheckoutAddress = {
  firstName?: string
  lastName?: string
  address1?: string
  address2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  phone?: string
}

const STATIC_PRODUCT_MAP = new Map(allProducts.map((product) => [product.id, product]))

export function normalizeCurrency(value: unknown) {
  return String(value || 'NGN').trim().toUpperCase() || 'NGN'
}

export function toAmount(value: unknown) {
  const num = Number(value)
  return Number.isFinite(num) ? num : NaN
}

export function amountsMatch(expected: number, actual: number) {
  return Math.abs(expected - actual) < 0.01
}

export function isMongoObjectId(value: string) {
  return /^[a-fA-F0-9]{24}$/.test(value)
}

export function generateOrderNumber() {
  return `TDP-${Date.now()}-${Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0')}`
}

export function generatePaymentReference(prefix = 'TDP') {
  return `${prefix}-${uuidv4()}`
}

export function buildAddress(address: CheckoutAddress | undefined, fallbackPhone?: string) {
  const normalized = {
    firstName: String(address?.firstName || '').trim(),
    lastName: String(address?.lastName || '').trim(),
    address1: String(address?.address1 || '').trim(),
    address2: String(address?.address2 || '').trim(),
    city: String(address?.city || '').trim(),
    state: String(address?.state || '').trim(),
    postalCode: String(address?.postalCode || '').trim(),
    country: String(address?.country || 'Nigeria').trim() || 'Nigeria',
    phone: String(address?.phone || fallbackPhone || '').trim(),
  }

  const requiredFields: (keyof typeof normalized)[] = [
    'firstName',
    'lastName',
    'address1',
    'city',
    'state',
    'postalCode',
    'country',
  ]

  const missing = requiredFields.find((field) => !normalized[field])
  if (missing) {
    throw new Error(`Missing required address field: ${missing}`)
  }

  return normalized
}

export async function buildOrderItems(cartItems: CheckoutCartItem[] | undefined) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  let subtotal = 0
  const items = []

  for (const cartItem of cartItems) {
    const quantity = Number(cartItem.quantity)
    const id = String(cartItem.id)
    const selectedColor = String(cartItem.selectedColor || '').trim()

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity for item ${id}`)
    }

    const dbProduct = isMongoObjectId(id)
      ? await Product.findOne({
          _id: id,
          $or: [{ isActive: true }, { isActive: { $exists: false } }],
        })
      : null
    const staticProduct = STATIC_PRODUCT_MAP.get(id)
    const product = dbProduct || staticProduct

    if (!product) {
      throw new Error(`Unknown cart item: ${id}`)
    }

    if (dbProduct && (!(dbProduct as any).inStock || Number((dbProduct as any).stockQuantity || 0) < quantity)) {
      throw new Error(String((dbProduct as any).name || 'Product') + ' does not have enough stock')
    }

    const basePrice = Number((product as any).price || 0)
    const activeDiscount = Math.min(100, Math.max(0, Number((product as any).discount || 0)))
    const price = Math.round(basePrice * (1 - activeDiscount / 100) * 100) / 100
    const name = String((product as any).name || 'Product')
    const image = String((product as any).image || (product as any).images?.[0] || '')
    const availableColors = Array.isArray((product as any).colors)
      ? (product as any).colors.map((color: unknown) => String(color || '').trim()).filter(Boolean)
      : []

    if (selectedColor && availableColors.length > 0 && !availableColors.some((color: string) => color.toLowerCase() === selectedColor.toLowerCase())) {
      throw new Error(`Selected color is not available for ${name}`)
    }

    subtotal += price * quantity
    items.push({
      ...(isMongoObjectId(id) ? { product: id } : {}),
      name,
      price,
      quantity,
      image,
      ...(selectedColor ? { selectedColor } : {}),
    })
  }

  return { items, subtotal }
}
export async function reduceInventory(items: { product?: unknown; quantity: number; name: string }[]) {
  for (const item of items) {
    if (!item.product) continue
    const product = await Product.findOneAndUpdate(
      { _id: item.product, stockQuantity: { $gte: item.quantity } },
      { $inc: { stockQuantity: -item.quantity } },
      { new: true }
    )
    if (!product) throw new Error(`Not enough stock for ${item.name}`)
    if (product.stockQuantity <= 0 && product.inStock) {
      product.inStock = false
      await product.save()
    }
  }
}
