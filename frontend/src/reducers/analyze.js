import { createSlice } from '@reduxjs/toolkit'

const analyzeSlice = createSlice({
  name: 'analyze',
  initialState: {
      data: [],
      height: 0,
      width: 0,
      levels: []
  },
  reducers: {
    filesUploaded: (state, data) => {
      state.data = data.payload.images;
      state.height = data.payload.height;
      state.width = data.payload.width;
      state.levels = data.payload.levels;
    },
    generateReport: (state, data) => {
      state.report = data.payload.report;
    },
  }
})

export const { filesUploaded, generateReport } = analyzeSlice.actions
export default analyzeSlice.reducer