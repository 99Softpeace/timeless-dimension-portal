const MAX_IMAGE_UPLOAD_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_UPLOAD_SIZE = 100 * 1024 * 1024
const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const ALLOWED_VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'])

type UploadResult = {
  url: string
  type: 'image' | 'video'
}

function getMediaType(file: File): 'image' | 'video' {
  if (ALLOWED_IMAGE_MIME_TYPES.has(file.type)) return 'image'
  if (ALLOWED_VIDEO_MIME_TYPES.has(file.type)) return 'video'
  throw new Error('Unsupported media type. Use JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV.')
}

function validateMediaFile(file: File) {
  const type = getMediaType(file)
  const maxSize = type === 'video' ? MAX_VIDEO_UPLOAD_SIZE : MAX_IMAGE_UPLOAD_SIZE

  if (file.size > maxSize) {
    throw new Error(type === 'video' ? 'Video is too large. Maximum size is 100MB.' : 'Image is too large. Maximum size is 5MB.')
  }

  return type
}

export async function uploadAdminMedia(file: File, token: string | null): Promise<UploadResult> {
  const type = validateMediaFile(file)

  const signatureRes = await fetch('/api/upload/signature', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token || ''}`,
    },
  })
  const signaturePayload = await signatureRes.json()

  if (!signatureRes.ok || !signaturePayload.success) {
    throw new Error(signaturePayload.error || signaturePayload.message || 'Could not prepare media upload.')
  }

  const { cloudName, apiKey, folder, timestamp, signature } = signaturePayload.data
  const cloudinaryData = new FormData()
  cloudinaryData.append('file', file)
  cloudinaryData.append('api_key', apiKey)
  cloudinaryData.append('timestamp', String(timestamp))
  cloudinaryData.append('signature', signature)
  cloudinaryData.append('folder', folder)

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: cloudinaryData,
  })
  const uploadPayload = await uploadRes.json()

  if (!uploadRes.ok || !uploadPayload.secure_url) {
    throw new Error(uploadPayload.error?.message || `Upload failed for ${file.name}`)
  }

  return {
    url: uploadPayload.secure_url,
    type,
  }
}
