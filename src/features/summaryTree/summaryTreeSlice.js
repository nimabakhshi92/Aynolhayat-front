import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  section: "narration",
  treeIsOpen: false,
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
    setTreeIsOpen: (state, { payload }) => {
      state.treeIsOpen = payload;
    },
    toggleTreeIsOpen: (state, { payload }) => {
      state.treeIsOpen = !state.treeIsOpen;
    },
  },
});
export const {
  setSection,
  setSelectedNode,
  setTreeIsOpen,
  toggleTreeIsOpen,
} = summaryTreeSlice.actions;
export default summaryTreeSlice.reducer;
