import Link from 'next/link'
import { CoverPlaceholder } from '@/shared/ui/CoverPlaceholder'
import type { Item } from '../mock'

export function GridCards({ items, hrefPrefix = '/playlist' }: { items: Item[]; hrefPrefix?: string }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((it, idx) => (
        <Link key={it.id} href={`${hrefPrefix}/${it.id}`} className="rounded-xl bg-groov-primary p-3">
          <div className="flex gap-3">
            <div className="h-[52px] w-[52px] overflow-hidden rounded-lg bg-groov-blue1">
              <CoverPlaceholder variant={(((idx % 3) + 1) as 1 | 2 | 3)} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-[12px] font-semibold text-white">{it.title}</div>
              <div className="mt-1 line-clamp-2 text-[11px] text-groov-blue2">{it.subtitle}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}