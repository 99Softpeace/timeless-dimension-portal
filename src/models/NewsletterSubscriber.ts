import mongoose, { Schema, Model } from 'mongoose'

export interface INewsletterSubscriber {
  email: string
  firstName?: string
  isActive: boolean
  source: string
  subscribedAt: Date
  unsubscribedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

const newsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    source: {
      type: String,
      default: 'website',
      trim: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: Date,
  },
  { timestamps: true }
)

const NewsletterSubscriber: Model<INewsletterSubscriber> =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>('NewsletterSubscriber', newsletterSubscriberSchema)

export default NewsletterSubscriber
