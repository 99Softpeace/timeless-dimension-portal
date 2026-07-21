import mongoose, { Schema, Model } from 'mongoose'

export interface IProduct {
  name: string
  slug?: string
  description: string
  price: number
  category: string
  images: string[]
  videos?: string[]
  colors?: string[]
  image?: string
  inStock: boolean
  stockQuantity: number
  isActive?: boolean
  isNew: boolean
  isBestSeller: boolean
  isFeatured: boolean
  discount?: number
  averageRating?: number
  numReviews?: number
  createdAt?: Date
  updatedAt?: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }
  next()
})

productSchema.virtual('image').get(function () {
  return this.images?.[0] || ''
})

productSchema.statics.findFeatured = function () {
  return this.find({
    isFeatured: true,
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  })
    .sort({ createdAt: -1 })
    .limit(8)
}

productSchema.statics.search = function (
  query: string,
  options: {
    category?: string | null
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    limit?: number
  } = {}
) {
  const filter: any = {
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
  }

  if (query) {
    filter.$and = [
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      },
    ]
  }

  if (options.category && options.category !== 'all') {
    filter.category = options.category
  }

  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    filter.price = {}
    if (options.minPrice !== undefined) filter.price.$gte = options.minPrice
    if (options.maxPrice !== undefined) filter.price.$lte = options.maxPrice
  }

  const sort: Record<string, 1 | -1> =
    options.sortBy === 'price'
      ? { price: 1 }
      : options.sortBy === 'createdAt'
        ? { createdAt: -1 }
        : { createdAt: -1 }

  return this.find(filter).sort(sort).limit(options.limit || 20)
}

function getProductModel() {
  const existingModel = mongoose.models.Product as Model<IProduct> | undefined
  if (!existingModel) {
    return mongoose.model<IProduct>('Product', productSchema)
  }

  const hasSlugPath = Boolean((existingModel as any).schema?.path('slug'))
  const hasIsActivePath = Boolean((existingModel as any).schema?.path('isActive'))
  const hasMediaPath = Boolean((existingModel as any).schema?.path('videos'))
  const hasColorsPath = Boolean((existingModel as any).schema?.path('colors'))
  const hasFeaturedStatic = typeof (existingModel as any).findFeatured === 'function'
  if (!hasSlugPath || !hasIsActivePath || !hasMediaPath || !hasColorsPath || !hasFeaturedStatic) {
    delete (mongoose.models as any).Product
    return mongoose.model<IProduct>('Product', productSchema)
  }

  return existingModel
}

const Product: Model<IProduct> = getProductModel()

export default Product


