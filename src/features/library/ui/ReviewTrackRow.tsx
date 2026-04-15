type Props = {
  cover: string | null
  title: string
  artist: string
  duration: string
}

export function ReviewTrackRow({
  cover,
  title,
  artist,
  duration,
}: Props) {
  return (
    <div className="flex h-[70px] w-full items-center">
      <div className="h-[50px] w-[50px] shrink-0 overflow-hidden rounded-[8px] bg-groov-bg">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-groov-muted">
            No image
          </div>
        )}
      </div>

      <div className="ml-[12px] min-w-0 flex-1">
        <div className="truncate text-[14px] leading-[25px]">
          {title}
        </div>

        <div className="mt-[6px] truncate text-[14px] leading-[25px]">
          {artist}
        </div>
      </div>

      <div className="ml-[10px] shrink-0 text-[15px] leading-[20px]">
        {duration}
      </div>
    </div>
  )
}