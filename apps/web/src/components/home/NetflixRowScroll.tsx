import type { ReactNode } from 'react'

interface NetflixRowScrollProps {
  isLoading: boolean
  skeletonCount?: number
  children: ReactNode
}

function NetflixCardSkeleton() {
  return (
    <div className="w-[150px] shrink-0 animate-pulse sm:w-[170px]">
      <div className="aspect-[2/3] rounded-lg bg-surface-overlay" />
    </div>
  )
}

export default function NetflixRowScroll({
  isLoading,
  skeletonCount = 6,
  children,
}: NetflixRowScrollProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-6 pt-2 sm:mx-0 sm:px-0">
      <div className="flex gap-3 sm:gap-4">
        {isLoading &&
          Array.from({ length: skeletonCount }, (_, index) => (
            <NetflixCardSkeleton key={index} />
          ))}
        {!isLoading && children}
      </div>
    </div>
  )
}
