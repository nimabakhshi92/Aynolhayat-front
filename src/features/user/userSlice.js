import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";
import { toast } from "react-toastify";
import {
  loginUserThunk,
  refreshTokenThunk,
  signupUserThunk,
} from "./userThunk";
import i18next from "i18next";

const initialState = {
  user: getUserFromLocalStorage(),
  isLoading: false,
  refreshIsLoading: false,
};
export const loginUser = createAsyncThunk("user/login", loginUserThunk);
export const signupUser = createAsyncThunk("user/signupUser", signupUserThunk);
export const refreshToken = createAsyncThunk("user/refresh", refreshTokenThunk);

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
        // toast.success("خوش آمدید");
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signupUser.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.user = {
          ...payload,
          refresh: payload.token.refresh_token,
          access: payload.token.token,
          expires_at: payload.token.expires_at,
        };
        addUserToLocalStorage({
          ...payload,
          refresh: payload.token.refresh_token,
          access: payload.token.token,
          expires_at: payload.token.expires_at,
        });
        // toast.success("خوش آمدید");
      })
      .addCase(signupUser.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })

      .addCase(refreshToken.pending, (state) => {
        state.refreshIsLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        state.refreshIsLoading = false;
        state.user.refresh = payload.refresh;
        state.user.access = payload.access;
        state.user.expires_at = payload.expires_at;
        addUserToLocalStorage(state.user);
      })
      .addCase(refreshToken.rejected, (state, { payload }) => {
        state.refreshIsLoading = false;
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
