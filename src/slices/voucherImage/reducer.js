import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  error: "",
  success: "test", 
  loading:true,
  user2: {}
};

const VoucherImageNum  = createSlice({
  name: "VoucherImageNum",
  initialState,
  reducers: { 
    apiError(state, action) {
      state.error = action.payload;
      state.loading=false;
    },
    dataSuccess2(state, action) {
      state.success = "true";
      state.loading=false;
      state.user2 = action.payload
    },
  },
});

export const {
    dataSuccess2,
    apiError
} = VoucherImageNum.actions

export default VoucherImageNum.reducer;
