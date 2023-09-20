import { createSlice } from '@reduxjs/toolkit'

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
      page: '',
      pageChangeRequest: false,
      pageChangeSuccess: true,
  },
  reducers: {
    navigateTo: (state, page) => {
      state.page = page;
      state.pageChangeRequest = true;
    },
    redirected: (state) => {
        state.pageChangeRequest = false;
        state.pageChangeSuccess = true;
      },
  }
})

export const { navigatedTo } = menuSlice.actions
export default menuSlice.reducer