import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import User from '@/models/User'

type DecodedToken = {
  userId?: string
}

export function getUserIdFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization')

  if (!authHeader) {
    return null
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim()

  if (!token) {
    return null
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as DecodedToken

    return typeof decoded.userId === 'string' ? decoded.userId : null
  } catch {
    return null
  }
}

export async function requireAdmin(req: Request) {
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  const user = await (User as any).findById(userId).select('role isActive')
  if (!user || user.isActive === false || user.role !== 'admin') {
    return {
      ok: false as const,
      response: NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      ),
    }
  }

  return { ok: true as const, userId, user }
}
