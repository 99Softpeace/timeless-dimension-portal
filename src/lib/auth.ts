import jwt from 'jsonwebtoken'

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
