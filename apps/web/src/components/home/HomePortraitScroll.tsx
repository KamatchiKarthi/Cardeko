import type { ReactNode } from 'react'

interface HomePortraitScrollProps {
  isLoading: boolean
  skeletonCount?: number
  children: ReactNode
}

function PortraitCardSkeleton() {
  return (
    <div className="w-[150px] shrink-0 animate-pulse sm:w-[170px]">
      <div className="aspect-[2/3] rounded-lg bg-surface-overlay" />
    </div>
  )
}

export default function HomePortraitScroll({
  isLoading,
  skeletonCount = 6,
  children,
}: HomePortraitScrollProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-6 pt-2 sm:mx-0 sm:px-0">
      <div className="flex gap-3 sm:gap-4">
        {isLoading &&
          Array.from({ length: skeletonCount }, (_, index) => <PortraitCardSkeleton key={index} />)}
        {!isLoading && children}
      </div>
    </div>
  )
}
