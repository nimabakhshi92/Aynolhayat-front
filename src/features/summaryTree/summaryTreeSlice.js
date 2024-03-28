import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  section: "bank",
  treeIsOpen: false,
  dataLoaded: false,
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
    setDataLoaded: (state, { payload }) => {
      state.dataLoaded = payload;
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
  setDataLoaded,
} = summaryTreeSlice.actions;
export default summaryTreeSlice.reducer;
