const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') })

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        const adminEmail = 'admin@timeless.com'
        const adminPassword = 'admin123' // You should change this after logging in!

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail })
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists')
            process.exit(0)
        }

        // Create admin user
        // Create admin user
        const adminUser = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        })

        await adminUser.save()
        console.log(`✅ Admin user created successfully`)
        console.log(`📧 Email: ${adminEmail}`)
        console.log(`🔑 Password: ${adminPassword}`)

        process.exit(0)
    } catch (error) {
        console.error('❌ Error creating admin user:', error)
        process.exit(1)
    }
}

createAdmin()
