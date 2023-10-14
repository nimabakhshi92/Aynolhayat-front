import { useEffect, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";

import { InputWithState } from "../general/InputWithState";
import {
  AiFillDelete,
  AiOutlineClose,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import {
  useAddNarrationSummary,
  useDeleteNarrationSummary,
  useGetNarrationFilterOptions,
  useGetSummaryTree,
  useGetSurah,
  useGetVerse,
  useModifyNarrationSummary,
} from "../../api/hooks/allHooks";
import Dropdown from "../ui/dropdown";
import Input from "../ui/input";
import { useQueryClient } from "react-query";
import InputWithSuggestion from "../general/InputWithSuggestion";

export const SingleNarrationSummariesForEdit = ({
  inSummary,
  narration,
  handleCancelNewItem,
  ss,
}) => {
  const queryClient = useQueryClient();
  let { data: surah } = useGetSurah();
  surah = surah || [];
  const sortedSurah = surah?.sort((a, b) => a.surah_no - b.surah_no);
  const [selectedSurah, setSelectedSurah] = useState(null);

  const emptySummary = {
    alphabet: "",
    // subject: "",
    // sub_subject: "",
    subject_1: "",
    subject_2: "",
    expression: "",
    summary: "",
    surah_no: "",
    verse_no: "",
    verse_content: "",
  };
  const [summary, setSummary] = useState({
    alphabet: "",
    subject: "",
    sub_subject: "",
    // subject_1: "",
    // subject_2: "",
    expression: "",
    summary: "",
    verse: {
      surah_no: "",
      verse_no: "",
      verse_content: "",
    },
  });
  const [selectedVerse, setSelectedVerse] = useState(summary?.verse?.verse_no);

  let { data: verse } = useGetVerse(summary?.verse?.surah_no, selectedVerse);
  verse = verse?.length === 1 ? verse[0] : {};
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

  console.log(verse);
  const getSurah = (selectedSurah) => {
    const s = surah?.find(
      (item) => item.surah_name === selectedSurah?.surah_name
    );
    if (s) {
      selectedSurah.no_of_verses = s.no_of_verses;
      selectedSurah.surahWithNo = s.surah_no + "- " + selectedSurah.surah_name;
    }
    return selectedSurah;
  };

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
    // queryClient.invalidateQueries("");
  }, [inSummary]);

  const level1 = uniqueArray3(ss?.map((s) => s.alphabet));
  const level2 = uniqueArray3(ss?.map((s) => s.subject));
  const level3 = uniqueArray3(ss?.map((s) => s.sub_subject));
  const { mutate } = useModifyNarrationSummary();
  const { mutate: addSummary } = useAddNarrationSummary();
  const { mutate: deleteSummary } = useDeleteNarrationSummary();

  const handleChange = (key, newValue) => {
    setSummary({ ...summary, [key]: newValue });
    // onInputChange({ ...summary, [key]: newValue });
  };

  const handleSurahChange = (data) => {
    setSummary({ ...summary, verse: { ...summary.verse, ...data } });
  };

  const handleVerseChange = (key, newValue) => {
    setSummary({ ...summary, verse: { ...summary.verse, [key]: newValue } });
    // onInputChange({ ...summary, verse: { ...summary.verse, [key]: newValue } });
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
    if (!newValue) return;
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
      });
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
      });
    }
  };
  const handleVerseBlur = () => {
    mutate({
      narrationId: narration?.id,
      summaryId: summary?.id,
      data: { quran_verse: verse.id },
    });
  };
  useEffect(() => {
    if (
      verse.id &&
      narration?.id &&
      summary?.id &&
      summary?.verse?.surah_name &&
      summary?.verse?.verse_no > 0
    )
      handleVerseBlur();
  }, [verse]);

  // useEffect(() => setSelectedSurah(getSurah(selectedSurah)), [narration]);
  // useEffect(() => {
  // const ss = getSurah(inSummary.verse);
  // setSummary({ ...inSummary, verse: ss });
  //   setSummary(inSummary);
  // }, [inSummary]);
  // useEffect(() => setSelectedVerse(1), [inSummary?.verse?.surah_name]);
  // useEffect(() => {
  //   if (verse?.id) {
  //     handleVerseBlur();
  //   }
  // }, [verse?.id]);
  console.log(selectedVerse);
  return (
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
        className="grid gap-4 grid-cols-7 grid-rows-2"
      >
        <InputWithSuggestion
          suggestions={level1?.sort()}
          className="w-full"
          onPressEnter={(e) => handleBlur("alphabet", e.target.value)}
          onChange={(e) => {
            handleChange("alphabet", e.target.value);
          }}
          value={summary.alphabet}
          placeholder="سطح 1"
          onBlur={(e) => handleBlur("alphabet", e.target.value)}
        />

        <InputWithSuggestion
          suggestions={level2?.sort()}
          className="w-full"
          onPressEnter={(e) => handleBlur("subject", e.target.value)}
          onChange={(e) => {
            handleChange("subject", e.target.value);
          }}
          value={summary.subject}
          placeholder="سطح 2"
          onBlur={(e) => handleBlur("subject", e.target.value)}
        />

        <InputWithSuggestion
          suggestions={level3?.sort()}
          className="w-full"
          onPressEnter={(e) => handleBlur("sub_subject", e.target.value)}
          onChange={(e) => {
            handleChange("sub_subject", e.target.value);
          }}
          value={summary.sub_subject}
          placeholder="توضیح من"
          onBlur={(e) => handleBlur("sub_subject", e.target.value)}
        />

        <InputWithState
          className="col-span-2"
          value={summary.expression}
          setValue={(newValue) => handleChange("expression", newValue)}
          onBlur={() => handleBlur("expression", summary.expression)}
          type="text"
          placeholder="عبارت فارسی"
        />
        <InputWithState
          className="col-span-2"
          value={summary.summary}
          setValue={(newValue) => handleChange("summary", newValue)}
          onBlur={() => handleBlur("summary", summary.summary)}
          type="text"
          placeholder="عبارت عربی"
        />
        <div className="relative col-span-2">
          <Dropdown
            className=""
            selected={summary?.verse}
            setSelected={(newValue) => {
              // setSelectedSurah(newValue);
              handleSurahChange({
                surah_name: newValue?.surah_name,
                surah_no: newValue?.surah_no,
              });
              // handleVerseChange();
              // handleVerseBlur();
            }}
            items={sortedSurah?.map((surah) => ({
              ...surah,
              surahWithNo: surah.surah_no + "- " + surah.surah_name,
            }))}
            dataKey="surah_name"
            placeholder="نام سوره"
          />
          <AiOutlineClose
            color="var(--neutral-color-400)"
            className="absolute left-8 top-3 w-4 h-4 cursor-pointer"
            onClick={() => setSelectedSurah(null)}
          />
        </div>
        <Dropdown
          selected={selectedVerse}
          setSelected={(newValue) => {
            setSelectedVerse(newValue);
            handleVerseChange("verse_no", newValue);
          }}
          items={verseNos}
          placeholder="شماره آیه"
        />
        <Input
          className="col-span-4"
          type="text"
          placeholder={verse?.verse_content || "متن آیه"}
          disabled={true}
        />
      </div>
    </div>
  );
};

export const NarrationSummaryEditForm = ({ summaries, narration }) => {
  const { data: ss } = useGetNarrationFilterOptions();
  const queryClient = useQueryClient();
  let { data: surah } = useGetSurah();
  surah = surah || [];

  const [showEmpty, setShowEmpty] = useState(false);
  const emptySummary0 = {
    alphabet: "",
    subject: "",
    sub_subject: "",
    // subject_1: "",
    // subject_2: "",
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
    queryClient.invalidateQueries("filterOptions");
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
        />
      )}
      {reversed.map((summary, index) => {
        return (
          <SingleNarrationSummariesForEdit
            key={index}
            narration={narration}
            inSummary={summary}
            ss={ss}
            // onInputChange={(newValues) => handleOnInputChange(index, newValues)}
          />
        );
      })}
    </ContentContainer>
  );
};
