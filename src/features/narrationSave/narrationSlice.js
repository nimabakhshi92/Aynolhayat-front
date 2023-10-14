import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";
import { toast } from "react-toastify";
import i18next from "i18next";
import { createNarrationThunk } from "./narrationThunk";

const initialState = {
  narration: null,
  isLoading: false,
  status: null,
};
export const createNarration = createAsyncThunk(
  "narration/create",
  createNarrationThunk
);

const narrationSlice = createSlice({
  name: "narration",
  initialState,
  reducers: {
    clearNarration: (state) => {
      state.narration = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNarration.pending, (state) => {
        state.status = null;
        state.isLoading = true;
      })
      .addCase(createNarration.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.narration = payload;
        state.status = 200;
        toast.success("با موفقیت ذخیره شد");
      })
      .addCase(createNarration.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});

export const { clearNarration } = narrationSlice.actions;
export default narrationSlice.reducer;
