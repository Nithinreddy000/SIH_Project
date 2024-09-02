import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: "",
  success: "test", 
  user: []
};

const SecurityGate  = createSlice({
  name: "SecurityGate",
  initialState,
  reducers: { 
    dataSuccess(state, action) {
      state.success = "true";
      state.user = action.payload
    },
  },
});

export const {
    dataSuccess
} = SecurityGate.actions

export default SecurityGate.reducer;
