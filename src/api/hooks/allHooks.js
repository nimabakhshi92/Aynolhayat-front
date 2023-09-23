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
export const useGetImam = () => {
  const url = apiUrls.Imam.list;
  return use2GeneralGetHook("Imam", url);
};
export const useGetBooks = () => {
  const url = apiUrls.book.list;
  return use2GeneralGetHook("book", url);
};
export const useGetSubjects = () => {
  const url = apiUrls.subject.list;
  return use2GeneralGetHook("subject", url);
};
export const useGetSurah = () => {
  const url = apiUrls.quran.surah;
  return use2GeneralGetHook("surah", url);
};
export const useGetVerse = (surahNo, verseNo) => {
  const url = apiUrls.quran.verse(surahNo, verseNo);
  return use2GeneralGetHook(["verse", surahNo, verseNo], url);
};
export const useGetNarrationList = (pageNo, selectedOptions) => {
  const url = apiUrls.narration.list(pageNo, selectedOptions, 10);
  return use2GeneralGetHook(["narrationList", pageNo, selectedOptions], url);
};
export const useGetNarrationFilterOptions = () => {
  const url = apiUrls.narration.filterOptions;
  return use2GeneralGetHook("filterOptions", url);
};
