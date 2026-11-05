import { useCallback, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { projectsQueryOptions, type Project } from '@/api/projects'
import { PageHeading } from '@/components/PageHeading'
import { Pagination } from '@/components/Pagination'
import { DeleteProjectDialog } from './components/DeleteProjectDialog'
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
  const { data } = useSuspenseQuery(
    projectsQueryOptions({ ...search, size: PAGE_SIZE })
  )

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

  return (
    <>
      <PageHeading title="Projekty" />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg text-base-content/70">
            {formatProjectCount(data.page.totalElements)}
          </p>
          <ProjectsSearch value={search.name} onSearch={handleSearch} />
        </div>

        {data.content.length > 0 ? (
          <ProjectsTable
            projects={data.content}
            onDelete={setProjectToDelete}
          />
        ) : (
          <div className="flex flex-col items-start gap-4 rounded-box bg-base-200 p-8 sm:p-10">
            <p className="text-2xl font-medium tracking-tight">
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

        <Pagination
          page={data.page.number}
          totalPages={data.page.totalPages}
          onPageChange={page =>
            navigate({ search: prev => ({ ...prev, page }) })
          }
        />
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
