import type { LikedTrack } from '../model/types'

type Props = {
  title: string
  tracks: LikedTrack[]
}

function ShuffleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 3H21V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 20L10 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 10L4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 16V21H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 15L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 20L9 15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function PlayCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M10 8.8L16 12L10 15.2V8.8Z"
        fill="#0D1B2A"
      />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21s-6.7-4.35-9.2-8.05C.8 10.05 2.1 5.9 6.1 5.15c2.2-.4 4.1.55 5.1 2.2 1-1.65 2.9-2.6 5.1-2.2 4 .75 5.3 4.9 3.3 7.8C18.7 16.65 12 21 12 21Z" />
    </svg>
  )
}

export function LikedTracksList({ title, tracks }: Props) {
  return (
    <section className="mt-[22px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold leading-[22px] tracking-[-0.02em] text-groov-accent">
          {title}
        </h2>

        <div className="flex items-center gap-[10px] text-groov-accent">
          <button type="button" className="flex h-6 w-6 items-center justify-center">
            <ShuffleIcon />
          </button>

          <button type="button" className="flex h-6 w-6 items-center justify-center">
            <PlayCircleIcon />
          </button>
        </div>
      </div>

      <div className="mt-[12px] space-y-[8px]">
        {tracks.map((track) => (
          <button
            key={track.id}
            type="button"
            className="flex h-[42px] w-full items-center rounded-[10px] bg-groov-surface px-[8px] text-left"
          >
            <div className="h-[28px] w-[28px] shrink-0 overflow-hidden rounded-[6px]">
              <img
                src={track.cover}
                alt={track.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="ml-[8px] min-w-0 flex-1">
              <div className="truncate text-[12px] leading-[14px] text-groov-accent">
                {track.title}
              </div>
              <div className="truncate text-[10px] leading-[12px] text-groov-muted">
                {track.artist}
              </div>
            </div>

            <div className="ml-[8px] flex items-center gap-[8px]">
              <span className="text-[12px] leading-[14px] text-groov-accent">
                {track.duration}
              </span>

              <span className="text-groov-accent">
                <HeartIcon />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}