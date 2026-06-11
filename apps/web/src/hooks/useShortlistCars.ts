import type { ICar } from '@cardeko/types'

import { useGetCarByIdQuery } from '@/features/cars/carsApi'
import { MAX_COMPARE_CARS } from '@/features/compare/compare.constants'
import { useAppSelector } from '@/store'
import { selectShortlistIds } from '@/store/slices/shortlistSlice'

export function useShortlistCars() {
  const shortlistIds = useAppSelector(selectShortlistIds)
  const compareIds = shortlistIds.slice(0, MAX_COMPARE_CARS)

  const firstQuery = useGetCarByIdQuery(compareIds[0] ?? '', { skip: !compareIds[0] })
  const secondQuery = useGetCarByIdQuery(compareIds[1] ?? '', { skip: !compareIds[1] })
  const thirdQuery = useGetCarByIdQuery(compareIds[2] ?? '', { skip: !compareIds[2] })

  const queries = [firstQuery, secondQuery, thirdQuery].slice(0, compareIds.length)

  const cars = queries
    .map((query) => query.data)
    .filter((car): car is ICar => car !== null && car !== undefined)

  const isLoading = queries.some((query) => query.isLoading)
  const isError = queries.some((query) => query.isError)

  return {
    compareIds,
    cars,
    isLoading,
    isError,
    shortlistCount: shortlistIds.length,
  }
}
