import type { Project } from '@/api/projects'
import { cn } from '@/utils/cn'
import { formatDate, parseLocalDate } from '@/utils/format-date'

type ProjectInfoZoneProps = {
  project: Project | null
}

const DAY_MS = 24 * 60 * 60 * 1000

const getRemainingTimeInfo = (dataOddania: string | null) => {
  if (!dataOddania) {
    return {
      label: 'Brak ustalonego terminu',
      sublabel: 'Termin nie został przypisany',
      variant: 'neutral' as const
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = parseLocalDate(dataOddania)
  due.setHours(0, 0, 0, 0)

  const diffDays = Math.round((due.getTime() - today.getTime()) / DAY_MS)

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays)
    const dayWord = overdueDays === 1 ? 'dzień' : 'dni'
    return {
      label: `Po terminie (${overdueDays} ${dayWord})`,
      sublabel: `Termin minął ${formatDate(dataOddania)}`,
      variant: 'error' as const
    }
  }

  if (diffDays === 0) {
    return {
      label: 'Dzisiaj',
      sublabel: `Termin oddania: ${formatDate(dataOddania)}`,
      variant: 'warning' as const
    }
  }

  const dayWord = diffDays === 1 ? 'dzień' : 'dni'
  return {
    label: `Pozostało ${diffDays} ${dayWord}`,
    sublabel: `Termin oddania: ${formatDate(dataOddania)}`,
    variant: diffDays <= 7 ? ('warning' as const) : ('success' as const)
  }
}

export const ProjectInfoZone = ({ project }: ProjectInfoZoneProps) => {
  if (!project) {
    return (
      <aside className="flex w-full shrink-0 flex-col rounded-2xl border border-base-300 bg-base-100 lg:w-80 xl:w-96">
        <div className="border-b border-base-300 bg-base-200/70 px-5 py-4">
          <h2 className="text-sm font-bold tracking-wider text-base-content/70 uppercase">
            Info Zone
          </h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-base-content/60">
          <p className="text-base">
            Kliknij na projekt w tabeli, aby zobaczyć jego podsumowanie.
          </p>
        </div>
      </aside>
    )
  }

  const remainingTime = getRemainingTimeInfo(project.dataOddania)

  return (
    <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 lg:w-80 xl:w-96">
      <div className="flex items-center justify-between border-b border-base-300 bg-base-200/70 px-5 py-4">
        <h2 className="text-sm font-bold tracking-wider text-base-content/70 uppercase">
          Info Zone
        </h2>
        <span className="badge badge-ghost font-mono badge-sm">
          #{project.projektId}
        </span>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <div>
          <h3 className="text-lg leading-snug font-bold tracking-tight">
            {project.nazwa}
          </h3>
          {project.opis && (
            <p className="mt-1.5 text-sm leading-relaxed text-base-content/70">
              {project.opis}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-base-300 bg-base-200/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wide text-base-content/60 uppercase">
                Ilość zadań
              </span>
              <span className="badge badge-ghost badge-sm text-base-content/60">
                wkrótce
              </span>
            </div>
            <p className="mt-1.5 text-sm text-base-content/50">
              Liczba zadań będzie liczona automatycznie z listy zadań.
            </p>
          </div>

          <div
            className={cn(
              'rounded-xl border p-4',
              remainingTime.variant === 'error' &&
                'border-error/30 bg-error/10 text-error',
              remainingTime.variant === 'warning' &&
                'border-warning/30 bg-warning/10 text-warning-content',
              remainingTime.variant === 'success' &&
                'border-success/30 bg-success/10 text-success',
              remainingTime.variant === 'neutral' &&
                'border-base-300 bg-base-200/50 text-base-content'
            )}
          >
            <span className="text-xs font-medium tracking-wide uppercase opacity-75">
              Czas do oddania
            </span>
            <p className="mt-1.5 text-lg font-bold">{remainingTime.label}</p>
            <p className="mt-0.5 text-xs opacity-80">
              {remainingTime.sublabel}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
