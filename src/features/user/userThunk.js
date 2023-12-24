import { customApiCall } from "../../utils/axios";
import apiUrls from "../../api/urls";

export const loginUserThunk = async (user, thunkAPI) => {
  try {
    var FormData = require("form-data");
    var data = new FormData();
    data.append("username", user.username);
    data.append("password", user.password);

    const resp = await customApiCall.post({
      url: apiUrls.user.login.url,
      data: data,
      headers: {},
    });
    return resp;
  } catch (error) {
    const defaultErrorMessage = "msg";
    const msg =
      error.response.status === 401 ? "msg" : error.response.data.error;
    return thunkAPI.rejectWithValue(msg || defaultErrorMessage);
  }
};

export const refreshTokenThunk = async (user, thunkAPI) => {
  try {
    var FormData = require("form-data");
    var data = new FormData();
    data.append("refresh", user.refresh || user.refresh_token);

    const resp = await customApiCall.post({
      url: apiUrls.user.refreshToken,
      data: data,
      headers: {},
    });
    return resp;
  } catch (error) {
    const defaultErrorMessage = "msg";
    const msg =
      error.response.status === 401 ? "msg" : error.response.data.error;
    return thunkAPI.rejectWithValue(msg || defaultErrorMessage);
  }
};
