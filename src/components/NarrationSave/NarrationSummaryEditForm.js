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
  onInputChange,
  narration,
}) => {
  let { data: surah } = useGetSurah();
  surah = surah || [];
  const sortedSurah = surah?.sort((a, b) => a.surah_no - b.surah_no);
  const [selectedSurah, setSelectedSurah] = useState(null);
  // const verseNos = Array.from(
  //   { length: selectedSurah?.no_of_verses || 1 },
  //   (_, i) => i + 1
  // );
  const verseNos = Array.from(
    { length: inSummary?.verse?.no_of_verses || 1 },
    (_, i) => i + 1
  );

  const [selectedVerse, setSelectedVerse] = useState(1);

  let { data: verse } = useGetVerse(inSummary?.verse?.surah_no, selectedVerse);
  verse = (verse || [])[0] || {};
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
    surah_no: "",
    verse_no: "",
    verse_content: "",
  });

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

  const { data: ss } = useGetNarrationFilterOptions();
  const level1 = uniqueArray3(ss?.map((s) => s.alphabet));
  const level2 = uniqueArray3(ss?.map((s) => s.subject));
  const level3 = uniqueArray3(ss?.map((s) => s.sub_subject));
  const { mutate } = useModifyNarrationSummary();
  const { mutate: addSummary } = useAddNarrationSummary();
  const { mutate: deleteSummary } = useDeleteNarrationSummary();

  const handleChange = (key, newValue) => {
    setSummary({ ...summary, [key]: newValue });
    onInputChange({ ...summary, [key]: newValue });
  };

  const handleVerseChange = (key, newValue) => {
    setSummary({ ...summary, verse: { ...summary.verse, [key]: newValue } });
    // onInputChange({ ...summary, verse: { ...summary.verse, [key]: newValue } });
  };

  const handleDelete = () => {
    deleteSummary({
      narrationId: narration?.id,
      summaryId: summary?.id,
    });
  };

  const handleBlur = (key, newValue) => {
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
      });
    else {
      addSummary({
        narrationId: narration?.id,
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

  // useEffect(() => setSelectedSurah(getSurah(selectedSurah)), [narration]);
  useEffect(() => {
    // const ss = getSurah(inSummary.verse);
    // setSummary({ ...inSummary, verse: ss });
    setSummary(inSummary);
  }, [inSummary]);
  // useEffect(() => setSelectedVerse(1), [inSummary?.verse?.surah_name]);
  // useEffect(() => {
  //   if (verse?.id) {
  //     handleVerseBlur();
  //   }
  // }, [verse?.id]);
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
        {/* <InputWithState
          value={summary.alphabet}
          setValue={(newValue) => handleChange("alphabet", newValue)}
          onBlur={() => handleBlur("alphabet", summary.alphabet)}
          type="text"
          placeholder="سطح 1"
        /> */}
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
        {/* <InputWithState
          value={summary.subject}
          setValue={(newValue) => handleChange("subject", newValue)}
          onBlur={() => handleBlur("subject", summary.subject)}
          type="text"
          placeholder="سطح 2"
        /> */}
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
        {/* <InputWithState
          value={summary.sub_subject}
          setValue={(newValue) => handleChange("sub_subject", newValue)}
          onBlur={() => handleBlur("sub_subject", summary.sub_subject)}
          type="text"
          placeholder="توضیح من"
        /> */}
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
              handleVerseChange("surah_name", newValue?.surah_name);
              handleVerseChange("surah_no", newValue?.surah_no);
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

export const NarrationSummaryEditForm = ({ narration }) => {
  let { data: surah } = useGetSurah();
  const queryClient = useQueryClient();
  surah = surah || [];

  const emptySummary = {
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
  const [updatedNarration, setUpdatedNarration] = useState({});
  useEffect(() => {
    const cst = narration?.content_summary_tree?.map((c) => {
      const s = surah?.find((item) => item.surah_name === c?.verse?.surah_name);
      if (s) {
        return {
          ...c,
          verse: {
            ...c.verse,
            no_of_verses: s.no_of_verses,
            surahWithNo: s.surah_no + "- " + s.surah_name,
          },
        };
      } else return c;
    });

    setUpdatedNarration({ ...narration, content_summary_tree: cst });
  }, [narration]);

  const handleOnInputChange = (index, newValues) => {
    const updatedContentSummaryTree = updatedNarration.content_summary_tree;
    updatedContentSummaryTree[index] = newValues;
    setUpdatedNarration({
      ...updatedNarration,
      content_summary_tree: updatedContentSummaryTree,
    });
  };
  const handleAddInputComponent = () => {
    const newSummaryTree = [...updatedNarration.content_summary_tree];
    newSummaryTree.unshift(emptySummary);
    setUpdatedNarration({
      ...updatedNarration,
      content_summary_tree: newSummaryTree,
    });
    // queryClient.setQueryData(["narrationIndividual", narration.id], {
    //   ...updatedNarration,
    //   content_summary_tree: newSummaryTree,
    // });
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
      {updatedNarration?.content_summary_tree?.map((summary, index) => {
        return (
          <SingleNarrationSummariesForEdit
            key={index}
            narration={narration}
            inSummary={summary}
            onInputChange={(newValues) => handleOnInputChange(index, newValues)}
          />
        );
      })}
    </ContentContainer>
  );
};

// export const NarrationSubjectEditForm = ({ narration }) => {
//   const [updatedNarration, setUpdatedNarration] = useState({});
//   const newSubject = useRef();

//   let { data: subject } = useGetSubjects();
//   subject = subject?.subjects || [];

//   const { mutate } = useAddNarrationSubject();
//   const { mutate: deleteSubject } = useDeleteNarrationSubject();

//   const handleAdd = (fieldValue) => {
//     mutate({
//       narrationId: narration?.id,
//       data: { subject: fieldValue, narration: narration?.id },
//     });
//   };

//   const handleDelete = (subjectId) =>
//     deleteSubject({ narrationId: narration?.id, subjectId });

//   useEffect(() => {
//     setUpdatedNarration(narration);
//   }, [narration]);

//   return (
//     <ContentContainer className="mb-4" title="موضوعات مرتبط با حدیث">
//       <div className="flex items-center">
//         <InputWithSuggestion
//           style={{
//             borderTopLeftRadius: 0,
//             borderBottomLeftRadius: 0,
//             width: "250px",
//           }}
//           reference={newSubject}
//           placeholder="موضوع اضافه کنید"
//           suggestions={subject}
//           onPressEnter={() => {
//             handleAdd(newSubject.current?.value);
//             newSubject.current.value = "";
//           }}
//         />
//         <div
//           className="flex hover:opacity-[0.75] cursor-pointer items-center justify-center w-10 h-10"
//           style={{
//             backgroundColor: "var(--primary-color)",
//             color: "white",
//             fontSize: "30px",
//             fontWeight: 400,
//             borderTopLeftRadius: 8,
//             borderBottomLeftRadius: 8,
//           }}
//           onClick={() => {
//             handleAdd(newSubject.current?.value);
//             newSubject.current.value = "";
//           }}
//         >
//           <AiOutlinePlus />
//         </div>
//       </div>
//       <div className="mt-6 flex gap-4 items-start">
//         {updatedNarration?.subjects?.map((subject, index) => {
//           return (
//             <Tag
//               onClose={() => handleDelete(subject.id)}
//               key={index}
//               tag={subject.subject}
//             />
//           );
//         })}
//       </div>
//     </ContentContainer>
//   );
// };
