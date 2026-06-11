export default function ExploreCarListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-border bg-surface p-5"
        >
          <div className="flex gap-4">
            <div className="size-10 rounded-xl bg-surface-overlay" />
            <div className="h-24 flex-1 rounded-xl bg-surface-overlay" />
          </div>
          <div className="mt-4 h-4 w-1/3 rounded-full bg-surface-overlay" />
          <div className="mt-2 h-2 w-full rounded-full bg-surface-overlay" />
        </div>
      ))}
    </div>
  )
}
