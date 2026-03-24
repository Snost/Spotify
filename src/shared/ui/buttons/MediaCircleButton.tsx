import type { ButtonHTMLAttributes, ReactNode } from 'react'

type MediaCircleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function MediaCircleButton({
  children,
  className = '',
  type = 'button',
  ...props
}: MediaCircleButtonProps) {
  return (
    <button
      type={type}
      className={`flex items-center justify-center rounded-[18px] bg-groov-accent text-groov-textDark transition-transform active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}