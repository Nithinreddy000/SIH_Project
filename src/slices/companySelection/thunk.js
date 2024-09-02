import { getCompanySelectionData, postFakeProfile, postJwtProfile } from "../../helpers/fakebackend_helper";

// action
import { dataSuccess } from "./reducer";

export const fetchCompanySelectionData = () => async (dispatch) => {
    try {
        
           const response = await getCompanySelectionData();
           dispatch(dataSuccess(response));

    } catch (error) {
        //dispatch(profileError(error));
    }
};
