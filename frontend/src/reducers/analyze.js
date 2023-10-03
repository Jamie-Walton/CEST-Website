import { createSlice } from '@reduxjs/toolkit'

const analyzeSlice = createSlice({
  name: 'analyze',
  initialState: {
      data: []
  },
  reducers: {
    filesUploaded: (state, data) => {
      state.data = data.payload.images;
    },
    generateReport: (state, data) => {
      state.report = data.payload.report;
    },
  }
})

export const { filesUploaded, generateReport } = analyzeSlice.actions
export default analyzeSlice.reducer