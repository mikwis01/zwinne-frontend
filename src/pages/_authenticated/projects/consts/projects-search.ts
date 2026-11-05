import { z } from 'zod'

export const PAGE_SIZE = 10

export const DEFAULT_SEARCH = { page: 0, name: '' }

export const projectsSearchSchema = z.object({
  page: z
    .number()
    .int()
    .min(0)
    .default(DEFAULT_SEARCH.page)
    .catch(DEFAULT_SEARCH.page),
  name: z.string().default(DEFAULT_SEARCH.name).catch(DEFAULT_SEARCH.name)
})
