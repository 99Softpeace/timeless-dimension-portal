const express = require('express')
const Product = require('../models/Product')
const { auth, admin } = require('../middleware/auth')
const router = express.Router()

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      inStock
    } = req.query

    const options = {
      category,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      sortBy,
      sortOrder: sortOrder === 'desc' ? -1 : 1,
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    }

    let query = Product.find({ isActive: true })

    // Apply filters
    if (search) {
      query = query.find({ $text: { $search: search } })
    }

    if (category && category !== 'all') {
      query = query.where('category').equals(category)
    }

    if (minPrice || maxPrice) {
      const priceFilter = {}
      if (minPrice) priceFilter.$gte = parseInt(minPrice)
      if (maxPrice) priceFilter.$lte = parseInt(maxPrice)
      query = query.where('price').equals(priceFilter)
    }

    if (featured === 'true') {
      query = query.where('isFeatured').equals(true)
    }

    if (inStock === 'true') {
      query = query.where('inStock').equals(true)
    }

    // Apply sorting
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1
    query = query.sort(sortOptions)

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    query = query.skip(skip).limit(parseInt(limit))

    const products = await query.exec()
    const total = await Product.countDocuments(query.getFilter())

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    })
  }
})

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findFeatured()
    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    })
  }
})

// GET /api/products/categories - Get product categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])

    res.json({
      success: true,
      data: categories.map(cat => ({
        id: cat._id,
        name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
        count: cat.count
      }))
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    })
  }
})

// GET /api/products/search - Search products
router.get('/search', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sortBy = 'relevance', limit = 20 } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }

    const options = {
      category,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      sortBy: sortBy === 'relevance' ? 'score' : sortBy,
      limit: parseInt(limit)
    }

    const products = await Product.search(q, options)

    res.json({
      success: true,
      data: products,
      query: q
    })
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    })
  }
})

// GET /api/products/:slug - Get single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4)

    res.json({
      success: true,
      data: product,
      related: relatedProducts
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    })
  }
})

// POST /api/products - Create new product (Admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    })
  }
})

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    })
  }
})

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    })
  }
})

module.exports = router
