import { useMutation } from '@tanstack/react-query'
import {
  addTrackToPlaylist,
  createPlaylist,
  linkPlaylistCover,
  updatePlaylist,
} from '@/shared/api/playlists'
import { uploadImage } from '@/shared/api/media'

type CreatePlaylistInput = {
  name: string
  description: string | null
  isPublic: boolean
  trackIds: string[]
  coverFile?: File | null
}

export function useCreatePlaylist() {
  return useMutation({
    mutationFn: async ({
      name,
      description,
      isPublic,
      trackIds,
      coverFile,
    }: CreatePlaylistInput) => {
      const created = await createPlaylist()
      const playlistId = created.playlistId

      await updatePlaylist(playlistId, {
        name,
        description,
        isPublic,
      })

      if (coverFile) {
        const uploadedImage = await uploadImage(coverFile)

        await linkPlaylistCover(playlistId, {
          imageId: uploadedImage.imageId,
          imageWidth: 300,
          imageHeight: 300,
          imageFileType: coverFile.type || 'image/png',
          imageSizeInBytes: coverFile.size || 100000,
        })
      }

      for (const trackId of trackIds) {
        await addTrackToPlaylist(playlistId, { trackId })
      }

      return { playlistId }
    },
  })
}