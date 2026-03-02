const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables
dotenv.config()

function loadRoute(modulePath, routeName) {
  try {
    return require(modulePath)
  } catch (error) {
    const isMissingRouteModule =
      error &&
      error.code === 'MODULE_NOT_FOUND' &&
      typeof error.message === 'string' &&
      error.message.includes(modulePath)

    if (!isMissingRouteModule) {
      throw error
    }

    console.warn(`[server] Missing route module ${modulePath}. ${routeName} endpoints will return 501.`)
    const router = express.Router()
    router.all('*', (req, res) => {
      res.status(501).json({
        success: false,
        message: `${routeName} routes are not configured in this workspace.`,
      })
    })
    return router
  }
}

// Import routes
const productRoutes = loadRoute('./routes/products', 'Product')
const userRoutes = loadRoute('./routes/users', 'User')
const orderRoutes = loadRoute('./routes/orders', 'Order')
const authRoutes = loadRoute('./routes/auth', 'Auth')
const paymentRoutes = loadRoute('./routes/payment', 'Payment')
const uploadRoutes = loadRoute('./routes/upload', 'Upload')


const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/upload', uploadRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Timeless Dimension Portal API is running',
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Timeless Dimension Portal API',
    status: 'Running',
    documentation: '/api/health'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timeless-portal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
    })
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  })

module.exports = app
