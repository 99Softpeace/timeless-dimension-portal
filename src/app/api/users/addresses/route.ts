import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { getUserIdFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function normalizeAddress(body: any) {
    return {
        firstName: String(body?.firstName || '').trim(),
        lastName: String(body?.lastName || '').trim(),
        address1: String(body?.address1 || '').trim(),
        address2: String(body?.address2 || '').trim(),
        city: String(body?.city || '').trim(),
        state: String(body?.state || '').trim(),
        postalCode: String(body?.postalCode || '').trim(),
        country: String(body?.country || 'Nigeria').trim() || 'Nigeria',
        phone: String(body?.phone || '').trim(),
        isDefault: Boolean(body?.isDefault),
    }
}

function validateAddress(address: ReturnType<typeof normalizeAddress>) {
    return Boolean(address.address1 && address.city && address.state)
}

async function getAuthedUser(req: NextRequest) {
    const userId = getUserIdFromRequest(req)
    if (!userId) return null
    return (User as any).findOne({ _id: userId, isActive: true })
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const user = await getAuthedUser(req)
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ success: true, data: user.addresses || [] })
    } catch (error: any) {
        console.error('Error fetching addresses:', error)
        return NextResponse.json({ success: false, message: 'Error fetching addresses', error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const user = await getAuthedUser(req)
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const address = normalizeAddress(await req.json())
        if (!validateAddress(address)) {
            return NextResponse.json({ success: false, message: 'Address, city, and state are required' }, { status: 400 })
        }

        if (address.isDefault) {
            user.addresses.forEach((item: any) => { item.isDefault = false })
        }
        user.addresses.push(address)
        await user.save()
        return NextResponse.json({ success: true, data: user.addresses })
    } catch (error: any) {
        console.error('Error adding address:', error)
        return NextResponse.json({ success: false, message: 'Error adding address', error: error.message }, { status: 400 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect()
        const user = await getAuthedUser(req)
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const id = String(body?.id || '').trim()
        const address = normalizeAddress(body)
        if (!id || !validateAddress(address)) {
            return NextResponse.json({ success: false, message: 'Address id, address, city, and state are required' }, { status: 400 })
        }

        const existingAddress = user.addresses.id(id)
        if (!existingAddress) {
            return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 })
        }

        if (address.isDefault) {
            user.addresses.forEach((item: any) => { item.isDefault = false })
        }
        existingAddress.set(address)
        await user.save()
        return NextResponse.json({ success: true, data: user.addresses })
    } catch (error: any) {
        console.error('Error updating address:', error)
        return NextResponse.json({ success: false, message: 'Error updating address', error: error.message }, { status: 400 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect()
        const user = await getAuthedUser(req)
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const { id } = await req.json()
        const address = user.addresses.id(String(id || ''))
        if (!address) {
            return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 })
        }

        address.deleteOne()
        await user.save()
        return NextResponse.json({ success: true, data: user.addresses })
    } catch (error: any) {
        console.error('Error deleting address:', error)
        return NextResponse.json({ success: false, message: 'Error deleting address', error: error.message }, { status: 500 })
    }
}
