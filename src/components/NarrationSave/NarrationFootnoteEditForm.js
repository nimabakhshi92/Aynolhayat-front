import { useEffect, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";

import { AiFillDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { useQueryClient } from "react-query";
import {
  useAddNarrationFootnote,
  useDeleteNarrationFootnote,
  useGetSurah,
  useModifyNarrationFootnote,
} from "../../api/hooks/allHooks";
import { InputWithState } from "../general/InputWithState";

export const SingleNarrationFootnoteForEdit = ({
  onInputChange,
  inFootnote,
  narration,
}) => {
  const [footnote, setFootnote] = useState({ inFootnote });
  useEffect(() => {
    setFootnote(inFootnote);
  }, [inFootnote]);

  const handleChange = (key, newValue) => {
    setFootnote({ ...footnote, [key]: newValue });
    onInputChange({ ...footnote, [key]: newValue });
  };

  const { mutate: modifyFootnote } = useModifyNarrationFootnote();
  const { mutate: addFootnote } = useAddNarrationFootnote();
  const { mutate: deleteFootnote } = useDeleteNarrationFootnote();

  const handleDelete = () => {
    deleteFootnote({
      narrationId: narration?.id,
      footnoteId: footnote?.id,
    });
  };

  const handleBlur = (key, newValue) => {
    if (footnote?.id)
      modifyFootnote({
        narrationId: narration?.id,
        footnoteId: footnote?.id,
        data: { [key]: newValue },
      });
    else {
      addFootnote({
        narrationId: narration?.id,
        data: {
          [key]: newValue,
          narration: narration?.id,
        },
      });
    }
  };
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
          width: "100%",
        }}
        className="grid gap-4 grid-cols-2"
      >
        <InputWithState
          value={footnote.expression}
          setValue={(newValue) => handleChange("expression", newValue)}
          type="text"
          placeholder="عبارت"
          onBlur={() => handleBlur("expression", footnote.expression)}
        />
        <InputWithState
          value={footnote.explanation}
          setValue={(newValue) => handleChange("explanation", newValue)}
          type="text"
          placeholder="توضیح"
          onBlur={() => handleBlur("explanation", footnote.explanation)}
        />
      </div>
    </div>
  );
};

export const NarrationFootnoteEditForm = ({ narration }) => {
  const [allFootnotes, setAllFootnotes] = useState([]);
  const [updatedNarration, setUpdatedNarration] = useState({});
  useEffect(() => {
    setAllFootnotes(narration?.footnotes);
  }, [narration]);
  const emptyFootnote = {
    expression: "",
    explanation: "",
  };
  const handleOnInputChange = (index, newValues) => {
    const updatedAllFootnotes = [...allFootnotes];
    updatedAllFootnotes[index] = newValues;
    setAllFootnotes(updatedAllFootnotes);
  };
  const handleAddInputComponent = () => {
    setAllFootnotes([...allFootnotes, emptyFootnote]);
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
      title="پاورقی"
    >
      {allFootnotes?.map((footnote, index) => (
        <SingleNarrationFootnoteForEdit
          key={index}
          inFootnote={footnote}
          narration={narration}
          onInputChange={(newValues) => handleOnInputChange(index, newValues)}
        />
      ))}
    </ContentContainer>
  );
};

// export const NarrationFootnoteEditForm1 = ({ narration }) => {
//   let { data: surah } = useGetSurah();
//   const queryClient = useQueryClient();
//   surah = surah || [];

//   const emptySummary = {
//     alphabet: "",
//     subject: "",
//     sub_subject: "",
//     // subject_1: "",
//     // subject_2: "",
//     expression: "",
//     summary: "",
//     surah_no: "",
//     verse_no: "",
//     verse_content: "",
//   };
//   const [updatedNarration, setUpdatedNarration] = useState({});
//   useEffect(() => {
//     const cst = narration?.content_summary_tree?.map((c) => {
//       const s = surah?.find((item) => item.surah_name === c?.verse?.surah_name);
//       if (s) {
//         return {
//           ...c,
//           verse: {
//             ...c.verse,
//             no_of_verses: s.no_of_verses,
//             surahWithNo: s.surah_no + "- " + s.surah_name,
//           },
//         };
//       } else return c;
//     });

//     setUpdatedNarration({ ...narration, content_summary_tree: cst });
//   }, [narration]);

//   const handleOnInputChange = (index, newValues) => {
//     const updatedContentSummaryTree = updatedNarration.content_summary_tree;
//     updatedContentSummaryTree[index] = newValues;
//     setUpdatedNarration({
//       ...updatedNarration,
//       content_summary_tree: updatedContentSummaryTree,
//     });
//   };
//   const handleAddInputComponent = () => {
//     const newSummaryTree = [...updatedNarration.content_summary_tree];
//     newSummaryTree.unshift(emptySummary);
//     setUpdatedNarration({
//       ...updatedNarration,
//       content_summary_tree: newSummaryTree,
//     });
//     // queryClient.setQueryData(["narrationIndividual", narration.id], {
//     //   ...updatedNarration,
//     //   content_summary_tree: newSummaryTree,
//     // });
//   };

//   return (
//     <ContentContainer
//       actionComponent={
//         <AiOutlinePlusCircle
//           className="w-6 h-6 cursor-pointer"
//           color="var(--neutral-color-400)"
//           onClick={handleAddInputComponent}
//         />
//       }
//       className="mb-4"
//       title="خلاصه‌ها و فهرست"
//     >
//       {updatedNarration?.content_summary_tree?.map((summary, index) => {
//         return (
//           <SingleNarrationSummariesForEdit
//             key={index}
//             narration={narration}
//             inSummary={summary}
//             onInputChange={(newValues) => handleOnInputChange(index, newValues)}
//           />
//         );
//       })}
//     </ContentContainer>
//   );
// };

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
