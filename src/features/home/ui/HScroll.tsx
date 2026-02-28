import Link from 'next/link'
import { CoverPlaceholder } from '@/shared/ui/CoverPlaceholder'
import type { Item } from '../mock'

export function HScroll({ items, hrefPrefix = '/track' }: { items: Item[]; hrefPrefix?: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div className="flex gap-4">
        {items.map((it, idx) => (
          <Link key={it.id} href={`${hrefPrefix}/${it.id}`} className="w-[120px] shrink-0">
            <div className="relative aspect-square w-[120px] overflow-hidden rounded-xl bg-groov-primary">
              <CoverPlaceholder variant={(((idx % 3) + 1) as 1 | 2 | 3)} />
            </div>
            <div className="mt-2">
              <div className="truncate text-[12px] font-semibold text-white">{it.title}</div>
              {it.subtitle ? <div className="truncate text-[11px] text-groov-blue2">{it.subtitle}</div> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}