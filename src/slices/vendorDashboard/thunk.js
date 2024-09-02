import { getVendorDashboardData} from "../../helpers/fakebackend_helper";

// action
import { dataSuccess } from "./reducer";

export const fetchVendorDashboardData = () => async (dispatch) => {
    try {
        
           const response = await getVendorDashboardData();
           dispatch(dataSuccess(response));

    } catch (error) {
        //dispatch(profileError(error));
    }
};