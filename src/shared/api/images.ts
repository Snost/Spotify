import { apiClient } from '@/shared/api/client'

export type UploadImageResponse = {
  imageId?: string
  trackId?: string
}

export type ImageAssetDetailsResponse = {
  imageId: string
  width: number
  height: number
  fileType: string
  sizeInBytes: number
}

export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('File', file)

  const { data } = await apiClient.post<UploadImageResponse>(
    '/api/v1/media/images',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return data
}

export async function getImageAssetDetails(imageId: string) {
  const { data } = await apiClient.get<ImageAssetDetailsResponse>(
    '/api/v1/media/images',
    {
      params: {
        ImageId: imageId,
      },
    }
  )

  return data
}