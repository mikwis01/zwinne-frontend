import { useEffect, useId, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProject, updateProject, type Project } from '@/api/projects'
import { cn } from '@/utils/cn'
import { getErrorMessage } from '@/utils/get-error-message'
import { toast } from '@/utils/toast'
import { projectSchema, type ProjectFormValues } from './project-schema'

type ProjectFormDialogProps = {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export const ProjectFormDialog = ({
  project,
  isOpen,
  onClose,
  onSuccess
}: ProjectFormDialogProps) => {
  const isEditing = Boolean(project)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      nazwa: '',
      opis: '',
      dataOddania: ''
    }
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      if (project) {
        reset({
          nazwa: project.nazwa,
          opis: project.opis ?? '',
          dataOddania: project.dataOddania ?? ''
        })
      } else {
        reset({
          nazwa: '',
          opis: '',
          dataOddania: ''
        })
      }
    }
  }, [isOpen, project, reset])

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ProjectFormValues) => {
      const payload = {
        nazwa: values.nazwa,
        opis: values.opis?.trim() || null,
        dataOddania: values.dataOddania || null
      }
      return isEditing && project
        ? updateProject(project.projektId, payload)
        : createProject(payload)
    },
    onSuccess: async () => {
      toast.success(
        isEditing
          ? 'Projekt został zaktualizowany'
          : 'Nowy projekt został utworzony'
      )
      onClose()
      onSuccess?.()
      await queryClient.invalidateQueries({ queryKey: ['projekty'] })
    },
    onError: error => {
      toast.error(
        getErrorMessage(error, 'Wystąpił błąd podczas zapisywania projektu')
      )
    }
  })

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="modal"
      onClose={onClose}
    >
      <div className="modal-box max-w-lg p-8">
        <h2 id={titleId} className="text-2xl font-medium tracking-tight">
          {isEditing
            ? `Edycja projektu #${project?.projektId}`
            : 'Nowy projekt'}
        </h2>

        <form
          onSubmit={handleSubmit(data => mutate(data))}
          className="mt-5 flex flex-col gap-4"
        >
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
              <p className="mt-1 text-sm text-error">{errors.nazwa.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Opis projektu</span>
            </label>
            <textarea
              rows={3}
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

          <div className="modal-action mt-6 flex justify-end gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="btn btn-outline px-5"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn min-w-32 px-5 btn-primary"
            >
              {isPending ? (
                <span className="loading loading-sm loading-spinner" />
              ) : isEditing ? (
                'Zapisz zmiany'
              ) : (
                'Utwórz projekt'
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">Zamknij</button>
      </form>
    </dialog>
  )
}
