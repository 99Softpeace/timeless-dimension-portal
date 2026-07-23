import mongoose, { Schema, Model } from 'mongoose'

export interface IAdminPreference {
  key: string
  orderNotifications: boolean
  lowStockAlerts: boolean
  weeklySummary: boolean
  timezone: string
  updatedBy?: mongoose.Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const adminPreferenceSchema = new Schema<IAdminPreference>(
  {
    key: { type: String, required: true, unique: true, default: 'global' },
    orderNotifications: { type: Boolean, default: true },
    lowStockAlerts: { type: Boolean, default: true },
    weeklySummary: { type: Boolean, default: true },
    timezone: { type: String, default: 'Africa/Lagos' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const AdminPreference: Model<IAdminPreference> =
  mongoose.models.AdminPreference || mongoose.model<IAdminPreference>('AdminPreference', adminPreferenceSchema)

export default AdminPreference
