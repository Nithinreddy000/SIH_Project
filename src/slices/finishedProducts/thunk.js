import { getFirebaseBackend } from "../../helpers/firebase_helper";
import { getFinishedProductsData } from "../../helpers/fakebackend_helper";
import { FinishedProductsSuccess, apiError } from './reducer';

export const fetchFinishedProductsData = () => async (dispatch, getState) => {
  try {    const { selectedDates } = getState().FinishedProducts;
    const [FromDate, ToDate] = selectedDates;

    if (!FromDate || !ToDate) {
      throw new Error("Date range is not fully specified");
    }

    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      response = await fireBaseBackend.licenseUser(user.email, user.password);
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      // Assuming postJwtLogin is imported and implemented correctly
      response = await postJwtLogin({
        email: user.email,
        password: user.password
      });
    } else if (process.env.REACT_APP_API_URL) {
      response = await getFinishedProductsData({
        FromDate,
        ToDate,
        VoucherTypeID: "16acad1d-52b9-481c-b90c-4d80534a3d8a"
      });
    }

    if (response) {
      dispatch(FinishedProductsSuccess(response)); // Assuming response.data is the array of items
    } else {
      dispatch(apiError({ message: "No data received from API" }));
    }
  } catch (error) {
    dispatch(apiError({ message: error.message }));
  }
};
