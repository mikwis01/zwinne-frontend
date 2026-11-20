import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { AppLogo } from '@/components/AppLogo'

type TopBarProps = {
  actions?: ReactNode
}

export const TopBar = ({ actions }: TopBarProps) => (
  <header className="flex h-16 shrink-0 items-center justify-between border-b border-primary/15 bg-secondary px-6">
    <Link
      to="/dashboard"
      aria-label="Strona główna"
      className="shrink-0 rounded-lg outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
    >
      <AppLogo />
    </Link>
    <div className="flex items-center gap-3">{actions}</div>
  </header>
)
