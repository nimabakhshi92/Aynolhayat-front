import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import apiUrls from "../urls";
import { customApiCall } from "../../utils/axios";
import { logoutUser } from "../../features/user/userSlice";

// ==========================
// Hooks Skleton
// ==========================
const useGeneralGetHook = ({ defaultDataValue, cacheName, getFunction }) => {
  const dispatch = useDispatch();
  const { data, isLoading } = useQuery(cacheName, () =>
    dispatch(getFunction())
  );
  const isError = data ? "error" in data : true;
  const resultData = data?.payload || defaultDataValue;
  if (defaultDataValue.constructor === Array)
    return { data: [...resultData], isLoading, isError };
  if (defaultDataValue.constructor === Object)
    return { data: { ...resultData }, isLoading, isError };
  return { data: resultData, isLoading, isError };
};

const use2GeneralGetHook = (cacheName, url) => {
  const fn = async () => {
    const resp = await customApiCall.get({ url });
    return resp;
  };
  return useQuery(cacheName, fn);
};

// ==========================
// Common Hooks
// ==========================
export const useGetSummaryTree = (section) => {
  const url = apiUrls.narrationSummaries.list(section);
  return use2GeneralGetHook(["summaryTree", section], url);
};
