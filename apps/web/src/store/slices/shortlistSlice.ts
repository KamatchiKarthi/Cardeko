import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '..'

interface ShortlistState {
  ids: string[]
}

const initialState: ShortlistState = { ids: [] }

const shortlistSlice = createSlice({
  name: 'shortlist',
  initialState,
  reducers: {
    addToShortlist(state, action: PayloadAction<string>) {
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload)
      }
    },
    removeFromShortlist(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload)
    },
    clearShortlist(state) {
      state.ids = []
    },
  },
})

export const { addToShortlist, removeFromShortlist, clearShortlist } = shortlistSlice.actions
export const selectShortlistCount = (state: RootState) => state.shortlist.ids.length
export const selectShortlistIds = (state: RootState) => state.shortlist.ids
export default shortlistSlice.reducer
