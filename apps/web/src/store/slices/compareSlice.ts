import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '..'

import { MAX_COMPARE_CARS } from '@/features/compare/compare.constants'


interface CompareState {
  ids: string[]
}

const initialState: CompareState = { ids: [] }

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare(state, action: PayloadAction<string>) {
      if (state.ids.includes(action.payload)) return
      if (state.ids.length >= MAX_COMPARE_CARS) return
      state.ids.push(action.payload)
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload)
    },
    clearCompare(state) {
      state.ids = []
    },
  },
})

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions
export const selectCompareCount = (state: RootState) => state.compare.ids.length
export const selectCompareIds = (state: RootState) => state.compare.ids
export default compareSlice.reducer
