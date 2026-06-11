import type { ICar } from '@cardeko/types'
import { useEffect } from 'react'
import { shallowEqual } from 'react-redux'

import { carsApi } from '@/features/cars/carsApi'
import { useAppDispatch, useAppSelector } from '@/store'

export function useCarsByIds(ids: string[]) {
  const dispatch = useAppDispatch()
  const idsKey = ids.join(',')

  // Subscribe each car — triggers fetch and keeps the cache entry alive
  useEffect(() => {
    if (!idsKey) return
    const subs = idsKey
      .split(',')
      .map((id) => dispatch(carsApi.endpoints.getCarById.initiate(id, { subscribe: true })))
    return () => subs.forEach((sub) => sub.unsubscribe())
  }, [idsKey, dispatch])

  const cars = useAppSelector(
    (state) =>
      ids.flatMap((id): ICar[] => {
        const { data } = carsApi.endpoints.getCarById.select(id)(state)
        return data ? [data] : []
      }),
    shallowEqual
  )

  const isLoading = useAppSelector(
    (state) =>
      ids.length > 0 &&
      ids.some((id) => {
        const s = carsApi.endpoints.getCarById.select(id)(state)
        return s.isLoading || s.status === 'uninitialized'
      })
  )

  const isError = useAppSelector((state) =>
    ids.some((id) => carsApi.endpoints.getCarById.select(id)(state).isError)
  )

  return { cars, isLoading, isError }
}
