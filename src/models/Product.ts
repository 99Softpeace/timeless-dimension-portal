import mongoose, { Schema, Model } from 'mongoose'

export interface IProduct {
  name: string
  slug?: string
  description: string
  price: number
  category: string
  images: string[]
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

function getProductModel() {
  const existingModel = mongoose.models.Product as Model<IProduct> | undefined
  if (!existingModel) {
    return mongoose.model<IProduct>('Product', productSchema)
  }

  const hasSlugPath = Boolean((existingModel as any).schema?.path('slug'))
  const hasIsActivePath = Boolean((existingModel as any).schema?.path('isActive'))
  if (!hasSlugPath || !hasIsActivePath) {
    delete (mongoose.models as any).Product
    return mongoose.model<IProduct>('Product', productSchema)
  }

  return existingModel
}

const Product: Model<IProduct> = getProductModel()

export default Product
