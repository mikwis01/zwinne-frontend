import { useEffect } from 'react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { getErrorMessage } from '@/utils/get-error-message'

export const ErrorFallback = ({ error }: ErrorComponentProps) => {
  const router = useRouter()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()
  const message = getErrorMessage(
    error,
    error instanceof Error ? error.message : ''
  )

  // Lets failed queries refetch instead of re-throwing the cached error
  useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col justify-center gap-4 py-10"
    >
      <h1 className="text-4xl font-medium tracking-tight">
        Nie udało się wczytać strony
      </h1>
      {message && <p className="max-w-xl text-base-content/70">{message}</p>}
      <button
        type="button"
        onClick={() => router.invalidate()}
        className="btn mt-2 self-start px-8 btn-lg btn-primary"
      >
        Spróbuj ponownie
      </button>
    </div>
  )
}
