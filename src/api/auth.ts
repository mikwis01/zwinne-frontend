import { apiClient } from '@/api/service/api'
import type { Tokens } from '@/types/auth'

export type Credentials = {
  email: string
  password: string
}

export type StudentRegistration = {
  imie: string
  nazwisko: string
  nrIndeksu: string
  email: string
  stacjonarny: boolean
  password: string
}

export const login = (credentials: Credentials) =>
  apiClient.post<Tokens>('/login', credentials).then(res => res.data)

export const registerStudent = (student: StudentRegistration) =>
  apiClient.post<void>('/register', student).then(() => undefined)
