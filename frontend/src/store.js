import { configureStore } from '@reduxjs/toolkit'
import analyzeReducer from './reducers/analyze.js'

export const store = configureStore({
  reducer: {
    analyze: analyzeReducer,
  }
})