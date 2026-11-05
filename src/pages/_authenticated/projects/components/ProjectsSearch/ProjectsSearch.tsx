import { useEffect, useState } from 'react'

const DEBOUNCE_MS = 300

type ProjectsSearchProps = {
  value: string
  onSearch: (name: string) => void
}

export const ProjectsSearch = ({ value, onSearch }: ProjectsSearchProps) => {
  const [query, setQuery] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  if (value !== syncedValue) {
    setSyncedValue(value)
    if (value !== query.trim()) setQuery(value)
  }

  useEffect(() => {
    const name = query.trim()
    if (name === value) return

    const timeout = setTimeout(() => onSearch(name), DEBOUNCE_MS)
    return () => clearTimeout(timeout)
  }, [query, value, onSearch])

  return (
    <div role="search" className="w-full sm:w-96">
      <label className="input w-full border-transparent bg-base-200 input-lg focus-within:border-primary focus-within:outline-primary">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-5 shrink-0 opacity-50"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Szukaj po nazwie"
          aria-label="Szukaj projektów po nazwie"
          className="text-base"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </label>
    </div>
  )
}
