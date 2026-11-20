import { useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { createProject } from '@/api/projects'
import {
  projectSchema,
  type ProjectFormValues
} from '@/components/ProjectFormDialog/project-schema'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/format-date'
import { getErrorMessage } from '@/utils/get-error-message'
import { toast } from '@/utils/toast'

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const NewProjectPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [attachments, setAttachments] = useState<File[]>([])
  const [createdDate] = useState(() =>
    formatDate(new Date().toISOString().slice(0, 10))
  )

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      nazwa: '',
      opis: '',
      dataOddania: ''
    }
  })

  const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setAttachments(prev => [...prev, ...files])
    e.target.value = ''
  }

  const removeAttachment = (indexToRemove: number) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ProjectFormValues) =>
      createProject({
        nazwa: values.nazwa,
        opis: values.opis?.trim() || null,
        dataOddania: values.dataOddania || null
      }),
    onSuccess: async () => {
      toast.success('Nowy projekt został utworzony')
      await queryClient.invalidateQueries({ queryKey: ['projekty'] })
      void navigate({ to: '/projects' })
    },
    onError: error => {
      toast.error(
        getErrorMessage(error, 'Wystąpił błąd podczas tworzenia projektu')
      )
    }
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100">
        <div className="flex items-center justify-between border-b border-base-300 bg-base-200/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/projects"
              aria-label="Powrót do listy projektów"
              className="btn btn-circle btn-ghost btn-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-lg font-bold tracking-tight">Nowy projekt</h1>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(data => mutate(data))}
          className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8"
        >
          <div className="flex max-w-3xl flex-col gap-5">
            {/* 1. Data utworzenia & 2. Data oddania */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Data utworzenia
                  </span>
                </label>
                <input
                  type="text"
                  readOnly
                  value={createdDate}
                  className="input-bordered input w-full bg-base-200/60 text-base-content/70"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Data oddania</span>
                </label>
                <input
                  type="date"
                  {...register('dataOddania')}
                  className={cn(
                    'input-bordered input w-full',
                    errors.dataOddania && 'input-error'
                  )}
                />
                {errors.dataOddania && (
                  <p className="mt-1 text-sm text-error">
                    {errors.dataOddania.message}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Nazwa projektu */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Nazwa projektu *</span>
              </label>
              <input
                type="text"
                placeholder="Wpisz nazwę projektu"
                {...register('nazwa')}
                className={cn(
                  'input-bordered input w-full',
                  errors.nazwa && 'input-error'
                )}
              />
              {errors.nazwa && (
                <p className="mt-1 text-sm text-error">
                  {errors.nazwa.message}
                </p>
              )}
            </div>

            {/* 4. Opis projektu */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Opis projektu</span>
              </label>
              <textarea
                rows={6}
                placeholder="Opcjonalny opis projektu"
                {...register('opis')}
                className={cn(
                  'textarea-bordered textarea w-full',
                  errors.opis && 'textarea-error'
                )}
              />
              {errors.opis && (
                <p className="mt-1 text-sm text-error">{errors.opis.message}</p>
              )}
            </div>

            {/* 5. Załączniki */}
            <div>
              <label className="label">
                <span className="label-text font-medium">Załączniki</span>
              </label>
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-base-300 bg-base-200/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm text-base-content/60">
                    Dodaj pliki powiązane z projektem (PDF, obrazy, dokumenty)
                  </span>
                  <label className="btn cursor-pointer gap-1.5 btn-outline btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    Dodaj załącznik
                    <input
                      type="file"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {attachments.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {attachments.map((file, index) => (
                      <li
                        key={`${file.name}-${file.size}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-sm"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate font-medium">
                            {file.name}
                          </span>
                          <span className="shrink-0 text-xs text-base-content/50">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          aria-label={`Usuń załącznik ${file.name}`}
                          className="btn btn-circle btn-ghost text-error btn-xs"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 6. Lista zadań (wkrótce) */}
            <div className="rounded-xl border border-base-300 bg-base-200/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Lista zadań</span>
                <span className="badge badge-ghost badge-sm text-base-content/60">
                  wkrótce
                </span>
              </div>
              <p className="mt-1.5 text-sm text-base-content/50">
                Możliwość dodawania i przypisywania zadań do projektu pojawi się
                wkrótce.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-base-300 pt-6">
            <Link to="/projects" className="btn btn-outline px-6">
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="btn min-w-36 px-6 btn-primary"
            >
              {isPending ? (
                <span className="loading loading-sm loading-spinner" />
              ) : (
                'Utwórz projekt'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/projects/new/')({
  component: NewProjectPage
})
