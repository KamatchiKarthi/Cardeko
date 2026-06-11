export default function QuizContentSkeleton() {
  return (
    <div className="space-y-3 py-2">
      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-overlay">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-brand-accent/40" />
      </div>
      <div className="h-3 w-2/5 animate-pulse rounded-full bg-surface-overlay" />
      <div className="h-3 w-3/5 animate-pulse rounded-full bg-surface-overlay" />
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-surface-overlay" />
    </div>
  )
}
