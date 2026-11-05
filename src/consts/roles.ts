import type { Role } from '@/types/auth'

export const ROLES = ['STUDENT', 'PROWADZACY'] as const

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: 'Student',
  PROWADZACY: 'Prowadzący'
}
