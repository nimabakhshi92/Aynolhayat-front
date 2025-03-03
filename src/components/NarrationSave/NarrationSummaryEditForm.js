import React, { useEffect, useMemo, useRef, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";

import { useQueryClient } from "@tanstack/react-query";
import {
  AiFillDelete,
  AiOutlineClose,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { toast } from "react-toastify";
import {
  useAddNarrationSummary,
  useDeleteNarrationSummary,
  useGetNarrationFilterOptions,
  useGetNarrationIndividual,
  useGetSurah,
  useGetVerse,
  useModifyNarrationSummary,
} from "../../api/hooks/allHooks";
import { InputWithSuggestionWithDebounceBlur } from "../general/InputWithSuggestion";
import { Stack, useMediaQuery } from "@mui/material";
import { InputWithSuggestionAutoCompleteWithDebounceBlur } from "../general/InputWithSuggestionAutoComplete";
import { BiLoader } from "react-icons/bi";
import { isSuperAdmin, isTaggerAdmin } from "../../utils/acl";
import { useSelector } from "react-redux";
import { CustomModal } from "../general/CustomModal";
import Button from "../ui/buttons/primary-button";
import { RiGitBranchFill } from "react-icons/ri";
import { isEqual } from "lodash";
import { Pagination } from "../Pagination";

const findVerse = (quran, surah_no, verse_no) => {
  const newVerse = quran.find(
    (verse) => verse.surah_no === surah_no && verse.verse_no === verse_no
  );
  return newVerse;
};

export const SingleNarrationSummariesForCreate = ({
  narration,
  ss,
  modalOpen,
  setModalOpen,
}) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [summary, setSummary] = useState({
    alphabet: "",
    subject: "",
    sub_subject: "",
    subject_3: "",
    subject_4: "",
    expression: "",
    summary: "",
    verse: {
      surah_no: "",
      verse_no: "",
      verse_content: "",
    },
  });

  function uniqueArray3(a) {
    function onlyUnique(value, index, self) {
      return self?.indexOf(value) === index;
    }

    // usage
    var unique = a?.filter(onlyUnique); // returns ['a', 1, 2, '1']

    return unique;
  }

  const level1 = uniqueArray3(ss?.map((s) => s.alphabet));
  const { mutate: addSummary } = useAddNarrationSummary();
  const queryClient = useQueryClient();
  const handleChange = (key, newValue) => {
    setSummary({ ...summary, [key]: newValue });
  };

  const flag = useRef(false);
  const status = useRef();

  const handleCreate = () => {
    const newValue = summary.alphabet;
    if (!newValue || newValue === " ") return;
    status.current = "isLoading";
    let key = "alphabet";
    flag.current = key;
    addSummary(
      {
        narrationId: narration?.id,
        dataForMutate: {
          alphabet: newValue,
          quran_verse: 0,
          narration: narration?.id,
        },
        data: {
          alphabet: newValue,
          quran_verse: 0,
          narration: narration?.id,
        },
      },
      {
        onSuccess: () => {
          status.current = "success";
          toast.success("با موفقیت ایجاد شد");
          queryClient.invalidateQueries({
            queryKey: ["narrationIndividual", narration.id],
          });
          setTimeout(() => {
            setModalOpen(false);
          }, 500);
        },
        onError: () => {
          toast.error("تغییر مورد نظر انجام نشد");
          status.current = "error";
        },
      }
    );
  };
  const smallInputsClassName = isSmallScreen ? "col-span-7" : "col-span-1";
  return (
    <CustomModal modalOpen={modalOpen} setModalOpen={setModalOpen}>
      <Stack className="justify-between flex-col h-full">
        <div>
          <h2 className="mb-4">
            ابتدا سطح 1 را وارد کنید سپس بر روی "ایجاد" کلیک کنید
          </h2>

          <div
            style={{
              marginBottom: "32px",
              paddingBottom: "32px",
            }}
            className=" w-full"
          >
            <InputWithSuggestionWithDebounceBlur
              suggestions={level1?.sort()}
              className="w-full"
              parentClassName={smallInputsClassName}
              onChange={(e) => {
                handleChange("alphabet", e.target.value);
              }}
              value={summary.alphabet}
              placeholder="سطح 1"
              key={"i0"}
              flag={flag?.current === "alphabet"}
              status={status.current}
              debounceDependency={summary.id}
            />
          </div>
        </div>
        <Button
          disabled={status.current === "isLoading"}
          variant={"primary"}
          onClickHandler={handleCreate}
        >
          + ایجاد
        </Button>
      </Stack>
    </CustomModal>
  );
};

export const SingleNarrationSummariesForEdit = React.memo(
  ({
    inSummary,
    narration,
    handleCancelNewItem,
    quran,
    level1,
    level2,
    level3,
    level4,
    level5,
    isFetching,
    sortedSurah,
    isSmallScreen,
    surah,
  }) => {
    const getVerse = (surah_no, verse_no) => {
      return quran?.find((surahVerse) => {
        return (
          surahVerse.surah_no === surah_no && surahVerse.verse_no === verse_no
        );
      });
    };

    const [summary, setSummary] = useState({
      alphabet: "",
      subject: "",
      sub_subject: "",
      subject_3: "",
      subject_4: "",
      expression: "",
      summary: "",
      verse: {
        surah_no: "",
        verse_no: "",
        verse_content: "",
      },
    });
    const [selectedVerse, setSelectedVerse] = useState(
      summary?.verse?.verse_no
    );

    // let { data: verse } = useGetVerse(summary?.verse?.surah_no, selectedVerse);
    let verse = useMemo(
      () => getVerse(summary?.verse?.surah_no, selectedVerse),
      [summary?.verse?.surah_no, selectedVerse]
    );

    // verse = verse?.length === 1 ? verse[0] : {};

    const getNoOfVerses = (surah_name) => {
      const s = surah?.find((item) => item.surah_name === surah_name);
      if (s) {
        return s.no_of_verses;
      }
      return 0;
    };

    const addNoOfVerses = (inSummary) => {
      const s = surah?.find(
        (item) => item.surah_name === inSummary?.verse?.surah_name
      );
      if (s) {
        return {
          ...inSummary,
          verse: {
            ...inSummary.verse,
            no_of_verses: s.no_of_verses,
            surahWithNo: s.surah_no + "- " + s.surah_name,
          },
        };
      }
      return inSummary;
    };
    useEffect(() => {
      setSummary(addNoOfVerses(inSummary));
      setSelectedVerse(inSummary?.verse?.verse_no);
    }, [inSummary, surah]);

    const { mutate } = useModifyNarrationSummary();
    const { mutate: addSummary } = useAddNarrationSummary();
    const { mutate: deleteSummary } = useDeleteNarrationSummary();
    const queryClient = useQueryClient();

    const handleChange = (key, newValue) => {
      setSummary({ ...summary, [key]: newValue });
    };
    const flag = useRef(false);
    const status = useRef();

    const handleSurahChange = (data) => {
      const maxNoOfVerses = getNoOfVerses(data.surah_name);
      const verse_no =
        summary.verse?.verse_no <= maxNoOfVerses ? summary.verse?.verse_no : 1;
      const newVerse = findVerse(quran, data.surah_no, verse_no);
      if (!newVerse) {
        toast.error("تغییر مورد نظر انجام نشد");
        return;
      }
      status.current = "isLoading";
      flag.current = "verse";
      setSummary({ ...summary, verse: newVerse });
      mutate(
        {
          narrationId: narration?.id,
          summaryId: summary?.id,
          data: { quran_verse: newVerse.id },
          onSettled: () => {
            queryClient.refetchQueries({
              queryKey: ["narrationIndividual", narration?.id],
            });
          },
        },
        {
          onSuccess: () => {
            status.current = "success";
          },
          onError: () => {
            status.current = "error";
          },
        }
      );
    };

    const handleVerseChange = (key, newValue) => {
      const newVerse = findVerse(
        quran,
        Number(summary.verse?.surah_no),
        Number(newValue)
      );
      if (!newVerse) {
        toast.error("تغییر مورد نظر انجام نشد زیرا چنین آیه ای یافت نشد");
        return;
      }
      status.current = "isLoading";
      flag.current = "verse";
      setSummary({ ...summary, verse: newVerse });
      mutate(
        {
          narrationId: narration?.id,
          summaryId: summary?.id,
          data: { quran_verse: newVerse.id },
          onSettled: () => {
            queryClient.refetchQueries({
              queryKey: ["narrationIndividual", narration?.id],
            });
          },
        },
        {
          onSuccess: () => {
            status.current = "success";
          },
          onError: () => {
            status.current = "error";
          },
        }
      );
    };

    const handleDelete = () => {
      if (!summary?.id && handleCancelNewItem) handleCancelNewItem();
      else
        deleteSummary({
          narrationId: narration?.id,
          summaryId: summary?.id,
        });
    };
    const handleBlur = (key, newValue) => {
      if (
        (!newValue || newValue === " ") &&
        (key === "alphabet" || key === "subject" || key === "sub_subject")
      )
        return;
      status.current = "isLoading";
      flag.current = key;
      let keyForPost = "";
      switch (key) {
        case "subject":
          keyForPost = "subject_1";
          break;
        case "sub_subject":
          keyForPost = "subject_2";
          break;
        default:
          keyForPost = key;
      }
      if (summary?.id)
        mutate(
          {
            narrationId: narration?.id,
            summaryId: summary?.id,
            data: { [keyForPost]: newValue, quran_verse: 0 },
            dataForMutate: { [key]: newValue, quran_verse: 0 },
          },
          {
            onSuccess: () => {
              status.current = "success";
            },
            onError: () => {
              status.current = "error";
            },
          }
        );
      else {
        addSummary(
          {
            narrationId: narration?.id,
            dataForMutate: {
              [key]: newValue,
              quran_verse: 0,
              narration: narration?.id,
            },
            data: {
              [keyForPost]: newValue,
              quran_verse: 0,
              narration: narration?.id,
            },
          },
          {
            onSuccess: () => {
              status.current = "success";
            },
            onError: () => {
              status.current = "error";
            },
          }
        );
      }
    };

    const handleVerseRemove = () => {
      status.current = "isLoading";
      flag.current = "verse";
      mutate(
        {
          narrationId: narration?.id,
          summaryId: summary?.id,
          data: { quran_verse: -1 },
        },
        {
          onSettled: () => {
            queryClient.refetchQueries({
              queryKey: ["narrationIndividual", narration?.id],
            });
          },
          onSuccess: () => {
            status.current = "success";
          },
          onError: () => {
            status.current = "error";
          },
        }
      );
    };

    const smallInputsClassName = isSmallScreen ? "col-span-7" : "col-span-1";
    const mediumInputsClassName = isSmallScreen ? "col-span-7" : "col-span-2";
    const largeInputsClassName = isSmallScreen ? "col-span-7" : "col-span-3";
    const xLargeInputsClassName = isSmallScreen ? "col-span-7" : "col-span-4";

    const maxVerseNo = getNoOfVerses(summary?.verse?.surah_name);

    return (
      <>
        {isFetching && (
          <Stack
            className="rounded-md px-2 absolute bg-orange-300/50 right-2 -top-2 gap-2"
            alignItems={"center"}
            flexDirection={"row"}
          >
            <BiLoader className="w-5 h-5 animate-spin text-orange-500" />
            <span className="text-orange-500 text-md">در حال آپدیت ...</span>
          </Stack>
        )}
        <div className="flex gap-2 items-start">
          <AiFillDelete
            className="cursor-pointer"
            style={{
              height: "30px",
              width: "30px",
            }}
            onClick={() => handleDelete()}
          />
          <div
            style={{
              borderBottom: "1px solid var(--neutral-color-400)",
              marginBottom: "32px",
              paddingBottom: "32px",
            }}
            className="grid gap-4 grid-cols-7 grid-rows-4 w-full"
          >
            <InputWithSuggestionWithDebounceBlur
              suggestions={level1?.sort()}
              className="w-full"
              parentClassName={smallInputsClassName}
              onPressEnter={(e) => handleBlur("alphabet", e.target.value)}
              onBlur={(e) => handleBlur("alphabet", e.target.value)}
              onChange={(e) => {
                handleChange("alphabet", e.target.value);
              }}
              value={summary.alphabet}
              placeholder="سطح 1"
              key={"i0"}
              flag={flag?.current === "alphabet"}
              status={status.current}
              debounceDependency={summary.id}
            />

            <InputWithSuggestionWithDebounceBlur
              suggestions={level2?.sort()}
              parentClassName={smallInputsClassName}
              className="w-full"
              onPressEnter={(e) => handleBlur("subject", e.target.value)}
              onChange={(e) => {
                handleChange("subject", e.target.value);
              }}
              value={summary.subject}
              placeholder="سطح 2"
              onBlur={(e) => handleBlur("subject", e.target.value)}
              key={"i1" + summary.id}
              flag={flag?.current === "subject"}
              status={status.current}
            />

            <InputWithSuggestionWithDebounceBlur
              suggestions={level3?.sort()}
              parentClassName={mediumInputsClassName}
              className="w-full"
              onPressEnter={(e) => handleBlur("sub_subject", e.target.value)}
              onChange={(e) => {
                handleChange("sub_subject", e.target.value);
              }}
              value={summary.sub_subject}
              placeholder="سطح 3"
              onBlur={(e) => handleBlur("sub_subject", e.target.value)}
              key={"i2" + summary.id}
              flag={flag?.current === "sub_subject"}
              status={status.current}
            />

            <InputWithSuggestionWithDebounceBlur
              suggestions={level4?.sort()}
              parentClassName={largeInputsClassName}
              className="w-full"
              onPressEnter={(e) => handleBlur("subject_3", e.target.value)}
              onChange={(e) => {
                handleChange("subject_3", e.target.value);
              }}
              value={summary.subject_3}
              placeholder="سطح 4"
              onBlur={(e) => handleBlur("subject_3", e.target.value)}
              key={"i3" + summary.id}
              flag={flag?.current === "subject_3"}
              status={status.current}
            />

            <InputWithSuggestionWithDebounceBlur
              suggestions={level5?.sort()}
              parentClassName=" col-span-7"
              className="w-full"
              onPressEnter={(e) => handleBlur("subject_4", e.target.value)}
              onChange={(e) => {
                handleChange("subject_4", e.target.value);
              }}
              value={summary.subject_4}
              placeholder="سطح 5"
              onBlur={(e) => handleBlur("subject_4", e.target.value)}
              key={"i4" + summary.id}
              flag={flag?.current === "subject_4"}
              status={status.current}
            />
            <InputWithSuggestionWithDebounceBlur
              parentClassName="col-span-7"
              className="w-full"
              value={summary.expression}
              onBlur={(e) => handleBlur("expression", e.target.value)}
              onPressEnter={(e) => handleBlur("expression", e.target.value)}
              type="text"
              placeholder="عبارت فارسی"
              onChange={(e) => {
                handleChange("expression", e.target.value);
              }}
              flag={flag?.current === "expression"}
              key={"i5" + summary.id}
              status={status.current}
            />
            <InputWithSuggestionWithDebounceBlur
              parentClassName="col-span-7"
              className="w-full"
              value={summary.summary}
              onBlur={(e) => handleBlur("summary", e.target.value)}
              onPressEnter={(e) => handleBlur("summary", e.target.value)}
              type="text"
              placeholder="عبارت عربی"
              onChange={(e) => {
                handleChange("summary", e.target.value);
              }}
              flag={flag?.current === "summary"}
              key={"i6" + summary.id}
              status={status.current}
            />
            <div className={`relative  ${mediumInputsClassName}`}>
              <InputWithSuggestionAutoCompleteWithDebounceBlur
                className={"h-full"}
                value={
                  !summary?.verse
                    ? ""
                    : {
                        ...(summary?.verse ?? {}),
                        title:
                          summary?.verse?.surah_no +
                          "- " +
                          summary?.verse?.surah_name,
                      }
                }
                onChange={(_, newValue) => {
                  if (!newValue) return;

                  handleSurahChange({
                    surah_name: newValue?.surah_name,
                    surah_no: newValue?.surah_no,
                  });
                }}
                suggestions={sortedSurah?.map((surah) => ({
                  ...surah,
                  title: surah.surah_no + "- " + surah.surah_name,
                }))}
                getOptionLabel={(option) => option.title ?? ""}
                placeholder="نام سوره"
                key={"i7" + summary.verse?.surah_no}
              />
              <AiOutlineClose
                color="var(--neutral-color-400)"
                className="absolute left-4 top-3 w-4 h-4 cursor-pointer"
                onClick={() => {
                  setSelectedVerse({});
                  handleVerseRemove();
                }}
              />
            </div>
            <div className={smallInputsClassName}>
              <InputWithSuggestionWithDebounceBlur
                placeholder="شماره آیه"
                className={"w-full"}
                key={
                  "i8" +
                  summary.id +
                  summary?.verse?.verse_no +
                  summary?.verse?.surah_no
                }
                value={selectedVerse}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (
                    (Number(newValue) <= maxVerseNo && Number(newValue) >= 0) ||
                    !newValue
                  )
                    setSelectedVerse(newValue);
                  // handleVerseChange("verse_no", newValue);
                }}
                onBlur={(e) => {
                  const newValue = e.target.value;
                  // setSelectedVerse(newValue);
                  handleVerseChange("verse_no", newValue);
                }}
                type="number"
              />
            </div>

            <InputWithSuggestionWithDebounceBlur
              parentClassName={xLargeInputsClassName}
              className="w-full font-sans"
              value={verse?.verse_content || "متن آیه"}
              disabled
              key={"i9" + summary.id}
              flag={flag?.current === "verse"}
              status={status.current}
            />
          </div>
        </div>
      </>
    );
  },
  isEqual
);

