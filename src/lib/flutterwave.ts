import Flutterwave from 'flutterwave-node-v3'

export function getFlutterwaveClient() {
  const publicKey =
    process.env.FLW_PUBLIC_KEY || process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY
  const secretKey = process.env.FLW_SECRET_KEY

  if (!publicKey || !secretKey) {
    throw new Error(
      'Flutterwave keys are missing. Set NEXT_PUBLIC_FLW_PUBLIC_KEY (or FLW_PUBLIC_KEY) and FLW_SECRET_KEY.'
    )
  }

  return new (Flutterwave as any)(publicKey, secretKey)
}
