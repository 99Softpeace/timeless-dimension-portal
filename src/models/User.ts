import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const addressSchema = new mongoose.Schema({
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    address1: { type: String, trim: true, required: true },
    address2: { type: String, trim: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Nigeria' },
    phone: { type: String, trim: true },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true })

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
    addresses: {
        type: [addressSchema],
        default: []
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

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

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

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password)
}

userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.passwordResetToken
    delete userObject.passwordResetExpires
    return userObject
}

userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email: email.toLowerCase().trim(), isActive: true })
}

function getUserModel() {
    const existingModel = mongoose.models.User
    const hasAddresses = Boolean((existingModel as any)?.schema?.path('addresses'))
    if (existingModel && hasAddresses) return existingModel
    if (existingModel && !hasAddresses) delete (mongoose.models as any).User
    return mongoose.model('User', userSchema)
}

const User: any = getUserModel()

export default User
