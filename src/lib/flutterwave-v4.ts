import crypto from 'crypto'

const TOKEN_URL = 'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token'

let cachedToken: { value: string; expiresAt: number } | null = null

export function flutterwaveBaseUrl() {
  return process.env.FLW_ENVIRONMENT === 'sandbox'
    ? 'https://developersandbox-api.flutterwave.com'
    : 'https://f4bexperience.flutterwave.com'
}

export async function getFlutterwaveAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value

  const clientId = process.env.FLW_CLIENT_ID
  const clientSecret = process.env.FLW_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error('Flutterwave V4 credentials are missing')

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: 'client_credentials' }),
    cache: 'no-store',
  })
  const result = await response.json()
  if (!response.ok || !result.access_token) throw new Error(result.error_description || 'Flutterwave authentication failed')

  cachedToken = { value: result.access_token, expiresAt: Date.now() + Number(result.expires_in || 600) * 1000 }
  return cachedToken.value
}

export async function flutterwaveRequest<T = any>(path: string, init: RequestInit = {}) {
  const token = await getFlutterwaveAccessToken()
  const response = await fetch(`${flutterwaveBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Trace-Id': crypto.randomUUID(),
      ...(init.method && init.method !== 'GET' ? { 'X-Idempotency-Key': crypto.randomUUID() } : {}),
      ...(init.headers || {}),
    },
    cache: 'no-store',
  })
  const result = await response.json()
  if (!response.ok) {
    const validation = Array.isArray(result?.error?.validation_errors)
      ? result.error.validation_errors.map((item: any) => `${item.field_name}: ${item.message}`).join('; ')
      : ''
    throw new Error(validation || result?.error?.message || result?.message || `Flutterwave request failed (${response.status})`)
  }
  return result as T
}

export async function encryptFlutterwaveValue(value: string, nonce: string) {
  if (nonce.length !== 12) throw new Error('Encryption nonce must be 12 characters')
  const encodedKey = process.env.FLW_ENCRYPTION_KEY
  if (!encodedKey) throw new Error('FLW_ENCRYPTION_KEY is missing')
  const key = await crypto.webcrypto.subtle.importKey('raw', Buffer.from(encodedKey, 'base64'), { name: 'AES-GCM' }, false, ['encrypt'])
  const encrypted = await crypto.webcrypto.subtle.encrypt(
    { name: 'AES-GCM', iv: new TextEncoder().encode(nonce) },
    key,
    new TextEncoder().encode(value)
  )
  return Buffer.from(encrypted).toString('base64')
}

export async function retrieveFlutterwaveCharge(id: string) {
  const response = await flutterwaveRequest<{ data?: any }>(`/charges/${encodeURIComponent(id)}`)
  return response.data || {}
}
