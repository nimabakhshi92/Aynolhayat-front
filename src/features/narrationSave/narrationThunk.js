import { customApiCall } from "../../utils/axios";
import apiUrls from "../../api/urls";

export const createNarrationThunk = async (narration, thunkAPI) => {
  try {
    const resp = await customApiCall.post({
      url: apiUrls.narration.post,
      data: narration,
      headers: {},
    });
    return resp;
  } catch (error) {
    const defaultErrorMessage = "مشکلی در ذخیره حدیث بوجود آمد";
    const msg =
      error.response.status === 400
        ? "اطلاعات به درستی (یا به تمامی) پر نشده است"
        : defaultErrorMessage;
    return thunkAPI.rejectWithValue(msg);
  }
};
