import type { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  icon: ReactNode
  selected: boolean
  onSelect: () => void
}

export function VisibilityOptionCard({
  title,
  description,
  icon,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full min-h-[98px] rounded-[14px] px-[16px] py-[16px] text-left transition-all duration-200 ${
        selected
          ? 'border border-groov-accent bg-groov-surface'
          : 'border border-transparent bg-groov-surface'
      }`}
    >
      {/* 👇 ГОЛОВНИЙ ФІКС */}
      <div className="flex items-center gap-[14px]">
        {/* ICON */}
        <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center text-groov-accent">
          {icon}
        </div>

        {/* TEXT */}
        <div className="flex flex-1 flex-col justify-center">
          <div className="text-[20px] leading-[24px] font-semibold text-groov-accent">
            {title}
          </div>

          {/* 👇 ЗБІЛЬШЕНИЙ ВІДСТУП */}
          <div className="mt-[10px] text-[16px] leading-[20px] text-groov-accent/80">
            {description}
          </div>
        </div>
      </div>
    </button>
  )
}