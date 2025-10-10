const express = require('express')
const User = require('../models/User')
const router = express.Router()

// GET /api/users/profile - Get user profile
router.get('/profile', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id // This would come from auth middleware
    
    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user.getPublicProfile()
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    })
  }
})

// PUT /api/users/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id
    const updates = req.body

    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password
    delete updates.role
    delete updates.isActive

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user.getPublicProfile(),
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(400).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    })
  }
})

// POST /api/users/change-password - Change password
router.post('/change-password', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Error changing password:', error)
    res.status(400).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    })
  }
})

// GET /api/users/addresses - Get user addresses
router.get('/addresses', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id

    const user = await User.findById(userId).select('addresses')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user.addresses
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    })
  }
})

// POST /api/users/addresses - Add new address
router.post('/addresses', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id
    const addressData = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // If this is the first address or marked as default, set as default
    if (user.addresses.length === 0 || addressData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false)
      addressData.isDefault = true
    }

    user.addresses.push(addressData)
    await user.save()

    res.status(201).json({
      success: true,
      data: user.addresses,
      message: 'Address added successfully'
    })
  } catch (error) {
    console.error('Error adding address:', error)
    res.status(400).json({
      success: false,
      message: 'Error adding address',
      error: error.message
    })
  }
})

// PUT /api/users/addresses/:addressId - Update address
router.put('/addresses/:addressId', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id
    const { addressId } = req.params
    const updates = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false
        }
      })
    }

    Object.assign(address, updates)
    await user.save()

    res.json({
      success: true,
      data: user.addresses,
      message: 'Address updated successfully'
    })
  } catch (error) {
    console.error('Error updating address:', error)
    res.status(400).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    })
  }
})

// DELETE /api/users/addresses/:addressId - Delete address
router.delete('/addresses/:addressId', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id
    const { addressId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const address = user.addresses.id(addressId)
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      })
    }

    address.remove()
    await user.save()

    res.json({
      success: true,
      data: user.addresses,
      message: 'Address deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    res.status(400).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    })
  }
})

// GET /api/users/wishlist - Get user wishlist
router.get('/wishlist', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id

    const user = await User.findById(userId)
      .populate('wishlist', 'name price image slug')
      .select('wishlist')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user.wishlist
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    })
  }
})

// POST /api/users/wishlist - Add to wishlist
router.post('/wishlist', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id
    const { productId } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      })
    }

    user.wishlist.push(productId)
    await user.save()

    res.json({
      success: true,
      message: 'Product added to wishlist'
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    res.status(400).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    })
  }
})

// DELETE /api/users/wishlist/:productId - Remove from wishlist
router.delete('/wishlist/:productId', async (req, res) => {
  try {
    // TODO: Add authentication middleware
    const userId = req.user?.id
    const { productId } = req.params

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    user.wishlist.pull(productId)
    await user.save()

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    res.status(400).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    })
  }
})

module.exports = router
