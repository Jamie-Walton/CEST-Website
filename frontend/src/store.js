import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './reducers/menu.js';
import analyzeReducer from './reducers/analyze.js';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    analyze: analyzeReducer,
  }
})