const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  longDescription: {
    type: String,
    maxlength: 5000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String,
    required: true
  }],
  model3d: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['classic', 'heritage', 'modern', 'luxury', 'sports', 'dress']
  },
  brand: {
    type: String,
    required: true,
    default: 'Timeless'
  },
  features: [{
    type: String,
    maxlength: 100
  }],
  specifications: {
    caseMaterial: String,
    caseSize: String,
    movement: String,
    waterResistance: String,
    crystal: String,
    strap: String,
    warranty: String,
    powerReserve: String,
    frequency: String,
    jewels: Number
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, isActive: 1 })
productSchema.index({ price: 1 })
productSchema.index({ rating: -1 })
productSchema.index({ createdAt: -1 })

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount && this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100))
  }
  return this.price
})

// Virtual for average rating
productSchema.virtual('averageRating').get(function() {
  return this.rating / Math.max(this.reviewCount, 1)
})

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

// Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true }).sort({ createdAt: -1 })
}

// Static method to find products by category
productSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ createdAt: -1 })
}

// Static method to search products
productSchema.statics.search = function(query, options = {}) {
  const {
    category,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = -1,
    limit = 20,
    skip = 0
  } = options

  let filter = { isActive: true }

  if (query) {
    filter.$text = { $search: query }
  }

  if (category && category !== 'all') {
    filter.category = category
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {}
    if (minPrice !== undefined) filter.price.$gte = minPrice
    if (maxPrice !== undefined) filter.price.$lte = maxPrice
  }

  return this.find(filter)
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip(skip)
}

module.exports = mongoose.model('Product', productSchema)
