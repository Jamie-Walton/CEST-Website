import { createSlice } from '@reduxjs/toolkit'

const analyzeSlice = createSlice({
  name: 'analyze',
  initialState: {
      data: []
  },
  reducers: {
    filesUploaded(state, data) {
      state.data = data
    },
  }
})

export const { filesUploaded } = analyzeSlice.actions
export default analyzeSlice.reducer