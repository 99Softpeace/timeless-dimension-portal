const express = require('express')
const multer = require('multer')
const path = require('path')
const { auth, admin } = require('../middleware/auth')
const router = express.Router()

const fs = require('fs')

// Configure multer for disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'server/uploads/'
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    } else {
        cb(new Error('Not an image! Please upload an image.'), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
})

// POST /api/upload
router.post('/', auth, admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            })
        }

        const imageUrl = `${process.env.API_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`

        res.json({
            success: true,
            message: 'File uploaded successfully',
            url: imageUrl
        })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        })
    }
})

module.exports = router
