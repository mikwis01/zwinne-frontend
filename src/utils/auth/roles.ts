import { ROLES } from '@/consts/roles'
import type { Role } from '@/types/auth'

const isRole = (value: string): value is Role =>
  (ROLES as readonly string[]).includes(value)

export const parseRoles = (claim: unknown): Role[] => {
  const values = typeof claim === 'string' ? claim.split(',') : claim

  if (!Array.isArray(values)) return []

  return values
    .filter((value): value is string => typeof value === 'string')
    .map(value => value.trim().replace(/^ROLE_/, ''))
    .filter(isRole)
}

export const hasRole = (userRoles: Role[], ...allowed: Role[]) =>
  userRoles.some(role => allowed.includes(role))
