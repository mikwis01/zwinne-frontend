import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  Link,
  Outlet
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

type RouterContext = {
  queryClient: QueryClient
}

const RootLayout = () => (
  <div className="flex min-h-screen flex-col">
    <main className="flex flex-1 flex-col">
      <Outlet />
    </main>
    <ReactQueryDevtools buttonPosition="bottom-left" />
    <TanStackRouterDevtools position="bottom-right" />
  </div>
)

const NotFound = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-2">
    <h1 className="text-2xl font-semibold">404</h1>
    <Link to="/" className="text-blue-600 underline">
      Back to home
    </Link>
  </div>
)

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound
})
