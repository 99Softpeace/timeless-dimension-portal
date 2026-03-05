import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export const runtime = 'nodejs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// POST /api/upload
export async function POST(req: NextRequest) {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({
                success: false,
                message: 'Cloudinary is not configured on the server.'
            }, { status: 500 })
        }

        const formData = await req.formData()
        const imageFile = formData.get('image')

        if (!imageFile || typeof imageFile === 'string') {
            return NextResponse.json({
                success: false,
                message: 'No image file was provided.'
            }, { status: 400 })
        }

        if (!ALLOWED_MIME_TYPES.has(imageFile.type)) {
            return NextResponse.json({
                success: false,
                message: 'Unsupported image type. Use JPG, PNG, WEBP, or GIF.'
            }, { status: 400 })
        }

        if (imageFile.size > MAX_UPLOAD_SIZE) {
            return NextResponse.json({
                success: false,
                message: 'Image is too large. Maximum size is 5MB.'
            }, { status: 400 })
        }

        const bytes = await imageFile.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        const dataUri = `data:${imageFile.type};base64,${base64}`

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'timeless-portal/products',
            resource_type: 'image',
            overwrite: false,
            unique_filename: true
        })

        return NextResponse.json({
            success: true,
            url: uploadResult.secure_url
        })
    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json({
            success: false,
            message: 'Upload failed',
            error: error.message
        }, { status: 500 })
    }
}
