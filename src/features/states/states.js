import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  bank: {
    queryParams: '',
    pageNo: 1
  }
};

const statesSlice = createSlice({
  name: "states",
  initialState,
  reducers: {
    updateState: (state, { payload }) => {
      state[payload.tabName] = { ...state[payload.tabName], [payload.key]: payload.value }
    },
  },
});
export const {
  updateState,
} = statesSlice.actions;
export default statesSlice.reducer;
