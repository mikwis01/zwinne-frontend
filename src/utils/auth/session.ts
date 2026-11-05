import { queryClient } from '@/api/service/query-client'
import type { Session, Tokens } from '@/types/auth'
import { decodeJwtPayload, isJwtExpired } from './jwt'
import { parseRoles } from './roles'

const STORAGE_KEY = 'auth.tokens'
const listeners = new Set<() => void>()

const optionalString = (value: unknown) =>
  typeof value === 'string' && value ? value : null

const readTokens = (): Tokens | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<Tokens>
    return typeof parsed.accessToken === 'string' &&
      typeof parsed.refreshToken === 'string'
      ? { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken }
      : null
  } catch {
    return null
  }
}

const writeTokens = (tokens: Tokens | null) => {
  try {
    if (tokens) localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

const toSession = (tokens: Tokens | null): Session | null => {
  if (!tokens) return null

  const access = decodeJwtPayload(tokens.accessToken)
  const refresh = decodeJwtPayload(tokens.refreshToken)

  if (!access?.sub || !refresh || isJwtExpired(refresh)) return null

  return {
    tokens,
    user: {
      email: access.sub,
      firstName: optionalString(access.imie),
      lastName: optionalString(access.nazwisko),
      roles: parseRoles(access.roles)
    }
  }
}

let current = toSession(readTokens())

const update = (session: Session | null) => {
  current = session
  writeTokens(session?.tokens ?? null)
  listeners.forEach(listener => listener())
}

export const getSession = () => current

export const subscribeToSession = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const setSession = (tokens: Tokens) => {
  const session = toSession(tokens)

  if (!session) {
    throw new Error('Serwer zwrócił niepoprawne tokeny')
  }

  update(session)
}

export const logout = () => {
  update(null)
  queryClient.clear()
}

window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY) return

  current = toSession(readTokens())
  listeners.forEach(listener => listener())
})
