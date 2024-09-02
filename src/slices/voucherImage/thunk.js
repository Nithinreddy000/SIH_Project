import { getVoucherImagesNumData } from "../../helpers/fakebackend_helper";

// action
import { dataSuccess2 ,apiError} from "./reducer";

export const fetchVoucherImagesNumData = () => async (dispatch) => {
    try {
        
           const response = await getVoucherImagesNumData();
           dispatch(dataSuccess2(response));
           localStorage.removeItem("errorimages");
        } catch (error) {
          dispatch(apiError(error));
          // Store the error in local storage
          localStorage.setItem("errorimages", JSON.stringify(error));
        }
      };