import { useCallback, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { projectsQueryOptions, type Project } from '@/api/projects'
import { Pagination } from '@/components/Pagination'
import { DeleteProjectDialog } from './components/DeleteProjectDialog'
import { ProjectInfoZone } from './components/ProjectInfoZone'
import { ProjectsSearch } from './components/ProjectsSearch'
import { ProjectsTable } from './components/ProjectsTable'
import {
  DEFAULT_SEARCH,
  PAGE_SIZE,
  projectsSearchSchema
} from './consts/projects-search'
import { formatProjectCount } from './utils/format-project-count'

const ProjectsPage = () => {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  )
  const { data } = useSuspenseQuery(
    projectsQueryOptions({ ...search, size: PAGE_SIZE })
  )

  const selectedProject =
    data.content.find(p => p.projektId === selectedProjectId) ??
    data.content[0] ??
    null

  const handleSearch = useCallback(
    (name: string) =>
      void navigate({ search: { name, page: 0 }, replace: true }),
    [navigate]
  )

  const handleDeleted = () => {
    if (data.content.length === 1 && search.page > 0) {
      void navigate({ search: prev => ({ ...prev, page: prev.page - 1 }) })
    }
  }

  const handleOpenProject = (project: Project) => {
    void navigate({
      to: '/projects/$projectId',
      params: { projectId: String(project.projektId) }
    })
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100">
          <div className="flex flex-col gap-3 border-b border-base-300 bg-base-200/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-baseline gap-3">
              <h1 className="text-lg font-bold tracking-tight">Projekty</h1>
              <span className="text-sm text-base-content/60">
                ({formatProjectCount(data.page.totalElements)})
              </span>
            </div>
            <ProjectsSearch value={search.name} onSearch={handleSearch} />
          </div>

          {data.content.length > 0 ? (
            <ProjectsTable
              projects={data.content}
              selectedProjectId={selectedProject?.projektId}
              onSelect={project => setSelectedProjectId(project.projektId)}
              onOpen={handleOpenProject}
              onDelete={setProjectToDelete}
            />
          ) : (
            <div className="flex flex-col items-start gap-4 p-8 sm:p-10">
              <p className="text-xl font-medium tracking-tight">
                {search.name
                  ? `Żaden projekt nie pasuje do „${search.name}”`
                  : 'Nie ma jeszcze żadnych projektów'}
              </p>
              {search.name && (
                <button
                  type="button"
                  className="btn px-6 btn-primary"
                  onClick={() => navigate({ search: DEFAULT_SEARCH })}
                >
                  Pokaż wszystkie projekty
                </button>
              )}
            </div>
          )}

          {data.page.totalPages > 1 && (
            <div className="border-t border-base-300 px-5 py-3">
              <Pagination
                page={data.page.number}
                totalPages={data.page.totalPages}
                onPageChange={page =>
                  navigate({ search: prev => ({ ...prev, page }) })
                }
              />
            </div>
          )}
        </div>

        <ProjectInfoZone project={selectedProject} />
      </div>

      <DeleteProjectDialog
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onDeleted={handleDeleted}
      />
    </>
  )
}

export const Route = createFileRoute('/_authenticated/projects/')({
  validateSearch: projectsSearchSchema,
  search: { middlewares: [stripSearchParams(DEFAULT_SEARCH)] },
  loaderDeps: ({ search: { page, name } }) => ({ page, name }),
  loader: ({ context, deps }) =>
    context.queryClient.ensureQueryData(
      projectsQueryOptions({ ...deps, size: PAGE_SIZE })
    ),
  component: ProjectsPage
})
