import axios from "axios";
// import { toast } from "react-toastify";
import { getUserFromLocalStorage } from "./localStorage";

export const customRequestErrorHandler = ({ error, callbacks, thunkAPI }) => {
  // if (error.response.status === 401) {
  //   thunkAPI.dispatch(
  //     logoutUser("message"   )
  //   );
  // }
  return thunkAPI.rejectWithValue(error.response.data.error);
};

export const customApiCall = {
  post: async function ({ url, data, headers = {}, useToken = true }) {
    const user = getUserFromLocalStorage();
    if (user && useToken)
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;

    let config = { headers };
    const resp = await axios.post(url, data, config);
    return resp.data;
  },
  patch: async function ({ url, data, headers = {}, useToken = true }) {
    const user = getUserFromLocalStorage();
    if (user && useToken)
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;

    let config = { headers };
    const resp = await axios.patch(url, data, config);
    return resp.data;
  },
  delete: async function ({ url, headers = {}, useToken = true }) {
    const user = getUserFromLocalStorage();
    if (user && useToken)
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;

    let config = { headers };
    const resp = await axios.delete(url, config);
    return resp.data;
  },
  get: async function ({ url, headers = {}, useToken = true, onDownloadProgress }) {
    const user = getUserFromLocalStorage();
    if (user && useToken) {
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;
    }

    let config = { headers, onDownloadProgress };
    const resp = await axios.get(url, config);
    return resp.data;
  },
};
