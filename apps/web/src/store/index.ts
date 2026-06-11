import { configureStore } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'

import '@/features/cars/carsApi'
import '@/features/reviews/reviewsApi'

import { baseApi } from './api'
import compareReducer from './slices/compareSlice'
import quizReducer from './slices/quizSlice'
import shortlistReducer from './slices/shortlistSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    compare: compareReducer,
    quiz: quizReducer,
    shortlist: shortlistReducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
