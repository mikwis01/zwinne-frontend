import type { ReactNode } from 'react'

type PageHeadingProps = {
  title: string
  children?: ReactNode
}

export const PageHeading = ({ title, children }: PageHeadingProps) => (
  <div className="flex flex-col gap-3 pt-10 pb-8 sm:pt-16 sm:pb-12">
    <h1 className="text-5xl leading-[0.95] font-medium tracking-[-0.035em] sm:text-7xl">
      {title}
    </h1>
    {children && (
      <p className="max-w-xl text-lg text-base-content/70">{children}</p>
    )}
  </div>
)
