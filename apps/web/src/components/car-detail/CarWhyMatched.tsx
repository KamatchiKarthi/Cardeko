import type { ICar } from '@cardeko/types'
import { HiSparkles } from 'react-icons/hi2'

import Card from '@/components/ui/Card'
import { getWhyMatchedBullets } from '@/features/car-detail/car-detail.utils'
import { useAppSelector } from '@/store'
import { selectQuizAnswers, selectQuizComplete } from '@/store/slices/quizSlice'

interface CarWhyMatchedProps {
  car: ICar
}

export default function CarWhyMatched({ car }: CarWhyMatchedProps) {
  const quizAnswers = useAppSelector(selectQuizAnswers)
  const quizComplete = useAppSelector(selectQuizComplete)
  const bullets = getWhyMatchedBullets(car, quizComplete ? quizAnswers : null)

  return (
    <Card elevated>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
          <HiSparkles className="size-4" />
        </div>
        <h2 className="text-lg font-bold text-text-primary">Why this matched you</h2>
      </div>

      <ul className="space-y-2.5">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2.5 text-sm text-text-secondary">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-accent" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
