import { getVoucherNumData} from "../../helpers/fakebackend_helper";

// action
import { dataSuccess } from "./reducer";

export const fetchVoucherNumData = () => async (dispatch) => {
    try {
        
           const response = await getVoucherNumData();
           dispatch(dataSuccess(response));

    } catch (error) {
        //dispatch(profileError(error));
    }
};

