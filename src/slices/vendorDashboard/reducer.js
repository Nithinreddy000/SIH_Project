import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: "",
  success: "test", 
  user: []
};

const VendorDashboard  = createSlice({
  name: "VendorDashboard",
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
} = VendorDashboard.actions

export default VendorDashboard.reducer;
