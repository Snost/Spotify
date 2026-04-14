import type { ArtistLike } from '@/features/player/model/player-screen.types'

export function getArtistLabel(artists?: ArtistLike[] | null): string {
  if (!artists || artists.length === 0) {
    return 'Unknown artist'
  }

  const names = artists
    .map((artist) => {
      if (typeof artist === 'string') {
        return artist.trim()
      }

      if (artist && typeof artist === 'object' && typeof artist.name === 'string') {
        return artist.name.trim()
      }

      return ''
    })
    .filter(Boolean)

  return names.length > 0 ? names.join(', ') : 'Unknown artist'
}