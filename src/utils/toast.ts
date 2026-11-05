export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export type Toast = {
  id: number
  message: string
  variant: ToastVariant
}

const DURATION_MS = 4000

let toasts: Toast[] = []
let nextId = 0
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(listener => listener())

export const dismissToast = (id: number) => {
  toasts = toasts.filter(toast => toast.id !== id)
  emit()
}

const show = (variant: ToastVariant) => (message: string) => {
  const id = nextId++
  toasts = [...toasts, { id, message, variant }]
  emit()
  setTimeout(() => dismissToast(id), DURATION_MS)
}

export const toast = {
  success: show('success'),
  error: show('error'),
  info: show('info'),
  warning: show('warning')
}

export const subscribeToToasts = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getToasts = () => toasts
