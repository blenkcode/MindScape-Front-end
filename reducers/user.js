import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    name: null,
    contacts: [],
    projectID: null,
    openConversation: [],
    userId: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginn: (state, action) => {
      state.value.token = action.payload.token;
      state.value.name = action.payload.name;
      state.value.userId = action.payload.userId;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.name = null;
      state.value.contacts = [];
      state.value.projectID = null;
      state.value.openConversation = [];
    },
    updateProjectID: (state, action) => {
      state.value.projectID = action.payload;
    },
    updateContacts: (state, action) => {
      state.value.contacts = action.payload;
    },
    setOpenConversation: (state, action) => {
      const exists = state.value.openConversation.find(
        (conv) => conv._id === action.payload._id
      );
      if (!exists) {
        state.value.openConversation.push(action.payload);
      } else {
        state.value.openConversation = state.value.openConversation.filter(
          (conv) => conv._id !== action.payload._id
        );
      }
    },
  },
});

export const {
  loginn,
  logout,
  updateContacts,
  updateProjectID,
  setOpenConversation,
} = userSlice.actions;
export default userSlice.reducer;
