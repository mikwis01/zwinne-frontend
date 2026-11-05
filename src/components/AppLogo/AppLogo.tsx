import { config } from '@/consts/config'

export const AppLogo = () => (
  <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6 text-primary"
    >
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </svg>
    {config.appName}
  </span>
)
