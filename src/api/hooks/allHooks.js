import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";
import apiUrls from "../urls";
import { customApiCall } from "../../utils/axios";
import { logoutUser } from "../../features/user/userSlice";
import axios from "axios";

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
export const useGetNarrationIndividual = (narrationId) => {
  const url = apiUrls.narration.get(narrationId);
  return use2GeneralGetHook(["narrationIndividual", Number(narrationId)], url);
};
export const useGetNarrationList = (pageNo, selectedOptions) => {
  const url = apiUrls.narration.list(pageNo, selectedOptions, 10);
  return use2GeneralGetHook(["narrationList", pageNo, selectedOptions], url);
};
export const useGetNarrationFilterOptions = () => {
  const url = apiUrls.narration.filterOptions;
  return use2GeneralGetHook("filterOptions", url);
};

export const modifyNarrationInfo = async (inputs) => {
  const { narrationId, data } = inputs;
  const url = apiUrls.narration.get(narrationId);
  const resp = await customApiCall.patch({ url, data });
  return resp;
};
export const useModifyNarrationInfo = () => {
  const queryClient = useQueryClient();
  return useMutation(modifyNarrationInfo, {
    onMutate: async (inputs) => {
      const { narrationId, data } = inputs;
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          return { ...oldData, ...data };
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries([
        "narrationIndividual",
        context.narrationId,
      ]);
    },
  });
};

export const addNarrationSubject = async (inputs) => {
  const { data } = inputs;
  const url = apiUrls.narration.subject.post;
  const resp = await customApiCall.post({ url, data });
  return resp;
};
export const deleteNarrationSubject = async (inputs) => {
  const { subjectId } = inputs;
  const url = apiUrls.narration.subject.get(subjectId);
  const resp = await customApiCall.delete({ url });
  return resp;
};
export const useAddNarrationSubject = () => {
  const queryClient = useQueryClient();
  return useMutation(addNarrationSubject, {
    onMutate: async (inputs) => {
      const { narrationId, data } = inputs;
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          return {
            ...oldData,
            subjects: [
              ...oldData.subjects,
              { id: Math.random(), subject: data.subject },
            ],
          };
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries([
        "narrationIndividual",
        context.narrationId,
      ]);
    },
  });
};
export const useDeleteNarrationSubject = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteNarrationSubject, {
    onMutate: async (inputs) => {
      const { narrationId, subjectId } = inputs;
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          return {
            ...oldData,
            subjects: oldData.subjects.filter((sub) => sub?.id !== subjectId),
          };
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
    },
    onSettled: (inputs) => {
      const { narrationId, data } = inputs;
      queryClient.invalidateQueries(["narrationIndividual", narrationId]);
    },
  });
};

//////////// NARRATION SUMMARY
export const modifyNarrationSummary = async (inputs) => {
  const { summaryId, data } = inputs;
  const url = apiUrls.narration.summaryTree.get(summaryId);
  const resp = await customApiCall.patch({ url, data });
  return resp;
};
export const useModifyNarrationSummary = () => {
  const queryClient = useQueryClient();
  return useMutation(modifyNarrationSummary, {
    onMutate: async (inputs) => {
      const { narrationId, summaryId, data, dataForMutate } = inputs;
      console.log("before cancel queries");
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      console.log("after cancel queries");
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          console.log(oldData);
          console.log({
            ...oldData,
            content_summary_tree: oldData.content_summary_tree.map((s) => {
              if (s.id !== summaryId) return s;
              else return { ...s, ...data };
            }),
          });
          return {
            ...oldData,
            content_summary_tree: oldData.content_summary_tree.map((s) => {
              console.log(s.id, summaryId);

              if (s.id !== summaryId) return s;
              else return { ...s, ...dataForMutate };
            }),
          };
        }
      );
      return { previousData, narrationId, data };
    },
    onError: (error, _output, context) => {
      if (context?.data?.alphabet !== "")
        toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
      // queryClient.invalidateQueries([
      //   "narrationIndividual",
      //   context.narrationId,
      // ]);
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries([
        "narrationIndividual",
        context.narrationId,
      ]);
    },
  });
};

