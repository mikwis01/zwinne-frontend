import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { queryClient } from '@/lib/query-client'
import { router } from '@/router'
import { throttledReload } from '@/utils/throttled-reload'

import './index.css'

// A lazy chunk failed to load, usually because a new deploy removed it.
// Reloading fetches the fresh index.html; if the reload is throttled,
// the error propagates to the route's error boundary instead.
window.addEventListener('vite:preloadError', event => {
  if (throttledReload()) event.preventDefault()
})

const container = document.getElementById('root')

if (!container) {
  throw new Error('Root element not found')
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
