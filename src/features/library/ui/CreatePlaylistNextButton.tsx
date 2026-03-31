import Link from 'next/link'

type Props = {
  href: string
  disabled?: boolean
  label?: string
  className?: string
}

export function CreatePlaylistNextButton({
  href,
  disabled = false,
  label = 'Далі',
  className = '',
}: Props) {
  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={`h-[50px] w-full rounded-[14px] bg-groov-secondary text-[16px] font-medium text-groov-accent opacity-50 ${className}`}
      >
        {label}
      </button>
    )
  }

  return (
    <Link
      href={href}
      className={`flex h-[50px] w-full items-center justify-center rounded-[14px] bg-groov-secondary text-[16px] font-medium text-groov-accent transition-all duration-200 active:opacity-80 ${className}`}
    >
      {label}
    </Link>
  )
}