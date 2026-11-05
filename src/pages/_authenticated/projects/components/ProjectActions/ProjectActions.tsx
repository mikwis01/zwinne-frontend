import type { ReactNode } from 'react'
import type { Project } from '@/api/projects'
import { cn } from '@/utils/cn'

type ProjectActionsProps = {
  project: Project
  onDelete: (project: Project) => void
}

type MenuItemProps = {
  label: string
  icon: ReactNode
  danger?: boolean
  onClick?: () => void
}

const closeMenu = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-[1.125rem]"
  >
    {children}
  </svg>
)

const MenuItem = ({ label, icon, danger, onClick }: MenuItemProps) => (
  <li className={cn(!onClick && 'menu-disabled')}>
    <button
      type="button"
      role="menuitem"
      disabled={!onClick}
      className={cn('gap-3 py-2.5', danger && 'text-error hover:bg-error/10')}
      onClick={() => {
        closeMenu()
        onClick?.()
      }}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {!onClick && <span className="text-sm opacity-70">wkrótce</span>}
    </button>
  </li>
)

export const ProjectActions = ({ project, onDelete }: ProjectActionsProps) => (
  <div className="dropdown dropdown-end">
    <div
      tabIndex={0}
      role="button"
      aria-label={`Akcje projektu „${project.nazwa}”`}
      aria-haspopup="menu"
      className="btn btn-circle btn-ghost btn-sm hover:bg-base-100"
    >
      <Icon>
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="19" r="1" />
      </Icon>
    </div>
    <ul
      tabIndex={0}
      role="menu"
      className="menu dropdown-content z-10 mt-2 w-56 rounded-3xl border border-base-300 bg-base-100 p-2 text-base shadow-xl"
    >
      <MenuItem
        label="Zadania"
        icon={
          <Icon>
            <path d="M9 6h11M9 12h11M9 18h11" />
            <path d="m3 6 1 1 2-2M3 12l1 1 2-2M3 18l1 1 2-2" />
          </Icon>
        }
      />
      <MenuItem
        label="Studenci"
        icon={
          <Icon>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
          </Icon>
        }
      />
      <MenuItem
        label="Edytuj"
        icon={
          <Icon>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </Icon>
        }
      />
      <MenuItem
        label="Usuń"
        danger
        onClick={() => onDelete(project)}
        icon={
          <Icon>
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </Icon>
        }
      />
    </ul>
  </div>
)
