import mongoose, { Schema, Document, Model, Types } from 'mongoose'

/* =========================
   Interface
========================= */

export interface IOrder extends Document {
  orderNumber: string
  user: Types.ObjectId
  items: {
    product?: Types.ObjectId
    name: string
    price: number
    quantity: number
    image: string
  }[]
  shippingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  billingAddress: {
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  currency: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: 'card' | 'bank_transfer' | 'paypal' | 'stripe' | 'flutterwave' | 'cash_on_delivery'
  paymentReference?: string
  paymentIntentId?: string
  flwRef?: string
  txRef?: string
  trackingNumber?: string
  notes?: string
  estimatedDelivery?: Date
  deliveredAt?: Date
  cancelledAt?: Date
  cancellationReason?: string
  totalItems?: number
  statusDisplay?: string

  calculateTotals(): IOrder
  updateStatus(newStatus: string, notes?: string): Promise<IOrder>
}

/* =========================
   Schema
========================= */

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true }
      }
    ],

    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      company: String,
      address1: { type: String, required: true },
      address2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'Nigeria' },
      phone: String
    },

    billingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      company: String,
      address1: { type: String, required: true },
      address2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'Nigeria' },
      phone: String
    },

    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'NGN' },

    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending'
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },

    paymentMethod: {
      type: String,
      enum: ['card', 'bank_transfer', 'paypal', 'stripe', 'flutterwave', 'cash_on_delivery'],
      required: true
    },

    paymentReference: String,
    paymentIntentId: String,
    flwRef: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    txRef: String,
    trackingNumber: String,
    notes: { type: String, maxlength: 500 },
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

/* =========================
   Indexes
========================= */

orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ status: 1 })
orderSchema.index({ paymentStatus: 1 })
orderSchema.index({ paymentReference: 1 })
orderSchema.index({ createdAt: -1 })

/* =========================
   Pre-save Hook
========================= */

orderSchema.pre('validate', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model<IOrder>('Order').countDocuments()
    this.orderNumber = `TDP-${Date.now()}-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

/* =========================
   Virtuals
========================= */

orderSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})

orderSchema.virtual('statusDisplay').get(function () {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded'
  }
  return statusMap[this.status] || this.status
})

/* =========================
   Methods
========================= */

orderSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0
  )
  this.total = this.subtotal + this.shippingCost + this.tax - this.discount
  return this
}

orderSchema.methods.updateStatus = async function (
  newStatus: string,
  notes: string = ''
): Promise<IOrder> {
  this.status = newStatus
  this.notes = notes

  if (newStatus === 'delivered') {
    this.deliveredAt = new Date()
  }

  if (newStatus === 'cancelled') {
    this.cancelledAt = new Date()
    this.cancellationReason = notes
  }

  return this.save()
}

/* =========================
   Statics
========================= */

orderSchema.statics.findByUser = function (
  userId: Types.ObjectId,
  options: { limit?: number; skip?: number; status?: string } = {}
) {
  const { limit = 20, skip = 0, status } = options
  const query: any = { user: userId }

  if (status) {
    query.status = status
  }

  return this.find(query)
    .populate('items.product', 'name image')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
}

orderSchema.statics.getStats = function (startDate?: Date, endDate?: Date) {
  const matchStage: any = {}

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
        ordersByStatus: {
          $push: {
            status: '$status',
            total: '$total'
          }
        }
      }
    }
  ])
}

/* =========================
   Model Export (Next.js Safe)
========================= */

const Order =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>('Order', orderSchema)

export default Order
