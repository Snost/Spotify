export function getBackendImageUrl(imageId?: string | null) {
  if (!imageId) {
    return null
  }

  if (
    imageId.startsWith('http://') ||
    imageId.startsWith('https://') ||
    imageId.startsWith('data:')
  ) {
    return imageId
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') ?? ''

  if (!baseUrl) {
    return null
  }

  return `${baseUrl}/api/v1/media/images/${imageId}`
}