type Props = {
  label: string
  onClick?: () => void
}

export function AdvancedFilterChip({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[56px] w-full items-center justify-center rounded-[12px] bg-groov-surface px-3 text-center text-[14px] font-normal leading-[18px] text-groov-accent transition hover:bg-groov-primary/80"
    >
      <span className="line-clamp-2">{label}</span>
    </button>
  )
}