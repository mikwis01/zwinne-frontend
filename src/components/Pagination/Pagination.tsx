type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  page,
  totalPages,
  onPageChange
}: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Stronicowanie"
      className="flex items-center justify-between gap-4"
    >
      <span className="text-base-content/70">
        Strona {page + 1} z {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-outline px-5"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          Poprzednia
        </button>
        <button
          type="button"
          className="btn btn-outline px-5"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Następna
        </button>
      </div>
    </nav>
  )
}
