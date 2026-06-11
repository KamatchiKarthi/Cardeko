import { useCarsByIds } from '@/hooks/useCarsByIds'
import { useAppSelector } from '@/store'
import { selectShortlistIds } from '@/store/slices/shortlistSlice'

export function useShortlistCars() {
  const shortlistIds = useAppSelector(selectShortlistIds)
  const { cars, isLoading, isError } = useCarsByIds(shortlistIds)

  return {
    cars,
    isLoading,
    isError,
    shortlistCount: shortlistIds.length,
  }
}
