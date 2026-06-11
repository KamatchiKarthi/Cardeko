import { HiArrowRight, HiBookmark } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import { useAppSelector } from '@/store'
import { selectShortlistCount } from '@/store/slices/shortlistSlice'

export default function ExploreShortlistBar() {
  const shortlistCount = useAppSelector(selectShortlistCount)

  if (shortlistCount === 0) return null

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-brand-accent/30 bg-brand-accent/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-accent text-white">
          <HiBookmark className="size-4" />
        </span>
        <span className="text-text-primary">
          <strong>{shortlistCount}</strong> car{shortlistCount === 1 ? '' : 's'} in your shortlist
        </span>
      </div>

      <Link to="/shortlist">
        <Button type="button" size="sm" variant="secondary" className="gap-1.5">
          Manage shortlist
          <HiArrowRight className="size-4" />
        </Button>
      </Link>
    </div>
  )
}
