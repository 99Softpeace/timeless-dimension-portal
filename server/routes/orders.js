const express = require('express')
const Order = require('../models/Order')
const Product = require('../models/Product')
const router = express.Router()
const { auth, admin } = require('../middleware/auth')

// GET /api/orders - Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id
    const { page = 1, limit = 10, status } = req.query

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      status
    }

    const orders = await Order.findByUser(userId, options)
    const total = await Order.countDocuments({ user: userId })

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    })
  }
})

// GET /api/orders/:id - Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const userId = req.user._id
    const { id } = req.params

    const order = await Order.findOne({ _id: id, user: userId })
      .populate('items.product', 'name image slug')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    })
  }
})

// POST /api/orders - Create new order
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user._id
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentIntentId
    } = req.body

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      })
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`
        })
      }

      if (!product.inStock || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        })
      }

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]
      })
    }

    // Calculate shipping (free over ₦100,000)
    const shippingCost = subtotal >= 100000 ? 0 : 5000

    // Calculate tax (7.5% VAT)
    const tax = subtotal * 0.075

    // Calculate total
    const total = subtotal + shippingCost + tax

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress,
      billingAddress,
      subtotal,
      shippingCost,
      tax,
      total,
      paymentMethod,
      paymentIntentId,
      status: 'pending',
      paymentStatus: 'pending'
    })

    await order.save()

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity } }
      )
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    })
  }
})

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put('/:id/status', auth, admin, async (req, res) => {
  try {
    // TODO: Add admin authentication middleware
    const { id } = req.params
    const { status, notes } = req.body

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    await order.updateStatus(status, notes)

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    res.status(400).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    })
  }
})

// PUT /api/orders/:id/payment-status - Update payment status
router.put('/:id/payment-status', auth, async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user._id
    const { id } = req.params
    const { paymentStatus, paymentIntentId } = req.body

    const order = await Order.findOne({ _id: id, user: userId })
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    order.paymentStatus = paymentStatus
    if (paymentIntentId) {
      order.paymentIntentId = paymentIntentId
    }

    // If payment is successful, update order status
    if (paymentStatus === 'paid') {
      order.status = 'processing'
    }

    await order.save()

    res.json({
      success: true,
      data: order,
      message: 'Payment status updated successfully'
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    res.status(400).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    })
  }
})

// POST /api/orders/:id/cancel - Cancel order
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user._id
    const { id } = req.params
    const { reason } = req.body

    const order = await Order.findOne({ _id: id, user: userId })
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      })
    }

    await order.updateStatus('cancelled', reason)

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stockQuantity: item.quantity } }
      )
    }

    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling order:', error)
    res.status(400).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    })
  }
})

// GET /api/orders/stats - Get order statistics (Admin only)
router.get('/stats', auth, admin, async (req, res) => {
  try {
    // TODO: Add admin authentication middleware
    const { startDate, endDate } = req.query

    const stats = await Order.getStats(startDate, endDate)

    res.json({
      success: true,
      data: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        ordersByStatus: []
      }
    })
  } catch (error) {
    console.error('Error fetching order stats:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message
    })
  }
})

module.exports = router
