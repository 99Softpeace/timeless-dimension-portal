import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import dbConnect from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const adminCheck = await requireAdmin(req)
    if (!adminCheck.ok) return adminCheck.response

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, message: 'Cloudinary is not configured on the server.' },
        { status: 500 }
      )
    }

    const folder = 'timeless-portal/products'
    const timestamp = Math.round(Date.now() / 1000)
    const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret)

    return NextResponse.json({
      success: true,
      data: {
        cloudName,
        apiKey,
        folder,
        timestamp,
        signature,
      },
    })
  } catch (error: any) {
    console.error('Upload signature error:', error)
    return NextResponse.json(
      { success: false, message: 'Could not prepare upload.', error: error.message },
      { status: 500 }
    )
  }
}
