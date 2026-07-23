import mongoose, { Schema } from 'mongoose'
const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  items: [{ id: String, name: String, price: Number, image: String, quantity: Number, slug: String, selectedColor: String, cartKey: String }],
  reminderSentAt: Date,
}, { timestamps: true })
export default mongoose.models.SavedCart || mongoose.model('SavedCart', cartSchema)
