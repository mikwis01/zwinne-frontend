import type { ReactNode } from 'react'

type AuthCardProps = {
  title: string
  children: ReactNode
}

export const AuthCard = ({ title, children }: AuthCardProps) => (
  <div className="mx-auto flex w-full max-w-xl flex-col gap-8 pt-10 sm:pt-16">
    <h1 className="text-4xl leading-none font-medium tracking-[-0.03em] sm:text-5xl">
      {title}
    </h1>
    <section className="flex flex-col gap-6 rounded-box bg-base-200 p-6 sm:p-10">
      {children}
    </section>
  </div>
)
