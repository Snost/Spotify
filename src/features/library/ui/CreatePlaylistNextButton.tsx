import Link from 'next/link'
import type { MouseEventHandler, ReactNode } from 'react'

type Props = {
  href?: string
  disabled?: boolean
  label?: string
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  type?: 'button' | 'submit'
  children?: ReactNode
}

export function CreatePlaylistNextButton({
  href,
  disabled = false,
  label = 'Далі',
  className = '',
  onClick,
  type = 'button',
  children,
}: Props) {
  const content = children ?? label

  const baseClassName = `flex h-[50px] w-full items-center justify-center rounded-[14px] bg-groov-secondary text-[16px] font-medium text-groov-accent transition-all duration-200 active:opacity-80 ${className}`

  if (!href) {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`${baseClassName} ${disabled ? 'opacity-50' : ''}`}
      >
        {content}
      </button>
    )
  }

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        onClick={onClick}
        className={`${baseClassName} opacity-50`}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      href={href}
      onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
      className={baseClassName}
    >
      {content}
    </Link>
  )
}