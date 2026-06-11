import { useCarsByIds } from '@/hooks/useCarsByIds'
import { useAppSelector } from '@/store'
import { selectCompareIds } from '@/store/slices/compareSlice'

export function useCompareCars() {
  const compareIds = useAppSelector(selectCompareIds)
  const { cars, isLoading, isError } = useCarsByIds(compareIds)

  return {
    compareIds,
    cars,
    isLoading,
    isError,
    compareCount: compareIds.length,
  }
}