export const addNarrationSummary = async (inputs) => {
  const { data } = inputs;
  const url = apiUrls.narration.summaryTree.post;
  const resp = await customApiCall.post({ url, data });
  return resp;
};
export const useAddNarrationSummary = () => {
  const queryClient = useQueryClient();
  return useMutation(addNarrationSummary, {
    onMutate: async (inputs) => {
      const { narrationId, data, dataForMutate } = inputs;
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          return {
            ...oldData,
            content_summary_tree: [
              ...oldData.content_summary_tree,
              dataForMutate,
            ],
          };
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
      // queryClient.invalidateQueries([
      //   "narrationIndividual",
      //   context.narrationId,
      // ]);
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries([
        "narrationIndividual",
        context.narrationId,
      ]);
    },
  });
};

export const deleteNarrationSummary = async (inputs) => {
  const { summaryId } = inputs;
  const url = apiUrls.narration.summaryTree.get(summaryId);
  const resp = await customApiCall.delete({ url });
  return resp;
};

export const useDeleteNarrationSummary = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteNarrationSummary, {
    onMutate: async (inputs) => {
      const { narrationId, summaryId } = inputs;
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          return {
            ...oldData,
            content_summary_tree: oldData.content_summary_tree.filter(
              (e) => e.id !== summaryId
            ),
          };
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries([
        "narrationIndividual",
        context.narrationId,
      ]);
    },
  });
};

//////////// NARRATION FOOTNOTE
export const modifyNarrationFootnote = async (inputs) => {
  const { footnoteId, data } = inputs;
  const url = apiUrls.narration.footnote.get(footnoteId);
  const resp = await customApiCall.patch({ url, data });
  return resp;
};
export const useModifyNarrationFootnote = () => {
  const queryClient = useQueryClient();
  return useMutation(modifyNarrationFootnote, {
    onMutate: async (inputs) => {
      const { narrationId, footnoteId, data } = inputs;
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          return {
            ...oldData,
            footnotes: oldData.footnotes.map((s) => {
              if (s.id !== footnoteId) return s;
              else return { ...s, ...data };
            }),
          };
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
      // queryClient.invalidateQueries([
      //   "narrationIndividual",
      //   context.narrationId,
      // ]);
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries([
        "narrationIndividual",
        context.narrationId,
      ]);
    },
  });
};

export const addNarrationFootnote = async (inputs) => {
  const { data } = inputs;
  const url = apiUrls.narration.footnote.post;
  const resp = await customApiCall.post({ url, data });
  return resp;
};
export const useAddNarrationFootnote = () => {
  const queryClient = useQueryClient();
  return useMutation(addNarrationFootnote, {
    onMutate: async (inputs) => {
      const { narrationId, data } = inputs;
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          return {
            ...oldData,
            footnotes: [...oldData.footnotes, data],
          };
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
      // queryClient.invalidateQueries([
      //   "narrationIndividual",
      //   context.narrationId,
      // ]);
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries([
        "narrationIndividual",
        context.narrationId,
      ]);
    },
  });
};

export const deleteNarrationFootnote = async (inputs) => {
  const { footnoteId } = inputs;
  const url = apiUrls.narration.footnote.get(footnoteId);
  const resp = await customApiCall.delete({ url });
  return resp;
};

export const useDeleteNarrationFootnote = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteNarrationFootnote, {
    onMutate: async (inputs) => {
      const { narrationId, footnoteId } = inputs;
      await queryClient.cancelQueries(["narrationIndividual", narrationId]);
      const previousData = queryClient.getQueryData([
        "narrationIndividual",
        narrationId,
      ]);
      queryClient.setQueryData(
        ["narrationIndividual", narrationId],
        (oldData) => {
          return {
            ...oldData,
            footnotes: oldData.footnotes.filter((e) => e.id !== footnoteId),
          };
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries([
        "narrationIndividual",
        context.narrationId,
      ]);
    },
  });
};
