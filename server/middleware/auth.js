const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token, access denied'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        const user = await User.findById(decoded.userId)

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token is invalid or expired'
        })
    }
}

// Admin middleware
const admin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin rights required.'
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error checkin admin rights'
        })
    }
}

module.exports = { auth, admin }
