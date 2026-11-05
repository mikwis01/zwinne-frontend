import { createFileRoute } from '@tanstack/react-router'
import { GuestLayout } from '@/components/GuestLayout'
import { requireGuest } from '@/utils/auth/guards'

export const Route = createFileRoute('/_guest')({
  beforeLoad: requireGuest,
  component: GuestLayout
})
