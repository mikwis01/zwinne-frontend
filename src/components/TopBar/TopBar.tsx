import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { AppLogo } from '@/components/AppLogo'

type TopBarProps = {
  actions?: ReactNode
}

export const TopBar = ({ actions }: TopBarProps) => (
  <div className="pt-3 sm:pt-5">
    <header className="mx-3 flex h-16 items-center gap-6 rounded-2xl bg-base-200 pr-2 pl-4 sm:mx-6 sm:h-[4.5rem] sm:pr-3 sm:pl-6 min-[72rem]:mx-auto min-[72rem]:max-w-[69rem]">
      <Link
        to="/"
        aria-label="Strona główna"
        className="shrink-0 rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <AppLogo />
      </Link>
      <div className="ml-auto flex items-center gap-2">{actions}</div>
    </header>
  </div>
)
