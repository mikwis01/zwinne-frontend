import { createRouter } from '@tanstack/react-router'
import { queryClient } from '@/api/service/query-client'
import { ErrorFallback } from '@/components/ErrorFallback'
import { PageLoader } from '@/components/PageLoader'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  // Freshness is handled by React Query, so the router always calls loaders
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultErrorComponent: ErrorFallback,
  defaultPendingComponent: PageLoader
})

declare module '@tanstack/react-router' {
  // oxlint-disable-next-line typescript/consistent-type-definitions -- declaration merging
  interface Register {
    router: typeof router
  }
}
