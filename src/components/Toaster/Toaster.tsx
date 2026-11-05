import { useSyncExternalStore } from 'react'
import { cn } from '@/utils/cn'
import {
  dismissToast,
  getToasts,
  subscribeToToasts,
  type ToastVariant
} from '@/utils/toast'

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: 'bg-success',
  error: 'bg-error',
  info: 'bg-info',
  warning: 'bg-warning'
}

export const Toaster = () => {
  const toasts = useSyncExternalStore(subscribeToToasts, getToasts)

  return (
    <div aria-live="polite" className="toast toast-center toast-bottom z-50">
      {toasts.map(({ id, message, variant }) => (
        <div
          key={id}
          role={variant === 'error' ? 'alert' : 'status'}
          className="flex max-w-sm items-center gap-3 rounded-2xl bg-neutral py-2 pr-2 pl-4 text-sm text-neutral-content shadow-lg"
        >
          <span
            aria-hidden="true"
            className={cn(
              'size-2 shrink-0 rounded-full',
              VARIANT_CLASSES[variant]
            )}
          />
          <span className="whitespace-normal">{message}</span>
          <button
            type="button"
            aria-label="Zamknij powiadomienie"
            className="btn btn-circle btn-ghost text-neutral-content/70 btn-sm hover:bg-white/10 hover:text-neutral-content"
            onClick={() => dismissToast(id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
