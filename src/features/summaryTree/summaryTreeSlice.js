import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  section: "narration",
  selectedNode: {
    narration: "",
    verse: "",
    surah: "",
  },
};

const summaryTreeSlice = createSlice({
  name: "summaryTree",
  initialState,
  reducers: {
    setSelectedNode: (state, { payload }) => {
      state.selectedNode = payload.node;
    },
    setSection: (state, { payload }) => {
      state.section = payload.section;
    },
  },
});
export const { setSection, setSelectedNode } = summaryTreeSlice.actions;
export default summaryTreeSlice.reducer;
