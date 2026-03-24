type Props = {
  children: React.ReactNode
  mobileMaxWidth?: number
  contentClassName?: string
  withTopGap?: boolean
  withDefaultPadding?: boolean
}

export function AppShell({
  children,
  mobileMaxWidth = 402,
  contentClassName = '',
  withTopGap = false,
  withDefaultPadding = true,
}: Props) {
  return (
    <div className="min-h-dvh bg-groov-bg text-groov-accent">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px]">
        <aside className="hidden lg:flex w-[260px] shrink-0 border-r border-groov-accent/10 px-6 py-8">
          <div className="text-[24px] font-semibold tracking-[-0.03em] text-groov-accent">
            GROOV
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div
            className={`mx-auto w-full ${
              withDefaultPadding ? 'px-4' : 'px-0'
            } pb-24 ${
              withTopGap ? 'pt-2' : 'pt-0'
            } md:max-w-[720px] md:px-6 lg:max-w-[1100px] lg:px-8 lg:pb-10 ${contentClassName}`}
            style={{ maxWidth: `${mobileMaxWidth}px` }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}