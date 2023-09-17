import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";
import { toast } from "react-toastify";
import { loginUserThunk } from "./userThunk";
import i18next from "i18next";

const initialState = {
  user: getUserFromLocalStorage(),
  isLoading: false,
};
export const loginUser = createAsyncThunk("user/login", loginUserThunk);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      removeUserFromLocalStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = payload;
        addUserToLocalStorage(payload);
        toast.success("خوش آمدید");
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
