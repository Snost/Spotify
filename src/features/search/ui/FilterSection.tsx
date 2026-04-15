'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePlaybackActions } from '@/features/player/api/usePlaybackActions'

type Item = {
  id: string
  title: string
  subtitle: string
  image: string | null
  type: 'track' | 'album' | 'playlist'
}

type Props = {
  title: string
  items: Item[]
  variant?: 'default' | 'wide'
}

function extractUuid(value: string) {
  const match = value.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  )

  return match?.[0] ?? null
}

function getItemHref(item: Item) {
  const extractedId = extractUuid(item.id)

  const isFallbackAlbum =
    item.type === 'album' &&
    (item.id.includes('fallback-album') ||
      item.subtitle.toLowerCase().includes('demo'))

  const isFallbackPlaylist =
    item.type === 'playlist' &&
    (item.id.includes('fallback-playlist') ||
      item.subtitle.toLowerCase().includes('demo'))

  if (item.type === 'track') {
    return extractedId ? `/play/${extractedId}` : `/play/${item.id}`
  }

  if (isFallbackAlbum || isFallbackPlaylist) {
    return extractedId ? `/play/${extractedId}` : '/player'
  }

  if (item.type === 'album') {
    return extractedId ? `/album/${extractedId}` : `/album/${item.id}`
  }

  return extractedId ? `/playlist/${extractedId}` : `/playlist/${item.id}`
}

export function FilterSection({
  title,
  items,
  variant = 'default',
}: Props) {
  const isWide = variant === 'wide'
  const router = useRouter()
  const { startPlaybackMutation } = usePlaybackActions()

  const handleTrackClick = async (item: Item, href: string) => {
    const extractedId = extractUuid(item.id)

    if (!extractedId) {
      router.push(href)
      return
    }

    try {
      await startPlaybackMutation.mutateAsync({
        contextType: 'search',
        contextExternalId: null,
        startTrackId: extractedId,
      })
    } catch (error) {
      console.error(error)
    }

    router.push(`/player?trackId=${extractedId}`)
  }

  return (
    <section className="mt-[26px]">
      <div className="mb-[14px] flex items-start justify-between gap-3">
        <h2
          className={`text-[24px] font-semibold leading-[28px] text-groov-accent ${
            isWide ? 'max-w-[210px]' : 'max-w-[240px]'
          }`}
        >
          {title}
        </h2>

        <button
          type="button"
          className="shrink-0 pt-[6px] text-[13px] font-medium leading-[16px] text-[#8FA3BF]"
        >
          Дивитись все
        </button>
      </div>

      <div className="-mr-4 overflow-hidden">
        <div className="hide-scrollbar flex gap-3 overflow-x-auto pr-4">
          {items.map((item, index) => {
            const href = getItemHref(item)
            const isTrackLike =
              item.type === 'track' ||
              item.id.includes('fallback-album') ||
              item.id.includes('fallback-playlist') ||
              item.subtitle.toLowerCase().includes('demo')

            if (isTrackLike) {
              return (
                <button
                  key={`${item.type}-${item.id}-${index}`}
                  type="button"
                  onClick={() => void handleTrackClick(item, href)}
                  className={`shrink-0 overflow-hidden rounded-[16px] bg-[#1A2740] text-left ${
                    isWide ? 'w-[175px]' : 'w-[155px]'
                  }`}
                >
                  <div className={isWide ? '' : 'px-[10px] pb-[10px] pt-[10px]'}>
                    <div
                      className={`w-full overflow-hidden ${
                        isWide
                          ? 'h-[80px] rounded-t-[16px]'
                          : 'h-[119px] rounded-[26px]'
                      }`}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-groov-surface text-[11px] text-groov-muted">
                          No image
                        </div>
                      )}
                    </div>

                    <div className={isWide ? 'px-3 pb-3 pt-[10px]' : 'pt-[14px]'}>
                      <h3
                        className={`font-medium text-groov-accent ${
                          isWide
                            ? 'line-clamp-2 text-[14px] leading-[18px]'
                            : 'line-clamp-2 text-[13px] leading-[16px]'
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`text-[#E7EDF5] ${
                          isWide
                            ? 'mt-[4px] line-clamp-3 text-[12px] leading-[15px]'
                            : 'mt-[6px] line-clamp-2 text-[11px] leading-[14px]'
                        }`}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </button>
              )
            }

            return (
              <Link
                key={`${item.type}-${item.id}-${index}`}
                href={href}
                className={`shrink-0 overflow-hidden rounded-[16px] bg-[#1A2740] ${
                  isWide ? 'w-[175px]' : 'w-[155px]'
                }`}
              >
                <div className={isWide ? '' : 'px-[10px] pb-[10px] pt-[10px]'}>
                  <div
                    className={`w-full overflow-hidden ${
                      isWide
                        ? 'h-[80px] rounded-t-[16px]'
                        : 'h-[119px] rounded-[26px]'
                    }`}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-groov-surface text-[11px] text-groov-muted">
                        No image
                      </div>
                    )}
                  </div>

                  <div className={isWide ? 'px-3 pb-3 pt-[10px]' : 'pt-[14px]'}>
                    <h3
                      className={`font-medium text-groov-accent ${
                        isWide
                          ? 'line-clamp-2 text-[14px] leading-[18px]'
                          : 'line-clamp-2 text-[13px] leading-[16px]'
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`text-[#E7EDF5] ${
                        isWide
                          ? 'mt-[4px] line-clamp-3 text-[12px] leading-[15px]'
                          : 'mt-[6px] line-clamp-2 text-[11px] leading-[14px]'
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}