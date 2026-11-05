import { useEffect, useId, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProject, type Project } from '@/api/projects'
import { toast } from '@/utils/toast'
import { getErrorMessage } from '@/utils/get-error-message'

type DeleteProjectDialogProps = {
  project: Project | null
  onClose: () => void
  onDeleted: () => void
}

export const DeleteProjectDialog = ({
  project,
  onClose,
  onDeleted
}: DeleteProjectDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const queryClient = useQueryClient()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (project && !dialog.open) dialog.showModal()
    if (!project && dialog.open) dialog.close()
  }, [project])

  const { mutate, isPending } = useMutation({
    mutationFn: ({ projektId }: Project) => deleteProject(projektId),
    onSuccess: async (_, { nazwa }) => {
      toast.success(`Usunięto projekt „${nazwa}”`)
      onDeleted()
      onClose()
      await queryClient.invalidateQueries({ queryKey: ['projekty'] })
    },
    onError: error => {
      toast.error(getErrorMessage(error, 'Nie udało się usunąć projektu'))
    }
  })

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="modal"
      onClose={onClose}
    >
      <div className="modal-box max-w-md p-8">
        <h2 id={titleId} className="text-2xl font-medium tracking-tight">
          Usunąć projekt?
        </h2>
        <p className="mt-2 text-base-content/70">
          Projekt „{project?.nazwa}” zostanie usunięty razem z zadaniami. Tej
          operacji nie można cofnąć.
        </p>
        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            className="btn btn-outline px-5"
            disabled={isPending}
            onClick={onClose}
          >
            Anuluj
          </button>
          <button
            type="button"
            className="btn px-5 btn-error"
            disabled={isPending}
            onClick={() => project && mutate(project)}
          >
            {isPending && (
              <span className="loading loading-sm loading-spinner" />
            )}
            Usuń projekt
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit">Zamknij</button>
      </form>
    </dialog>
  )
}
