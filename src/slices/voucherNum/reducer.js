import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: "",
  success: "test", 
  loading:true,
  user: []
};

const VoucherNum  = createSlice({
  name: "VoucherNum",
  initialState,
  reducers: { 
    dataSuccess(state, action) {
      state.success = "true";
      state.loading=false;
      state.user = action.payload
    },
  },
});

export const {
    dataSuccess
} = VoucherNum.actions

export default VoucherNum.reducer;
