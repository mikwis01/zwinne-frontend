import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/AuthenticatedLayout'
import { requireAuth } from '@/utils/auth/guards'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: AuthenticatedLayout
})
