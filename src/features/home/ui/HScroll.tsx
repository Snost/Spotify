'use client'

import Link from 'next/link'

type HScrollItem = {
  id: string | number
  title: string
  subtitle?: string
  image?: string
}

type Props = {
  items: HScrollItem[]
  hrefPrefix: string
  variant?: 'default' | 'album'
}

export function HScroll({
  items,
  hrefPrefix,
  variant = 'default',
}: Props) {
  const isAlbum = variant === 'album'

  return (
    <div className="hide-scrollbar -mx-4 flex items-start gap-3 overflow-x-auto px-4 pb-1">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`${hrefPrefix}/${item.id}`}
          className="w-[126px] shrink-0"
        >
          <div className="rounded-[18px] bg-groov-surface p-[10px]">
            <div className="h-[80px] w-full overflow-hidden rounded-[12px] bg-groov-primary">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

     <div className={isAlbum ? 'pt-[8px] h-[52px]' : 'pt-[8px]'}>
  <div
    className={
      isAlbum
        ? 'line-clamp-2 text-[13px] font-medium leading-[15px] text-groov-accent'
        : 'line-clamp-1 text-[13px] font-medium leading-[16px] text-groov-accent'
    }
  >
    {item.title}
  </div>

  {item.subtitle ? (
    <div
      className={
        isAlbum
          ? 'mt-[3px] line-clamp-1 text-[11px] leading-[13px] text-groov-muted'
          : 'mt-[2px] line-clamp-2 text-[11px] leading-[14px] text-groov-muted'
      }
    >
      {item.subtitle}
    </div>
  ) : null}
</div>
          </div>
        </Link>
      ))}
    </div>
  )
}