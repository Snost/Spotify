export type CollectionTrackItem = {
  id: string
  title: string
  artist: string
  image: string | null
}

export type CollectionDetails = {
  id: string
  title: string
  description: string
  author: string
  year: string
  tracksCount: number
  cover: string | null
  tracks: CollectionTrackItem[]
}