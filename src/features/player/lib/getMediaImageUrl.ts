export function getMediaImageUrl(imageIdOrUrl?: string | null) {
  if (!imageIdOrUrl) {
    return null
  }

  if (
    imageIdOrUrl.startsWith('http://') ||
    imageIdOrUrl.startsWith('https://') ||
    imageIdOrUrl.startsWith('data:')
  ) {
    return imageIdOrUrl
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') ?? ''

  if (!baseUrl) {
    return null
  }

  return `${baseUrl}/api/v1/media/images/${imageIdOrUrl}`
}