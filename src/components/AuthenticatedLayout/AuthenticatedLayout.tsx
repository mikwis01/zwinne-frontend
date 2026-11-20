import { Navigate, Outlet } from '@tanstack/react-router'
import { useSession } from '@/hooks/use-session'
import { AppNavbar } from '@/components/AppNavbar'
import { Sidebar } from '@/components/Sidebar'

export const AuthenticatedLayout = () => {
  const session = useSession()

  if (!session) return <Navigate to="/login" />

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base-100">
      <AppNavbar user={session.user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={session.user} />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <main className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
