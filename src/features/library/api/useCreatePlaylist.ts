import { useMutation } from '@tanstack/react-query'
import {
  addTrackToPlaylist,
  createPlaylist,
  getPlaylist,
  linkPlaylistCover,
  updatePlaylist,
} from '@/shared/api/playlists'
import { getImageAssetDetails, uploadImage } from '@/shared/api/images'
import { useLibraryPlaylistsStore } from '@/features/library/model/useLibraryPlaylistsStore'
import { useAuthStore } from '@/shared/stores/auth.store'

type CreatePlaylistInput = {
  name: string
  description: string | null
  isPublic: boolean
  trackIds: string[]
  coverFile?: File | null
  coverColor?: string
}

function getFileType(file: File) {
  const fromMime = file.type.split('/')[1]
  if (fromMime) return fromMime

  const fromName = file.name.split('.').pop()
  return fromName?.toLowerCase() ?? 'png'
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as data URL'))
      }
    }

    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function useCreatePlaylist() {
  return useMutation({
    mutationFn: async ({
      name,
      description,
      isPublic,
      trackIds,
      coverFile,
      coverColor,
    }: CreatePlaylistInput) => {
      const created = await createPlaylist()
      const playlistId = created.playlistId

      await updatePlaylist(playlistId, {
        name,
        description,
        isPublic: false,
      })

      if (coverFile) {
        const uploaded = await uploadImage(coverFile)
        const uploadedImageId = uploaded.imageId ?? uploaded.trackId

        if (uploadedImageId) {
          try {
            const imageDetails = await getImageAssetDetails(uploadedImageId)

            await linkPlaylistCover(playlistId, {
              imageId: uploadedImageId,
              imageWidth: imageDetails.width,
              imageHeight: imageDetails.height,
              imageFileType: imageDetails.fileType || getFileType(coverFile),
              imageSizeInBytes: imageDetails.sizeInBytes,
            })
          } catch (error) {
            console.error('Failed to link playlist cover', error)
          }
        }
      }

      const failedTrackIds: string[] = []

      for (const trackId of trackIds) {
        try {
          await addTrackToPlaylist(playlistId, { trackId })
        } catch (error) {
          console.error('FAILED TRACK ID:', trackId, error)
          failedTrackIds.push(trackId)
        }
      }

      if (isPublic) {
        await updatePlaylist(playlistId, {
          name,
          description,
          isPublic: true,
        })
      }

      const playlistDetails = await getPlaylist(playlistId)
      const displayName =
        useAuthStore.getState().displayName?.trim() || 'GROOV'

      const previewImage = coverFile ? await fileToDataUrl(coverFile) : null

      return {
        playlistId,
        failedTrackIds,
        playlist: {
          id: playlistId,
          title: playlistDetails.name,
          subtitle: displayName,
          tracksCount: playlistDetails.tracks.length,
          image: previewImage,
          color: coverColor ?? '#A78BCE',
        },
      }
    },
    onSuccess: ({ playlist }) => {
      useLibraryPlaylistsStore.getState().prependPlaylist(playlist)
    },
  })
}