import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {},
  error: "", // for error message
  loading: false,
  selectedDates: [null, null], // Include selectedDates in initialState
};

const FinishedProducts = createSlice({
  name: "FinishedProducts",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload.message;
      state.loading = false;
    },
    FinishedProductsSuccess(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.errorMsg = false;
    },
    setDateRange: (state, action) => {
      state.selectedDates = action.payload;
    },
  },
});

export const {
  apiError,
  FinishedProductsSuccess,
  setDateRange
} = FinishedProducts.actions

export default FinishedProducts.reducer;
