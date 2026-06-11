import type { ReactNode } from 'react'

interface HomeCarScrollProps {
  isLoading: boolean
  skeletonCount?: number
  children: ReactNode
}

function CarPickSkeleton() {
  return (
    <div className="flex w-[260px] shrink-0 animate-pulse flex-col overflow-hidden rounded-2xl border border-border bg-surface sm:w-[280px]">
      <div className="h-28 bg-surface-overlay" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-border" />
        <div className="h-3 w-1/2 rounded bg-border" />
        <div className="h-3 w-2/3 rounded bg-border" />
        <div className="h-6 w-24 rounded-full bg-border" />
      </div>
    </div>
  )
}

export default function HomeCarScroll({
  isLoading,
  skeletonCount = 4,
  children,
}: HomeCarScrollProps) {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
      {isLoading &&
        Array.from({ length: skeletonCount }, (_, index) => (
          <CarPickSkeleton key={index} />
        ))}
      {!isLoading && children}
    </div>
  )
}
