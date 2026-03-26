type Props = {
  children: React.ReactNode
  mobileMaxWidth?: number
  contentClassName?: string
  withDefaultPadding?: boolean
  withSafeAreaTop?: boolean
  withSafeAreaBottom?: boolean
  withBottomNavSpacing?: boolean
  pageMode?: 'scroll' | 'screen'
  mobileTopOffset?: number
}

export function AppShell({
  children,
  mobileMaxWidth = 402,
  contentClassName = '',
  withDefaultPadding = true,
  withSafeAreaTop = true,
  withSafeAreaBottom = true,
  withBottomNavSpacing = false,
  pageMode = 'scroll',
  mobileTopOffset = 50,
}: Props) {
  const topPadding = withSafeAreaTop
    ? `max(env(safe-area-inset-top), ${mobileTopOffset}px)`
    : '0px'

  const baseBottomPadding = withSafeAreaBottom
    ? 'max(env(safe-area-inset-bottom), 12px)'
    : '0px'

  const bottomNavPadding = withBottomNavSpacing ? '84px' : '0px'

  return (
<div
  className={`min-h-dvh bg-groov-bg text-groov-accent ${
    pageMode === 'screen' ? 'overflow-hidden h-dvh' : ''
  }`}
>      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px]">
        <aside className="hidden w-[260px] shrink-0 border-r border-groov-accent/10 px-6 py-8 lg:flex">
          <div className="text-[24px] font-semibold tracking-[-0.03em] text-groov-accent">
            GROOV
          </div>
        </aside>

        <main className="min-w-0 flex-1">
         <div
  className={`mx-auto w-full ${
    pageMode === 'screen' ? 'min-h-dvh overflow-hidden' : ''
  } ${
    withDefaultPadding ? 'px-4' : 'px-0'
  } md:max-w-[720px] md:px-6 lg:max-w-[1100px] lg:px-8 ${contentClassName}`}
            style={{
              maxWidth: `${mobileMaxWidth}px`,
              paddingTop: topPadding,
              paddingBottom: `calc(${baseBottomPadding} + ${bottomNavPadding})`,
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}