import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './reducers/menu.js';
import analyzeReducer from './reducers/analyze.js';
import reportReducer from './reducers/report.js';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    analyze: analyzeReducer,
    report: reportReducer,
  }
})