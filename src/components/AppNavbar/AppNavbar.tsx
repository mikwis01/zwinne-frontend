import { useNavigate } from '@tanstack/react-router'
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
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            aria-label="Menu użytkownika"
            className="btn h-11 gap-3 border-base-content/30 bg-base-100 pr-1.5 pl-1.5 hover:border-base-content sm:pr-5"
          >
            <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-content uppercase">
              {getInitials(user)}
            </span>
            <span className="hidden max-w-40 truncate sm:inline">
              {getDisplayName(user)}
            </span>
          </div>
          <div
            tabIndex={0}
            className="dropdown-content z-10 mt-3 flex w-72 flex-col gap-4 rounded-3xl border border-base-300 bg-base-100 p-5 text-base-content shadow-xl"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-medium tracking-tight">
                {getDisplayName(user)}
              </span>
              <span className="truncate text-sm text-base-content/70">
                {user.email}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.roles.map(role => (
                <span
                  key={role}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {ROLE_LABELS[role]}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="btn w-full btn-outline"
              onClick={handleLogout}
            >
              Wyloguj się
            </button>
          </div>
        </div>
      }
    />
  )
}
