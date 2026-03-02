import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MIME_EXTENSION_MAP: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
}

// POST /api/upload
export async function POST(req: NextRequest) {
    try {
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

        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        await fs.mkdir(uploadDir, { recursive: true })

        const sourceExt = path.extname(imageFile.name || '').toLowerCase()
        const extension = sourceExt || MIME_EXTENSION_MAP[imageFile.type] || '.jpg'
        const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`
        const filePath = path.join(uploadDir, fileName)

        const bytes = await imageFile.arrayBuffer()
        await fs.writeFile(filePath, Buffer.from(bytes))

        return NextResponse.json({
            success: true,
            url: `/uploads/${fileName}`
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
