import type { ROLES } from '@/consts/roles'

export type Role = (typeof ROLES)[number]

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type SessionUser = {
  email: string
  firstName: string | null
  lastName: string | null
  roles: Role[]
}

export type Session = {
  user: SessionUser
  tokens: Tokens
}
