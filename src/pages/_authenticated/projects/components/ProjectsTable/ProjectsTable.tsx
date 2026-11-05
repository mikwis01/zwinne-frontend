import type { Project } from '@/api/projects'
import { ProjectActions } from '../ProjectActions'
import { formatDate, formatTime, isPastDate } from '@/utils/format-date'

const DateTime = ({ value }: { value: string | null }) =>
  value ? (
    <>
      <span className="block">{formatDate(value.slice(0, 10))}</span>
      <span className="block text-sm text-base-content/50">
        {formatTime(value)}
      </span>
    </>
  ) : (
    '—'
  )

type ProjectsTableProps = {
  projects: Project[]
  onDelete: (project: Project) => void
}

export const ProjectsTable = ({ projects, onDelete }: ProjectsTableProps) => (
  <div className="rounded-box bg-base-200 px-2 py-3 sm:px-4">
    <table className="table text-base">
      <thead>
        <tr className="border-base-300 text-sm text-base-content/60">
          <th className="hidden font-medium sm:table-cell">Id</th>
          <th className="font-medium">Nazwa</th>
          <th className="hidden font-medium md:table-cell">Opis</th>
          <th className="hidden font-medium xl:table-cell">Utworzony</th>
          <th className="hidden font-medium lg:table-cell">Zmodyfikowany</th>
          <th className="font-medium">Data oddania</th>
          <th className="text-right font-medium">Akcje</th>
        </tr>
      </thead>
      <tbody>
        {projects.map(project => (
          <tr
            key={project.projektId}
            className="border-base-300 last:border-0 hover:bg-base-100/70"
          >
            <td className="hidden py-4 text-base-content/60 tabular-nums sm:table-cell">
              {project.projektId}
            </td>
            <td className="py-4 font-medium sm:min-w-44">{project.nazwa}</td>
            <td className="hidden w-full max-w-0 truncate py-4 text-base-content/70 md:table-cell">
              {project.opis ?? '—'}
            </td>
            <td className="hidden py-4 whitespace-nowrap text-base-content/70 xl:table-cell">
              <DateTime value={project.dataczasUtworzenia} />
            </td>
            <td className="hidden py-4 whitespace-nowrap text-base-content/70 lg:table-cell">
              <DateTime value={project.dataczasModyfikacji} />
            </td>
            <td className="py-4 whitespace-nowrap">
              {formatDate(project.dataOddania)}
              {project.dataOddania && isPastDate(project.dataOddania) && (
                <span className="mt-1 block w-fit rounded-full bg-error/10 px-2.5 py-0.5 text-sm text-error">
                  po terminie
                </span>
              )}
            </td>
            <td className="py-2 text-right">
              <ProjectActions project={project} onDelete={onDelete} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
