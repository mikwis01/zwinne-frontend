import { decodeJwtPayload, isJwtExpired } from '@/utils/auth/jwt'
import type { Tokens } from '@/types/auth'
import type { MockUser } from './db'

type TokenType = 'access' | 'refresh'

const TTL_MINUTES: Record<TokenType, number> = { access: 15, refresh: 480 }

const encodeBase64Url = (value: object) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const createToken = (claims: object, type: TokenType) => {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    ...claims,
    type,
    iat: now,
    exp: now + TTL_MINUTES[type] * 60
  }

  return [
    encodeBase64Url({ alg: 'none', typ: 'JWT' }),
    encodeBase64Url(payload),
    'mock-signature'
  ].join('.')
}

export const createMockTokens = (user: MockUser): Tokens => ({
  accessToken: createToken(
    {
      sub: user.email,
      roles: user.roles,
      imie: user.imie,
      nazwisko: user.nazwisko
    },
    'access'
  ),
  refreshToken: createToken({ sub: user.email }, 'refresh')
})

export const verifyMockToken = (token: string, type: TokenType) => {
  const payload = decodeJwtPayload(token)
  return payload && payload.type === type && !isJwtExpired(payload)
    ? payload
    : null
}
