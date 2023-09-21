import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import summaryTreeReducer from "./features/summaryTree/summaryTreeSlice";
import narrationReducer from "./features/narrationSave/narrationSlice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    summaryTree: summaryTreeReducer,
    narration: narrationReducer,
  },
});
