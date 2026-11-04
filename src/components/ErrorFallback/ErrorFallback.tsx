import { useEffect } from 'react'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useRouter, type ErrorComponentProps } from '@tanstack/react-router'

export const ErrorFallback = ({ error }: ErrorComponentProps) => {
  const router = useRouter()
  const queryErrorResetBoundary = useQueryErrorResetBoundary()
  const message = error instanceof Error ? error.message : null

  // Lets failed queries refetch instead of re-throwing the cached error
  useEffect(() => {
    queryErrorResetBoundary.reset()
  }, [queryErrorResetBoundary])

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center"
    >
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      {message && <p className="max-w-lg text-sm text-gray-600">{message}</p>}
      <button
        type="button"
        onClick={() => router.invalidate()}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Try again
      </button>
    </div>
  )
}
