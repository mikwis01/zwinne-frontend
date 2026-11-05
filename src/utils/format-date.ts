const dateFormatter = new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium' })

const timeFormatter = new Intl.DateTimeFormat('pl-PL', { timeStyle: 'short' })

export const parseLocalDate = (value: string) => {
  const [year = 0, month = 1, day = 1] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const formatDate = (value: string | null) =>
  value ? dateFormatter.format(parseLocalDate(value)) : '—'

export const formatTime = (value: string) =>
  timeFormatter.format(new Date(value))

export const isPastDate = (value: string) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return parseLocalDate(value) < today
}
