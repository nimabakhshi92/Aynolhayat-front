import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import summaryTreeReducer from "./features/summaryTree/summaryTreeSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    summaryTree: summaryTreeReducer,
  },
});
