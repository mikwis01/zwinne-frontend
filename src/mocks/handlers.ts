import { delay, http, HttpResponse } from 'msw'
import type { Credentials, StudentRegistration } from '@/api/auth'
import type { Project } from '@/api/projects'
import type { PagedModel } from '@/types/api'
import { config } from '@/consts/config'
import { parseRoles } from '@/utils/auth/roles'
import type { Tokens } from '@/types/auth'
import { addUser, findUserByEmail, findUserByNrIndeksu, projects } from './db'
import { createMockTokens, verifyMockToken } from './jwt'

const api = (path: string) => `${config.apiUrl}${path}`

const errorResponse = (status: number, message: string) =>
  HttpResponse.json({ status, message }, { status })

const getAccessPayload = (request: Request) => {
  const header = request.headers.get('Authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  return token ? verifyMockToken(token, 'access') : null
}

export const handlers = [
  http.post(api('/register'), async ({ request }) => {
    await delay()
    const student = (await request.json()) as StudentRegistration

    if (findUserByEmail(student.email)) {
      return errorResponse(409, 'Konto z tym adresem e-mail już istnieje')
    }
    if (findUserByNrIndeksu(student.nrIndeksu)) {
      return errorResponse(409, 'Konto z tym numerem indeksu już istnieje')
    }

    addUser({ ...student, roles: ['STUDENT'] })
    return new HttpResponse(null, { status: 200 })
  }),

  http.post(api('/login'), async ({ request }) => {
    await delay()
    const { email, password } = (await request.json()) as Credentials
    const user = findUserByEmail(email)

    if (!user?.password || user.password !== password) {
      return errorResponse(401, 'Nieprawidłowy e-mail lub hasło')
    }

    return HttpResponse.json<Tokens>(createMockTokens(user))
  }),

  http.post(api('/refresh'), async ({ request }) => {
    const { refreshToken } = (await request.json()) as Partial<Tokens>
    const email = refreshToken
      ? verifyMockToken(refreshToken, 'refresh')?.sub
      : undefined
    const user = email ? findUserByEmail(email) : undefined

    if (!user) {
      return errorResponse(401, 'Token odświeżania stracił ważność')
    }

    return HttpResponse.json<Tokens>(createMockTokens(user))
  }),

  http.get(api('/projekty'), async ({ request }) => {
    await delay()

    if (!getAccessPayload(request)) {
      return errorResponse(401, 'Brak autoryzacji')
    }

    const params = new URL(request.url).searchParams
    const page = Number(params.get('page') ?? 0)
    const size = Number(params.get('size') ?? 20)
    const nazwa = params.get('nazwa')?.toLowerCase() ?? ''

    const matching = projects
      .filter(project => project.nazwa.toLowerCase().includes(nazwa))
      .toSorted((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'))

    return HttpResponse.json<PagedModel<Project>>({
      content: matching.slice(page * size, (page + 1) * size),
      page: {
        size,
        number: page,
        totalElements: matching.length,
        totalPages: Math.ceil(matching.length / size)
      }
    })
  }),

  http.delete(api('/projekty/:projektId'), async ({ request, params }) => {
    await delay()
    const payload = getAccessPayload(request)

    if (!payload) {
      return errorResponse(401, 'Brak autoryzacji')
    }
    if (!parseRoles(payload.roles).includes('PROWADZACY')) {
      return errorResponse(403, 'Tylko prowadzący może usuwać projekty')
    }

    const index = projects.findIndex(
      project => project.projektId === Number(params.projektId)
    )

    if (index === -1) {
      return errorResponse(404, 'Projekt nie istnieje')
    }

    projects.splice(index, 1)
    return new HttpResponse(null, { status: 200 })
  })
]
