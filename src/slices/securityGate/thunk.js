import { getSecurityGateData } from "../../helpers/fakebackend_helper";

// action
import { dataSuccess } from "./reducer";

export const fetchSecurityGateData = () => async (dispatch) => {
    try {
        
           const response = await getSecurityGateData();
           dispatch(dataSuccess(response));

    } catch (error) {
        //dispatch(profileError(error));
    }
};