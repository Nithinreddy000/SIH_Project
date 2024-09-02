import { getERPDashboardData, postFakeProfile, postJwtProfile } from "../../helpers/fakebackend_helper";

// action
import { dataSuccess } from "./reducer";

export const fetchDashboardData = () => async (dispatch) => {
    try {
        
           const response = await getERPDashboardData();
           dispatch(dataSuccess(response));

    } catch (error) {
        //dispatch(profileError(error));
    }
};
