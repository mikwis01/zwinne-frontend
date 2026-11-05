import { Link, Outlet } from '@tanstack/react-router'
import { AppLogo } from '@/components/AppLogo'

export const GuestLayout = () => (
  <>
    <header className="px-3 pt-3 sm:px-6 sm:pt-5">
      <Link
        to="/"
        aria-label="Strona główna"
        className="inline-flex rounded-2xl bg-base-200 px-4 py-3 outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <AppLogo />
      </Link>
    </header>
    <main className="mx-auto w-full max-w-6xl flex-1 px-3 pb-16 sm:px-6">
      <Outlet />
    </main>
  </>
)
