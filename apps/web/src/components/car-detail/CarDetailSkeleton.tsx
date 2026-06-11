export default function CarDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="border-b border-border bg-surface py-10">
        <div className="container-page">
          <div className="flex gap-4">
            <div className="size-14 rounded-2xl bg-surface-overlay" />
            <div className="h-32 w-64 rounded-2xl bg-surface-overlay" />
          </div>
          <div className="mt-6 h-8 w-1/2 rounded-full bg-surface-overlay" />
          <div className="mt-2 h-4 w-1/3 rounded-full bg-surface-overlay" />
        </div>
      </div>
      <div className="container-page space-y-4 py-8">
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 rounded-xl bg-surface-overlay" />
          ))}
        </div>
        <div className="h-40 rounded-xl bg-surface-overlay" />
        <div className="h-64 rounded-xl bg-surface-overlay" />
      </div>
    </div>
  )
}
