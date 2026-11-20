import { Link } from '@tanstack/react-router'
import type { SessionUser } from '@/types/auth'

type SidebarProps = {
  user: SessionUser
}

export const Sidebar = ({ user }: SidebarProps) => {
  const isProwadzacy = user.roles.includes('PROWADZACY')

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-base-300 bg-base-100">
      {/* Nawigacja */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="menu gap-1 p-0 text-base">
          <li>
            <Link
              to="/dashboard"
              activeProps={{ className: 'active font-semibold' }}
              className="flex items-center gap-3 rounded-lg px-4 py-3"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Strona główna
            </Link>
          </li>
          <li>
            <Link
              to="/projects"
              activeProps={{ className: 'active font-semibold' }}
              className="flex items-center gap-3 rounded-lg px-4 py-3"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Projekty
            </Link>
          </li>

          {isProwadzacy && (
            <li>
              <Link
                to="/users"
                activeProps={{ className: 'active font-semibold' }}
                className="flex items-center gap-3 rounded-lg px-4 py-3"
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Użytkownicy i uprawnienia
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  )
}
