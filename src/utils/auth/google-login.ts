import { config } from '@/consts/config'

export const startGoogleLogin = async () => {
  if (config.apiMocking) {
    const { getMockGoogleCallbackUrl } = await import('@/mocks/google')
    window.location.assign(getMockGoogleCallbackUrl())
    return
  }

  window.location.assign(config.googleAuthUrl)
}
