import { queryOptions } from '@tanstack/react-query'
import { apiClient } from '@/api/service/api'
import type { PagedModel } from '@/types/api'

export type Project = {
  projektId: number
  nazwa: string
  opis: string | null
  dataczasUtworzenia: string
  dataczasModyfikacji: string | null
  dataOddania: string | null
}

export type ProjectsParams = {
  page: number
  size: number
  name: string
}

export const projectsQueryOptions = ({ page, size, name }: ProjectsParams) =>
  queryOptions({
    queryKey: ['projekty', 'list', { page, size, name }],
    queryFn: () =>
      apiClient
        .get<PagedModel<Project>>('/projekty', {
          params: { page, size, sort: 'nazwa', nazwa: name || undefined }
        })
        .then(res => res.data)
  })

export const projectQueryOptions = (projektId: number) =>
  queryOptions({
    queryKey: ['projekty', 'detail', projektId],
    queryFn: () =>
      apiClient.get<Project>(`/projekty/${projektId}`).then(res => res.data)
  })

export const deleteProject = (projektId: number) =>
  apiClient.delete(`/projekty/${projektId}`).then(() => undefined)

export type ProjectInput = {
  nazwa: string
  opis?: string | null
  dataOddania?: string | null
}

export const createProject = (data: ProjectInput) =>
  apiClient.post<Project>('/projekty', data).then(res => res.data)

export const updateProject = (projektId: number, data: ProjectInput) =>
  apiClient.put<void>(`/projekty/${projektId}`, data).then(() => undefined)
