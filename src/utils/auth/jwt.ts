export type JwtPayload = {
  sub?: string
  exp?: number
  iat?: number
  [claim: string]: unknown
}

const decodeBase64Url = (input: string) => {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const bytes = Uint8Array.from(atob(padded), char => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  const [, payload] = token.split('.')
  if (!payload) return null

  try {
    const parsed: unknown = JSON.parse(decodeBase64Url(payload))
    return typeof parsed === 'object' && parsed !== null
      ? (parsed as JwtPayload)
      : null
  } catch {
    return null
  }
}

export const isJwtExpired = (payload: JwtPayload, now = Date.now()) =>
  payload.exp != null && payload.exp * 1000 <= now
