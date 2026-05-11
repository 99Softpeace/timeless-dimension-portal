import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import dbConnect from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_UPLOAD_SIZE = 50 * 1024 * 1024
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

export const runtime = 'nodejs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// POST /api/upload
export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) {
            return adminCheck.response
        }

        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json({
                success: false,
                message: 'Cloudinary is not configured on the server.'
            }, { status: 500 })
        }

        const formData = await req.formData()
        const mediaFile = formData.get('media') || formData.get('image')

        if (!mediaFile || typeof mediaFile === 'string') {
            return NextResponse.json({
                success: false,
                message: 'No media file was provided.'
            }, { status: 400 })
        }

        const isImage = ALLOWED_IMAGE_MIME_TYPES.has(mediaFile.type)
        const isVideo = ALLOWED_VIDEO_MIME_TYPES.has(mediaFile.type)

        if (!isImage && !isVideo) {
            return NextResponse.json({
                success: false,
                message: 'Unsupported media type. Use JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV.'
            }, { status: 400 })
        }

        const maxSize = isVideo ? MAX_VIDEO_UPLOAD_SIZE : MAX_IMAGE_UPLOAD_SIZE
        if (mediaFile.size > maxSize) {
            return NextResponse.json({
                success: false,
                message: isVideo ? 'Video is too large. Maximum size is 50MB.' : 'Image is too large. Maximum size is 5MB.'
            }, { status: 400 })
        }

        const bytes = await mediaFile.arrayBuffer()
        const base64 = Buffer.from(bytes).toString('base64')
        const dataUri = `data:${mediaFile.type};base64,${base64}`

        const uploadResult = await cloudinary.uploader.upload(dataUri, {
            folder: 'timeless-portal/products',
            resource_type: isVideo ? 'video' : 'image',
            overwrite: false,
            unique_filename: true
        })

        return NextResponse.json({
            success: true,
            url: uploadResult.secure_url,
            type: isVideo ? 'video' : 'image'
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
