import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import {
  addTrackToPlaylist,
  createPlaylist,
  getPlaylist,
  linkPlaylistCover,
  updatePlaylist,
} from '@/shared/api/playlists'
import { uploadImage } from '@/shared/api/images'
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

type ImageMeta = {
  width: number
  height: number
  sizeInBytes: number
  fileType: string
}

function normalizeImageFileType(file?: File | null) {
  const raw =
    file?.type?.toLowerCase().trim() ||
    file?.name?.split('.').pop()?.toLowerCase().trim() ||
    'png'

  if (
    raw === 'jpg' ||
    raw === 'jpeg' ||
    raw === 'image/jpg' ||
    raw === 'image/jpeg'
  ) {
    return 'jpeg'
  }

  if (raw === 'png' || raw === 'image/png') {
    return 'png'
  }

  if (raw === 'webp' || raw === 'image/webp') {
    return 'webp'
  }

  return raw.replace('image/', '')
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

function getImageMetaFromFile(file: File): Promise<ImageMeta> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const width = img.naturalWidth
      const height = img.naturalHeight

      URL.revokeObjectURL(objectUrl)

      resolve({
        width,
        height,
        sizeInBytes: file.size,
        fileType: normalizeImageFileType(file),
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to read image dimensions'))
    }

    img.src = objectUrl
  })
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    if (typeof data === 'string' && data.trim()) {
      return data
    }

    if (data && typeof data === 'object') {
      const message =
        (data as { detail?: string }).detail ||
        (data as { message?: string }).message ||
        (data as { error?: string }).error ||
        (data as { code?: string }).code ||
        (data as { title?: string }).title

      if (message) {
        return message
      }
    }

    if (error.message) {
      return error.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown error'
}

function isValidTrackId(trackId: unknown): trackId is string {
  return typeof trackId === 'string' && trackId.trim().length > 0
}

function getSafeUniqueTrackIds(trackIds: string[]) {
  return [...new Set(trackIds.filter(isValidTrackId).map((id) => id.trim()))]
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

      let coverLinkError: string | null = null

      if (coverFile) {
        try {
          const uploaded = await uploadImage(coverFile)
          const uploadedImageId = uploaded?.imageId

          console.log('UPLOAD IMAGE RESULT', uploaded)

          if (!uploadedImageId) {
            throw new Error('Upload did not return imageId')
          }

          const imageMeta = await getImageMetaFromFile(coverFile)

          console.log('IMAGE META FROM FILE', imageMeta)

          await linkPlaylistCover(playlistId, {
            imageId: uploadedImageId,
            imageWidth: imageMeta.width,
            imageHeight: imageMeta.height,
            imageFileType: imageMeta.fileType,
            imageSizeInBytes: imageMeta.sizeInBytes,
          })
        } catch (error) {
          coverLinkError = getErrorMessage(error)
          console.error('FAILED TO LINK PLAYLIST COVER:', coverLinkError, error)
        }
      }

      const uniqueTrackIds = getSafeUniqueTrackIds(trackIds)
      const failedTrackIds: string[] = []

      console.log('CREATE PLAYLIST trackIds:', trackIds)
      console.log('CREATE PLAYLIST uniqueTrackIds:', uniqueTrackIds)

      for (const trackId of uniqueTrackIds) {
        console.log('ADDING TRACK:', trackId)

        try {
          await addTrackToPlaylist(playlistId, { trackId })
        } catch (error) {
          const message = getErrorMessage(error)
          console.error('FAILED TRACK ID:', trackId, message, error)
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
      const displayName = useAuthStore.getState().displayName?.trim() || 'GROOV'
      const previewImage = coverFile ? await fileToDataUrl(coverFile) : null

      return {
        playlistId,
        failedTrackIds,
        coverLinkError,
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
    onSuccess: ({ playlistId, playlist }) => {
      useLibraryPlaylistsStore.getState().prependPlaylist(playlist)

  
    },
  })
}