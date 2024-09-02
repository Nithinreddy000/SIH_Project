import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {},
  error: "", // for error message
  loading2: false,
  isUserLogout: false,
  errorMsg: false, // for error
};

const license = createSlice({
  name: "license",
  initialState,
  reducers: {
    apiError(state, action) {
      state.error = action.payload;
      state.loading2 = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    licenseSuccess(state, action) {
      state.user = action.payload
      state.loading2 = false;
      state.errorMsg = false;
    },
    licenseLogoutUserSuccess(state, action) {
      state.isUserLogout = true
    },
    reset_license_flag(state) {
      state.error = null
      state.loading2 = false;
      state.errorMsg = false;
    }
  },
});

export const {
  apiError,
  licenseSuccess,
  licenseLogoutUserSuccess,
  reset_license_flag
} = license.actions

export default license.reducer;