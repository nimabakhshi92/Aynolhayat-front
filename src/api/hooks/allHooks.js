import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import apiUrls from "../urls";
import { customApiCall } from "../../utils/axios";
import { logoutUser } from "../../features/user/userSlice";
import axios from "axios";
import { isAdmin } from "../../utils/acl";
import { shareNarrationStatus } from "../../utils/enums";

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

const use2GeneralGetHook = (cacheName, url, configs = {}, onDownloadProgress) => {
  const { user } = useSelector((store) => store.user);

  const fn = async () => {
    const resp = await customApiCall.get({ url, onDownloadProgress });
    return resp;
  };

  return useQuery({
    queryKey: cacheName,
    queryFn: fn,
    staleTime: isAdmin(user) ? 0 : 1800000, // 30 Minutes
    ...configs,
  });
};

const longCacheConfig = {
  // gcTime: 1000 * 60 * 60 * 24 * 7,
  staleTime: 1000 * 60 * 60 * 24 * 7,
};
// ==========================
// Common Hooks
// ==========================
export const useGetSummaryTree = (section, user, personal) => {
  const url = apiUrls.narrationSummaries.list(section, personal && user.id);
  return use2GeneralGetHook(["summaryTree", section, user, personal], url);
};
export const useGetImam = () => {
  const url = apiUrls.Imam.list;
  return use2GeneralGetHook(["Imam"], url, longCacheConfig);
};
export const useGetBooks = () => {
  const url = apiUrls.book.list;
  return use2GeneralGetHook(["book"], url);
};
export const useGetSubjects = () => {
  const url = apiUrls.subject.list;
  return use2GeneralGetHook(["subject"], url);
};
export const useGetSurah = () => {
  const url = apiUrls.quran.surah;
  return use2GeneralGetHook(["surah"], url, longCacheConfig);
};
export const useGetVerse = (surahNo, verseNo) => {
  const url = apiUrls.quran.verse(
    surahNo === "all" ? "" : surahNo || -1,
    verseNo === "all" ? "" : verseNo || -1
  );
  const enabled = !!surahNo && !!verseNo;
  let config = { enabled: true };
  if (surahNo === "all" && verseNo === "all")
    config = { ...config, ...longCacheConfig };
  return use2GeneralGetHook(["verse", surahNo, verseNo], url, config);
};
export const useGetNarrationIndividual = (narrationId, user) => {
  const url = apiUrls.narration.get(narrationId, user?.id);
  return use2GeneralGetHook(["narrationIndividual", Number(narrationId)], url);
};
export const useGetNarrationList = (pageNo, selectedOptions, onDownloadProgress) => {
  const url = apiUrls.narration.list(pageNo, selectedOptions, 10);
  return use2GeneralGetHook(["narrationList", pageNo, selectedOptions], url, {}, onDownloadProgress);
};
export const useGetNarrationFilterOptions = () => {
  const url = apiUrls.narration.filterOptions;
  return use2GeneralGetHook(["filterOptions"], url);
};

