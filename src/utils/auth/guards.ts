import { redirect, type ParsedLocation } from '@tanstack/react-router'
import { toast } from '@/utils/toast'
import type { Role } from '@/types/auth'
import { hasRole } from './roles'
import { getSession } from './session'

export const requireAuth = (location: ParsedLocation) => {
  if (!getSession()) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}

export const requireGuest = () => {
  if (getSession()) {
    throw redirect({ to: '/projects' })
  }
}

export const requireRole = (...roles: Role[]) => {
  const session = getSession()

  if (!session || !hasRole(session.user.roles, ...roles)) {
    toast.error('Nie masz uprawnień do tej strony')
    throw redirect({ to: '/projects' })
  }
}
