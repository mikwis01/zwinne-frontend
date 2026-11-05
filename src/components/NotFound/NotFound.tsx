import { Link } from '@tanstack/react-router'

export const NotFound = () => (
  <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-6 px-6 py-16">
    <h1 className="text-5xl leading-[0.95] font-medium tracking-[-0.035em] sm:text-7xl">
      Nie ma takiej strony
    </h1>
    <p className="max-w-xl text-lg text-base-content/70">
      Adres mógł się zmienić albo zawiera literówkę.
    </p>
    <Link to="/" className="btn self-start px-8 btn-lg btn-primary">
      Przejdź do projektów
    </Link>
  </main>
)
