import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { QuizAnswers } from '@cardeko/types'

import type { RootState } from '..'

interface QuizState {
  answers: QuizAnswers
  isComplete: boolean
}

const INITIAL_ANSWERS: QuizAnswers = {
  budget: null,
  useCase: null,
  fuelType: null,
  seating: null,
  priority: null,
}

const initialState: QuizState = {
  answers: INITIAL_ANSWERS,
  isComplete: false,
}

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizAnswers(state, action: PayloadAction<QuizAnswers>) {
      state.answers = action.payload
    },
    completeQuiz(state, action: PayloadAction<QuizAnswers>) {
      state.answers = action.payload
      state.isComplete = true
    },
    resetQuiz(state) {
      state.answers = INITIAL_ANSWERS
      state.isComplete = false
    },
  },
})

export const { setQuizAnswers, completeQuiz, resetQuiz } = quizSlice.actions
export const selectQuizAnswers = (state: RootState) => state.quiz.answers
export const selectQuizComplete = (state: RootState) => state.quiz.isComplete
export default quizSlice.reducer
