import type { PlaylistCoverImage } from '@/shared/api/playlists'

export function getPlaylistCoverUrl(
  customCoverImageId?: PlaylistCoverImage | null
) {
  const imageId = customCoverImageId?.imageId

  if (!imageId) {
    return null
  }

  return `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/media/images/${imageId}`
}