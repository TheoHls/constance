import type { ReactNode } from 'react'

type EmptyStateProps = {
  image: string
  title: string
  description: string
  children: ReactNode
}

export function EmptyState({ image, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-24">
      <img src={image} alt="" width={800} height={450} className="h-auto w-full rounded-16" />
      <div className="flex flex-col items-center gap-8 text-center">
        <h2 className="type-h2">{title}</h2>
        <p className="max-w-[240px] type-text-md text-text-icon-secondary">{description}</p>
      </div>
      {children}
    </div>
  )
}
