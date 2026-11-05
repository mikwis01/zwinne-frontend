import { addUser, findUserByEmail } from './db'
import { createMockTokens } from './jwt'

const GOOGLE_EMAIL = 'jan.google@example.com'

export const getMockGoogleCallbackUrl = () => {
  const user =
    findUserByEmail(GOOGLE_EMAIL) ??
    addUser({
      imie: 'Jan',
      nazwisko: 'Googlowski',
      nrIndeksu: null,
      email: GOOGLE_EMAIL,
      stacjonarny: true,
      password: null,
      roles: ['STUDENT']
    })

  const params = new URLSearchParams({ ...createMockTokens(user) })
  return `/auth/callback#${params.toString()}`
}
