
import { combineReducers } from "redux";

import CompanySelectionReducer from "./companySelection/reducer"

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

//LicenseValidation
import licenseReducer from "./LicenseValidation/reducer";
//FinishedProducts
import FinishedProductsReducer from "./finishedProducts/reducer";


//erp
import ERPDashboardReducer from "./erpDashboard/reducer";
//security dashboard
import SecurityGateReducer from "./securityGate/reducer";
// API Key
import APIKeyReducer from "./apiKey/reducer";
//voucher num
import VoucherNumReducer from "./voucherNum/reducer";
import VoucherNumImageReducer from "./voucherImage/reducer";
const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    APIKey: APIKeyReducer,
    ERPDashboard: ERPDashboardReducer,
    SecurityGate: SecurityGateReducer,
    CompanySelection: CompanySelectionReducer,
    LicenseValidation : licenseReducer,
    FinishedProducts : FinishedProductsReducer,
    VoucherNum : VoucherNumReducer,
    VoucherImageNum : VoucherNumImageReducer,
});

export default rootReducer;