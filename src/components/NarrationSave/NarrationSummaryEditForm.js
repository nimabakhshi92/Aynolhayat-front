import React, { Suspense, useEffect, useRef, useState } from "react";
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
  useModifyNarrationSummary
} from "../../api/hooks/allHooks";
import { InputWithSuggestionWithDebounceBlur } from "../general/InputWithSuggestion";
import Dropdown from "../ui/dropdown";
import Input from "../ui/input";
import { Stack, useMediaQuery } from "@mui/material";
import { InputWithSuggestionAutoCompleteWithDebounceBlur } from "../general/InputWithSuggestionAutoComplete";
import { BiLoader } from "react-icons/bi";
import { isSuperAdmin, isTaggerAdmin } from "../../utils/acl";
import { useSelector } from "react-redux";

const findVerse = (quran, surah_no, verse_no) => {
  const newVerse = quran.find(
    (verse) => verse.surah_no === surah_no && verse.verse_no === verse_no
  );
  return newVerse;
};

export const SingleNarrationSummariesForEdit = ({
  inSummary,
  narration,
  handleCancelNewItem,
  ss,
  quran,
  myNarrations
}) => {
  const { user } = useSelector((store) => store.user);

  const getVerse = (surah_no, verse_no) => {
    return quran?.find(surahVerse => {
      return surahVerse.surah_no === surah_no && surahVerse.verse_no === verse_no
    })
  }

  const { isFetching } = useGetNarrationIndividual(narration?.id,
    ((isSuperAdmin(user) || isTaggerAdmin(user)) && !myNarrations) ? undefined : user

  )

  let { data: surah } = useGetSurah();
  surah = surah || [];
  const sortedSurah = surah?.sort((a, b) => a.surah_no - b.surah_no);
  const [selectedSurah, setSelectedSurah] = useState(null);
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
  const [selectedVerse, setSelectedVerse] = useState(summary?.verse?.verse_no);

  // let { data: verse } = useGetVerse(summary?.verse?.surah_no, selectedVerse);
  let verse = getVerse(summary?.verse?.surah_no, selectedVerse);
  // verse = verse?.length === 1 ? verse[0] : {};

  const getNoOfVerses = (surah_name) => {
    const s = surah?.find((item) => item.surah_name === surah_name);
    if (s) {
      return s.no_of_verses;
    }
    return 0;
  };
  const verseNos = Array.from(
    { length: getNoOfVerses(summary?.verse?.surah_name) || 0 },
    (_, i) => i + 1
  );

  function uniqueArray3(a) {
    function onlyUnique(value, index, self) {
      return self?.indexOf(value) === index;
    }

    // usage
    var unique = a?.filter(onlyUnique); // returns ['a', 1, 2, '1']

    return unique;
  }

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

  const level1 = uniqueArray3(ss?.map((s) => s.alphabet));
  const level2 = uniqueArray3(ss?.map((s) => s.subject));
  const level3 = uniqueArray3(ss?.map((s) => s.sub_subject));
  const level4 = uniqueArray3(ss?.map((s) => s.subject_3));
  const level5 = uniqueArray3(ss?.map((s) => s.subject_4));
  const { mutate } = useModifyNarrationSummary();
  const { mutate: addSummary } = useAddNarrationSummary();
  const { mutate: deleteSummary } = useDeleteNarrationSummary();
  const queryClient = useQueryClient();

  const handleChange = (key, newValue) => {
    setSummary({ ...summary, [key]: newValue });
  };
  const flag = useRef(false)
  const status = useRef()


  const handleSurahChange = (data) => {
    const maxNoOfVerses = getNoOfVerses(data.surah_name);
    const verse_no =
      summary.verse?.verse_no <= maxNoOfVerses ? summary.verse?.verse_no : 1;
    const newVerse = findVerse(quran, data.surah_no, verse_no);
    if (!newVerse) {
      toast.error("تغییر مورد نظر انجام نشد");
      return;
    }
    status.current = 'isLoading'
    flag.current = 'verse'
    setSummary({ ...summary, verse: newVerse });
    mutate({
      narrationId: narration?.id,
      summaryId: summary?.id,
      data: { quran_verse: newVerse.id },
      onSettled: () => {
        queryClient.refetchQueries({
          queryKey: [
            "narrationIndividual",
            narration?.id,
          ]
        });
      },
    },
      {
        onSuccess: () => {
          status.current = 'success'
        },
        onError: () => {
          status.current = 'error'
        }
      }
    );
  };


  const handleVerseChange = (key, newValue) => {
    const newVerse = findVerse(quran, Number(summary.verse?.surah_no), Number(newValue));
    if (!newVerse) {
      toast.error("تغییر مورد نظر انجام نشد زیرا چنین آیه ای یافت نشد");
      return;
    }
    status.current = 'isLoading'
    flag.current = 'verse'
    setSummary({ ...summary, verse: newVerse });
    mutate({
      narrationId: narration?.id,
      summaryId: summary?.id,
      data: { quran_verse: newVerse.id },
      onSettled: () => {
        queryClient.refetchQueries({
          queryKey: [
            "narrationIndividual",
            narration?.id,
          ]
        })
      },
    },
      {
        onSuccess: () => {
          status.current = 'success'
        },
        onError: () => {
          status.current = 'error'
        }
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
      (!newValue || newValue == ' ') &&
      (key === "alphabet" || key === "subject" || key === "sub_subject")
    )
      return;
    status.current = 'isLoading'
    flag.current = key
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
      mutate({
        narrationId: narration?.id,
        summaryId: summary?.id,
        data: { [keyForPost]: newValue, quran_verse: 0 },
        dataForMutate: { [key]: newValue, quran_verse: 0 },
      },
        {
          onSuccess: () => {
            status.current = 'success'
          },
          onError: () => {
            status.current = 'error'
          }
        }
      );
    else {
      addSummary({
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
      }
        , {
          onSuccess: () => {
            status.current = 'success'
          },
          onError: () => {
            status.current = 'error'
          }
        }

      );
    }
  }

  const handleVerseRemove = () => {
    status.current = 'isLoading'
    flag.current = 'verse'
    mutate({
      narrationId: narration?.id,
      summaryId: summary?.id,
      data: { quran_verse: -1 },
    }, {
      onSettled: () => {
        queryClient.refetchQueries({
          queryKey: [
            "narrationIndividual",
            narration?.id,
          ]
        })
      },
      onSuccess: () => {
        status.current = 'success'
      },
      onError: () => {
        status.current = 'error'
      }
    });
  };

  const smallInputsClassName = isSmallScreen ? 'col-span-7' : 'col-span-1'
  const mediumInputsClassName = isSmallScreen ? 'col-span-7' : 'col-span-2'
  const largeInputsClassName = isSmallScreen ? 'col-span-7' : 'col-span-3'
  const xLargeInputsClassName = isSmallScreen ? 'col-span-7' : 'col-span-4'

  const maxVerseNo = getNoOfVerses(summary?.verse?.surah_name)
  return (
    <>
      {isFetching && (
        <Stack className="rounded-md px-2 absolute bg-orange-300/50 right-2 -top-2 gap-2" alignItems={'center'} flexDirection={'row'}>
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
            onChange={(e) => {
              handleChange("alphabet", e.target.value);
            }}
            value={summary.alphabet}
            placeholder="سطح 1"
            onBlur={(e) => handleBlur("alphabet", e.target.value)}

            key={"i0"}
            flag={flag?.current === 'alphabet'}
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
            flag={flag?.current === 'subject'}
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
            flag={flag?.current === 'sub_subject'}
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
            flag={flag?.current === 'subject_3'}
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
            flag={flag?.current === 'subject_4'}
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
              handleChange("expression", e.target.value)
            }}
            flag={flag?.current === 'expression'}
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
              handleChange("summary", e.target.value)
            }}
            flag={flag?.current === 'summary'}
            key={"i6" + summary.id}
            status={status.current}
          />
          <div className={`relative  ${mediumInputsClassName}`}>
            <InputWithSuggestionAutoCompleteWithDebounceBlur
              className={'h-full'}
              value={(!summary?.verse) ? '' : {
                ...(summary?.verse ?? {}), title:
                  summary?.verse?.surah_no + "- " + summary?.verse?.surah_name
              }}
              onChange={(_, newValue) => {
                if (!newValue)
                  return

                handleSurahChange({
                  surah_name: newValue?.surah_name,
                  surah_no: newValue?.surah_no,
                });
              }}
              suggestions={sortedSurah?.map((surah) => ({
                ...surah,
                title: surah.surah_no + "- " + surah.surah_name,
              }))}
              getOptionLabel={(option) => option.title ?? ''}
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
          <div className={smallInputsClassName}          >
            <InputWithSuggestionWithDebounceBlur
              placeholder="شماره آیه"
              className={'w-full'}
              key={"i8" + summary.id + summary?.verse?.verse_no + summary?.verse?.surah_no}
              value={selectedVerse}
              onChange={(e) => {
                const newValue = e.target.value
                if (
                  (Number(newValue) <= maxVerseNo &&
                    Number(newValue) >= 0)
                  || !newValue
                )
                  setSelectedVerse(newValue);
                // handleVerseChange("verse_no", newValue);
              }}
              onBlur={(e) => {
                const newValue = e.target.value
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
            flag={flag?.current === 'verse'}
            status={status.current}
          />
        </div>
      </div>
    </>
  );
};

export const NarrationSummaryEditForm = ({ summaries, narration, myNarrations }) => {
  const { data: ss } = useGetNarrationFilterOptions();
  const queryClient = useQueryClient();
  let { data: surah } = useGetSurah();
  surah = surah || [];

  const { data: quran } = useGetVerse("all", "all");

  const [showEmpty, setShowEmpty] = useState(false);
  const emptySummary0 = {
    alphabet: "",
    subject: "",
    sub_subject: "",
    subject_3: "",
    subject_4: "",
    expression: "",
    summary: "",
    surah_no: "",
    verse_no: "",
    verse_content: "",
  };

  const [emptySummary, setEmptySummary] = useState(emptySummary0);

  useEffect(() => {
    setShowEmpty(false);
    setEmptySummary(emptySummary0);
    queryClient.invalidateQueries({
      queryKey: ["filterOptions"],
    });
  }, [summaries]);
  const handleAddInputComponent = () => setShowEmpty(true);
  const reversed = [...summaries].reverse();

  const handleCancelNewItem = () => {
    setShowEmpty(false);
    setEmptySummary(emptySummary0);
  };
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
      {showEmpty && (
        <SingleNarrationSummariesForEdit
          narration={narration}
          inSummary={emptySummary}
          handleCancelNewItem={handleCancelNewItem}
          ss={ss}
          key={-1}
          quran={quran}
          myNarrations={myNarrations}
        />
      )}
      {reversed.map((summary, index) => {
        return (
          <div className="relative">
            {/* <Suspense fallback={<div>Loading...</div>} > */}
            <h5 className="text-center">{reversed?.length - index} </h5>
            <SingleNarrationSummariesForEdit
              // key={index + "j" + summary.id}
              key={"j" + summary.id}
              narration={narration}
              inSummary={summary}
              ss={ss}
              quran={quran}
              myNarrations={myNarrations}
            // onInputChange={(newValues) => handleOnInputChange(index, newValues)}
            />
            {/* </Suspense> */}
          </div>
        );
      })}
    </ContentContainer>
  );
};
