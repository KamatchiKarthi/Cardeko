import Card from '@/components/ui/Card'

interface CarProsConsGridProps {
  pros: string[]
  cons: string[]
}

export default function CarProsConsGrid({ pros, cons }: CarProsConsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card elevated className="border-status-success/20 bg-green-50/50">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-status-success">Pros</h2>
        {pros.length === 0 ? (
          <p className="text-sm text-text-muted">No owner pros listed yet.</p>
        ) : (
          <ul className="space-y-2">
            {pros.map((pro) => (
              <li key={pro} className="flex gap-2 text-sm text-text-secondary">
                <span className="font-bold text-status-success">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card elevated className="border-status-error/20 bg-red-50/50">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-status-error">Cons</h2>
        {cons.length === 0 ? (
          <p className="text-sm text-text-muted">No owner cons listed yet.</p>
        ) : (
          <ul className="space-y-2">
            {cons.map((con) => (
              <li key={con} className="flex gap-2 text-sm text-text-secondary">
                <span className="font-bold text-status-error">−</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
