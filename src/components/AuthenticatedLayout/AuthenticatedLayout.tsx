import { Navigate, Outlet } from '@tanstack/react-router'
import { useSession } from '@/hooks/use-session'
import { AppNavbar } from '@/components/AppNavbar'

export const AuthenticatedLayout = () => {
  const session = useSession()

  if (!session) return <Navigate to="/login" />

  return (
    <>
      <AppNavbar user={session.user} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-3 pb-16 sm:px-6">
        <Outlet />
      </main>
    </>
  )
}
