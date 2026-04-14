export type RelatedTrackCard = {
  id: string
  title: string
  artistLabel: string
  coverImageId: string | null
}

export type RelatedAlbumCard = {
  id: string
  title: string
  yearLabel: string
  typeLabel: string
  coverImageId: string | null
}

export type RelatedArtistCard = {
  id: string
  name: string
  subtitle: string
  avatarImageId: string | null
}

export type TrackRelatedData = {
  genreTracks: RelatedTrackCard[]
  albumsByArtist: RelatedAlbumCard[]
  relatedArtists: RelatedArtistCard[]
}