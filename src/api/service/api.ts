import axios, { type InternalAxiosRequestConfig } from 'axios'
import { config } from '@/consts/config'
import type { Tokens } from '@/types/auth'
import { getSession, logout, setSession } from '@/utils/auth/session'
import { toast } from '@/utils/toast'

export const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' }
})

const PUBLIC_ENDPOINTS = ['/login', '/register', '/refresh']

const isPublicEndpoint = (url = '') =>
  PUBLIC_ENDPOINTS.some(endpoint => url.endsWith(endpoint))

apiClient.interceptors.request.use(request => {
  const session = getSession()

  if (session && !isPublicEndpoint(request.url)) {
    request.headers.Authorization = `Bearer ${session.tokens.accessToken}`
  }

  return request
})

const refreshTokens = (refreshToken: string) =>
  axios
    .post<Tokens>('/refresh', { refreshToken }, { baseURL: config.apiUrl })
    .then(res => res.data)

const retriedRequests = new WeakSet<InternalAxiosRequestConfig>()
let pendingRefresh: Promise<Tokens> | null = null

apiClient.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || error.response?.status !== 401) {
    throw error
  }

  const request = error.config
  const session = getSession()

  if (
    !request ||
    !session ||
    isPublicEndpoint(request.url) ||
    retriedRequests.has(request)
  ) {
    throw error
  }

  retriedRequests.add(request)

  try {
    pendingRefresh ??= refreshTokens(session.tokens.refreshToken).finally(
      () => {
        pendingRefresh = null
      }
    )
    setSession(await pendingRefresh)
  } catch {
    if (getSession()) {
      logout()
      toast.warning('Sesja wygasła. Zaloguj się ponownie.')
    }
    throw error
  }

  return apiClient(request)
})
