const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  })
}

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone
    })

    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(400).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
})

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
})

// POST /api/auth/forgot-password - Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findByEmail(email)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    )

    // Save reset token and expiry
    user.passwordResetToken = resetToken
    user.passwordResetExpires = new Date(Date.now() + 3600000) // 1 hour
    await user.save()

    // TODO: Send email with reset link
    // For now, just return the token (in production, send via email)
    res.json({
      success: true,
      message: 'Password reset token generated',
      resetToken // Remove this in production
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to process forgot password request',
      error: error.message
    })
  }
})

// POST /api/auth/reset-password - Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    
    const user = await User.findOne({
      _id: decoded.userId,
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    // Update password
    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(400).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    })
  }
})

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const user = await User.findById(decoded.userId).select('-password')

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      })
    }

    res.json({
      success: true,
      data: user.getPublicProfile()
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    })
  }
})

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // by removing the token from storage
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

module.exports = router
