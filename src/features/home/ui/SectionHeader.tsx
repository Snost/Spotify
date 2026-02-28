import Link from 'next/link'

export function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[16px] font-semibold tracking-tight text-white">{title}</h2>
      {href ? (
        <Link className="text-[12px] text-groov-blue2 hover:text-groov-accent" href={href}>
          Дивитись все
        </Link>
      ) : (
        <span className="text-[12px] text-groov-blue2">Дивитись все</span>
      )}
    </div>
  )
}