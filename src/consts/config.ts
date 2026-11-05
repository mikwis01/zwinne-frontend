const env = import.meta.env

export const config = {
  appName: 'Menedżer projektów',
  apiUrl: env.VITE_API_URL,
  googleAuthUrl: env.VITE_GOOGLE_AUTH_URL,
  apiMocking: env.VITE_API_MOCKING === 'true'
} as const