export const NarrationSummaryEditForm = ({
  summaries,
  narration,
  myNarrations,
}) => {
  const { data: ss } = useGetNarrationFilterOptions();

  const uniqueArray3 = (a) => {
    if (!a) return;
    return [...new Set(a)];
  };

  const level1 = uniqueArray3(ss?.map((s) => s.alphabet));
  const level2 = uniqueArray3(ss?.map((s) => s.subject));
  const level3 = uniqueArray3(ss?.map((s) => s.sub_subject));
  const level4 = uniqueArray3(ss?.map((s) => s.subject_3));
  const level5 = uniqueArray3(ss?.map((s) => s.subject_4));

  const queryClient = useQueryClient();

  const { data: quran } = useGetVerse("all", "all");

  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    setShowEmpty(false);
    queryClient.invalidateQueries({
      queryKey: ["filterOptions"],
    });
  }, [summaries, queryClient]);
  const handleAddInputComponent = () => setShowEmpty(true);
  const reversed = [...summaries].reverse();

  const { mutate: addSummary } = useAddNarrationSummary();

  const handleDuplicateSummary = (summary) => {
    if (!summary.subject.trim()) summary.subject = "سطح 2";
    if (!summary.sub_subject.trim()) summary.sub_subject = "سطح 3";

    addSummary(
      {
        data: {
          alphabet: summary.alphabet,
          subject_1: summary.subject,
          subject_2: summary.sub_subject,
          subject_3: summary.subject_3,
          narration: narration?.id,
          expression: summary.expression,
          summary: summary.summary,
          quran_verse: summary?.verse?.id ?? 0,
        },
      },
      {
        onSuccess: () => {
          toast.success("با موفقیت ایجاد شد");
          queryClient.invalidateQueries({
            queryKey: ["narrationIndividual", narration.id],
          });
          setPageNo(1);
          scrollRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        },
        onError: () => {
          toast.error("تغییر مورد نظر انجام نشد");
        },
      }
    );
  };

  const { user } = useSelector((store) => store.user);
  const { isFetching } = useGetNarrationIndividual(
    narration?.id,
    (isSuperAdmin(user) || isTaggerAdmin(user)) && !myNarrations
      ? undefined
      : user
  );

  let { data: surah } = useGetSurah();
  surah = surah || [];
  const sortedSurah = surah?.sort((a, b) => a.surah_no - b.surah_no);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const scrollRef = useRef();

  const pageSize = 20;
  const [pageNo, setPageNo] = useState(1);
  const totalPages = Math.ceil(reversed?.length / pageSize);

  return (
    <ContentContainer
      actionComponent={
        <AiOutlinePlusCircle
          className="w-6 h-6 cursor-pointer"
          color="var(--neutral-color-400)"
          onClick={handleAddInputComponent}
        />
      }
      className="mb-4"
      title="خلاصه‌ها و فهرست"
    >
      <span className="w-0 block h-0" ref={scrollRef}></span>
      {showEmpty && (
        <SingleNarrationSummariesForCreate
          narration={narration}
          ss={ss}
          modalOpen={showEmpty}
          setModalOpen={setShowEmpty}
        />
      )}
      <>
        {totalPages > 1 && (
          <Pagination
            className="!max-w-full mb-8 !overflow-x-hidden !pb-1"
            noOfPages={totalPages}
            selected={pageNo}
            setSelected={setPageNo}
          />
        )}

        {reversed.map((summary, index) => {
          if (index >= (pageNo - 1) * pageSize && index < pageNo * pageSize)
            return (
              <div className="relative" key={index}>
                {/* <Suspense fallback={<div>Loading...</div>} > */}
                <Stack className="!flex-row justify-center !items-start gap-1">
                  <h5 className="text-center">{reversed?.length - index} </h5>
                  <RiGitBranchFill
                    className="w-8 h-8 cursor-pointer hover:bg-green-500/30 rounded p-1"
                    onClick={() => {
                      handleDuplicateSummary(summary);
                    }}
                  />
                </Stack>

                <SingleNarrationSummariesForEdit
                  key={"j" + summary.id}
                  isFetching={isFetching}
                  sortedSurah={sortedSurah}
                  surah={surah}
                  isSmallScreen={isSmallScreen}
                  narration={narration}
                  inSummary={summary}
                  ss={ss}
                  quran={quran}
                  myNarrations={myNarrations}
                  level1={level1}
                  level2={level2}
                  level3={level3}
                  level4={level4}
                  level5={level5}
                />
              </div>
            );
        })}
      </>
    </ContentContainer>
  );
};
