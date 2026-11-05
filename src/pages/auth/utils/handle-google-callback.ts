import { redirect } from '@tanstack/react-router'
import { setSession } from '@/utils/auth/session'
import { toast } from '@/utils/toast'

const storeTokensFromHash = (hash: string) => {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const accessToken = params.get('accessToken')
  const refreshToken = params.get('refreshToken')

  if (!accessToken || !refreshToken) {
    return params.get('error') ?? 'Logowanie przez Google nie powiodło się'
  }

  try {
    setSession({ accessToken, refreshToken })
    return null
  } catch (error) {
    return error instanceof Error ? error.message : 'Niepoprawne tokeny'
  }
}

export const handleGoogleCallback = () => {
  const error = storeTokensFromHash(window.location.hash)

  if (error) {
    toast.error(error)
    throw redirect({ to: '/login', replace: true })
  }

  toast.success('Zalogowano przez Google')
  throw redirect({ to: '/projects', replace: true })
}