export const modifyNarrationInfo = async (inputs) => {
  const { narrationId, data } = inputs;
  const url = apiUrls.narration.get(narrationId);
  const resp = await customApiCall.patch({ url, data });
  return resp;
};
export const useModifyNarrationInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: modifyNarrationInfo,
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
      // queryClient.invalidateQueries({
      //   queryKey: ["narrationIndividual", context.narrationId],
      // });
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
  return useMutation({
    mutationFn: addNarrationSubject,
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
              ...oldData?.subjects,
              { id: Math.random(), subject: data?.subject },
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
      queryClient.invalidateQueries({
        queryKey: ["narrationIndividual", context.narrationId],
      });
    },
  });
};
export const useDeleteNarrationSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNarrationSubject,
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
      queryClient.invalidateQueries({
        queryKey: ["narrationIndividual", narrationId],
      });
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
  return useMutation({
    mutationFn: modifyNarrationSummary,
    onMutate: async (inputs) => {
      const { narrationId, summaryId, data, dataForMutate, onSettled } = inputs;
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
            content_summary_tree: oldData.content_summary_tree.map((s) => {
              if (s.id !== summaryId) return s;
              else return { ...s, ...dataForMutate };
            }),
          };
        }
      );
      return { previousData, narrationId, data, onSettled };
    },
    onError: (error, _output, context) => {
      if (context?.data?.alphabet !== "")
        toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["narrationIndividual", context.narrationId],
        context.previousData
      );

    },
    onSettled: (inputs, error, variables, context) => {
      // queryClient.invalidateQueries({
      //   queryKey: ["narrationIndividual", context.narrationId],
      // });
      if (context.onSettled) context.onSettled();
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
  return useMutation({
    mutationFn: addNarrationSummary,
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
      // queryClient.invalidateQueries({queryKey:[
      //   "narrationIndividual",
      //   context.narrationId,
      // ]});
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["narrationIndividual", context.narrationId],
      });
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
  return useMutation({
    mutationFn: deleteNarrationSummary,
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
      queryClient.invalidateQueries({
        queryKey: ["narrationIndividual", context.narrationId],
      });
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
  return useMutation({
    mutationFn: modifyNarrationFootnote,
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
      // queryClient.invalidateQueries({queryKey:[
      //   "narrationIndividual",
      //   context.narrationId,
      // ]});
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["narrationIndividual", context.narrationId],
      });
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
  return useMutation({
    mutationFn: addNarrationFootnote,
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
      // queryClient.invalidateQueries({queryKey:[
      //   "narrationIndividual",
      //   context.narrationId,
      // ]});
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["narrationIndividual", context.narrationId],
      });
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
  return useMutation({
    mutationFn: deleteNarrationFootnote,
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
      queryClient.invalidateQueries({
        queryKey: ["narrationIndividual", context.narrationId],
      });
    },
  });
};


export const duplicateSharedNarration = async ({ narrationId }) => {
  const url = apiUrls.transfer.duplicateNarration(narrationId)
  const resp = await customApiCall.post({ url });
  return resp;
};

export const moveNarrationToMainSite = async ({ narrationId }) => {
  const url = apiUrls.transfer.moveNarrationToMainSite(narrationId)
  const resp = await customApiCall.post({ url });
  return resp;
};


export const postSharedNarrations = async ({ narrationId }) => {
  const data = { narration_id: narrationId, status: shareNarrationStatus.PENDING }
  const url = apiUrls.transfer.sharedNarrations.post(narrationId)
  const resp = await customApiCall.post({ url, data });
  return resp;
};

export const updateSharedNarrations = async ({ id, data }) => {
  const url = apiUrls.transfer.sharedNarrations.update(id)
  const resp = await customApiCall.patch({ url, data });
  return resp;
};


export const useGetSharedNarrations = () => {
  const url = apiUrls.transfer.sharedNarrations.list()
  return use2GeneralGetHook(["sharedNarrations"], url);
};

export const useGetSingleSharedNarration = (sharedNarrationId) => {
  const url = apiUrls.transfer.sharedNarrations.get(sharedNarrationId)
  return use2GeneralGetHook(["sharedNarrations", sharedNarrationId], url);
};

export const useShareNarration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postSharedNarrations,
    onMutate: async (inputs) => {
      const { narrationId } = inputs;
      await queryClient.cancelQueries(["sharedNarrations", narrationId]);
      const previousData = queryClient.getQueryData([
        "sharedNarrations",
      ]);
      queryClient.setQueryData(
        ["sharedNarrations"],
        (oldData) => {
          return [
            ...oldData,
            { id: -1, status: shareNarrationStatus.SENDING, narration: { id: narrationId } },
          ];
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["sharedNarrations"],
        context.previousData
      );
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["sharedNarrations"],
      });
    },
  });
};


export const useUpdateSharedNarration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSharedNarrations,
    onMutate: async (inputs) => {
      const { id, narrationId, data } = inputs;
      await queryClient.cancelQueries(["sharedNarrations"]);
      const previousData = queryClient.getQueryData([
        "sharedNarrations",
      ]);
      queryClient.setQueryData(
        ["sharedNarrations"],
        (oldData) => {
          return [
            ...oldData,
            { id: -1, status: shareNarrationStatus.SENDING, narration: { id: narrationId } },
          ];
        }
      );
      return { previousData, narrationId };
    },
    onError: (error, _output, context) => {
      toast.error("تغییر مورد نظر انجام نشد");
      queryClient.setQueryData(
        ["sharedNarrations"],
        context.previousData
      );
    },
    onSettled: (inputs, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["sharedNarrations"],
      });
    },
  });
};


