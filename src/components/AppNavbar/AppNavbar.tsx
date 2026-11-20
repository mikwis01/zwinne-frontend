import { Link, useNavigate } from '@tanstack/react-router'
import { TopBar } from '@/components/TopBar'
import { ROLE_LABELS } from '@/consts/roles'
import type { SessionUser } from '@/types/auth'
import { logout } from '@/utils/auth/session'
import { toast } from '@/utils/toast'

type AppNavbarProps = {
  user: SessionUser
}

const getDisplayName = ({ firstName, lastName, email }: SessionUser) =>
  [firstName, lastName].filter(Boolean).join(' ') || email

const getInitials = (user: SessionUser) =>
  user.firstName && user.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email.slice(0, 2)

export const AppNavbar = ({ user }: AppNavbarProps) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info('Wylogowano')
    void navigate({ to: '/login' })
  }

  return (
    <TopBar
      actions={
        <>
          <Link to="/projects/new" className="btn gap-1.5 px-4 btn-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Nowy projekt</span>
          </Link>

          <button
            type="button"
            title="Czat"
            aria-label="Czat"
            className="btn btn-circle border border-primary/15 bg-base-100 text-primary hover:border-primary hover:bg-primary hover:text-primary-content"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/15 bg-base-100 px-3 py-1.5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-content uppercase">
                {getInitials(user)}
              </span>
              <div className="hidden min-w-0 flex-col sm:flex">
                <span className="truncate text-sm leading-tight font-semibold">
                  {getDisplayName(user)}
                </span>
                <span className="truncate text-xs leading-tight text-base-content/60">
                  {user.roles.map(r => ROLE_LABELS[r]).join(', ')}
                </span>
              </div>
            </div>
            <button
              type="button"
              title="Wyloguj się"
              aria-label="Wyloguj się"
              onClick={handleLogout}
              className="btn btn-circle btn-ghost text-error btn-sm hover:bg-error/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </>
      }
    />
  )
}
