'use client'

import Link from 'next/link'
import { useState } from 'react'

type Props = {
  id: string
  title: string
  subtitle: string
  tracksCount: number
  image: string | null
}

export function AllPlaylistsGridCard({
  id,
  title,
  subtitle,
  tracksCount,
  image,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false)

  const showImage = Boolean(image) && !imageFailed

  return (
    <Link
      href={`/playlist/${id}`}
      className="block w-full overflow-hidden rounded-[16px] bg-groov-surface"
    >
      <div className="h-[130px] w-full overflow-hidden bg-groov-primary/40">
        {showImage ? (
          <img
            src={image!}
            alt={title}
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[14px] text-groov-accent/60">
            No cover
          </div>
        )}
      </div>

      <div className="h-[62px] px-[12px] pb-[8px] pt-[8px]">
        <div className="truncate text-[14px] font-medium leading-[17px] text-groov-accent">
          {title}
        </div>

        <div className="mt-[4px] truncate text-[12px] leading-[14px] text-groov-accent/45">
          {subtitle}
        </div>

        <div className="mt-[2px] text-[12px] leading-[14px] text-groov-accent/45">
          {tracksCount} треків
        </div>
      </div>
    </Link>
  )
}