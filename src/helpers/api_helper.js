import axios from "axios";
import { api } from "../config";
const getVoucherNumID = () => JSON.parse(localStorage.getItem("voucherNumID"));
// default
axios.defaults.baseURL = api.API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    let message;
    switch (error.status) {
      case 500:
        message = "Internal Server Error";
        break;
      case 401:
        message = "Invalid credentials";
        break;
      case 404:
        message = "Sorry! the data you are looking for could not be found";
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);

const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = async (url, params) => {
    const token = JSON.parse(localStorage.getItem("authUser2"))?.token;
    if (token) setAuthorization(token);
  
    const queryString = params
      ? Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&')
      : "";
  
    const voucherNumID = getVoucherNumID();
    if (voucherNumID && (url.includes("VoucherNumCameraCaptures") || url.includes("VoucherNumData"))) {
      url += `?VoucherNumID=${voucherNumID}`;
    }
  
    const response = await axios.get(queryString ? `${url}&${queryString}` : url);
    return response;
  };

  getdata = async (url, params) => {
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    if (token) setAuthorization(token);
  
    const subscriberID = JSON.parse(localStorage.getItem("authUser"))?.subscriberID;
    const queryString = params
      ? `?${Object.keys(params).map(key => `${key}=${params[key]}`).join('&')}`
      : "";
  
    const fullUrl = `${url}/${subscriberID}${queryString}`;
    
    const response = await axios.get(fullUrl);
    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };

create2 = (url, data) => {
    const token = JSON.parse(localStorage.getItem("authUser2"))?.token;
    if (token) {
        setAuthorization(token); // Assuming setAuthorization function is defined
    }
    return axios.post(url, data)
        .then(response => {
            // Handle successful response
            return response; // Optionally return data or handle as needed
        })
        .catch(error => {
            // Handle error
            throw error; // Rethrow or handle as per your application's error handling strategy
        });
};
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}
const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser2");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };