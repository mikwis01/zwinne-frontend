import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { projectsQueryOptions } from '@/api/projects'
import { PageHeading } from '@/components/PageHeading'
import { useSession } from '@/hooks/use-session'

const DashboardPage = () => {
  const session = useSession()
  const { data: projectsData } = useSuspenseQuery(
    projectsQueryOptions({ page: 0, size: 5, name: '' })
  )

  const totalProjects = projectsData.page.totalElements

  return (
    <>
      <PageHeading title="Strona główna">
        Witaj, {session?.user.firstName || session?.user.email}!
      </PageHeading>

      <div className="flex flex-col gap-8">
        {/* Kafelek z liczbą projektów */}
        <div className="max-w-md">
          <div className="card border border-base-300 bg-base-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">
                  Liczba aktualnych projektów
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight">
                  {totalProjects}
                </p>
              </div>
              <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/projects" className="btn btn-primary btn-sm">
                Przejdź do projektów →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/dashboard/')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(
      projectsQueryOptions({ page: 0, size: 5, name: '' })
    ),
  component: DashboardPage
})
