export type PlayerTab = 'next' | 'lyrics' | 'related' | null

export type ArtistLike =
  | string
  | {
      id?: string
      name?: string | null
    }

export type QueueTrackItem = {
  id: string
  title: string
  duration: string | number | null
  albumId: string | null
  mainArtists: ArtistLike[]
  moods?: string[]
}