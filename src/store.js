import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import summaryTreeReducer from "./features/summaryTree/summaryTreeSlice";
import narrationReducer from "./features/narrationSave/narrationSlice";
import statesReducer from "./features/states/states";

export const store = configureStore({
  reducer: {
    user: userReducer,
    summaryTree: summaryTreeReducer,
    narration: narrationReducer,
    states: statesReducer,
  },
});
