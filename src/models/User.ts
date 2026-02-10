import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'moderator'],
        default: 'customer'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error: any) {
        next(error)
    }
})

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password)
}

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.passwordResetToken
    delete userObject.passwordResetExpires
    return userObject
}

// Static method to find by email
userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email: email.toLowerCase(), isActive: true })
}

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
