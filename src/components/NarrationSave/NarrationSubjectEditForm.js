import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";
import Dropdown from "../ui/dropdown";
import Input from "../ui/input";
import {
  useGetBooks,
  useGetImam,
  useGetSubjects,
  useModifyNarrationInfo,
  useAddNarrationSubject,
  useDeleteNarrationSubject,
} from "../../api/hooks/allHooks";
import InputWithSuggestion from "../general/InputWithSuggestion";
import { AiOutlinePlus } from "react-icons/ai";
import Tag from "../ui/tag";

export const NarrationSubjectEditForm = ({ narration }) => {
  const [updatedNarration, setUpdatedNarration] = useState({});
  const newSubject = useRef();

  let { data: subject } = useGetSubjects();
  subject = subject?.subjects || [];

  const { mutate } = useAddNarrationSubject();
  const { mutate: deleteSubject } = useDeleteNarrationSubject();

  const handleAdd = (fieldValue) => {
    mutate({
      narrationId: narration?.id,
      data: { subject: fieldValue, narration: narration?.id },
    });
  };

  const handleDelete = (subjectId) =>
    deleteSubject({ narrationId: narration?.id, subjectId });

  useEffect(() => {
    setUpdatedNarration(narration);
  }, [narration]);

  return (
    <ContentContainer className="mb-4" title="موضوعات مرتبط با حدیث">
      <div className="flex items-center ">
        <InputWithSuggestion
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            width: "250px",
          }}
          reference={newSubject}
          placeholder="موضوع اضافه کنید"
          suggestions={subject}
          onPressEnter={() => {
            handleAdd(newSubject.current?.value);
            newSubject.current.value = "";
          }}
        />
        <div
          className="flex hover:opacity-[0.75] cursor-pointer items-center justify-center w-10 h-10"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "white",
            fontSize: "30px",
            fontWeight: 400,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
          onClick={() => {
            handleAdd(newSubject.current?.value);
            newSubject.current.value = "";
          }}
        >
          <AiOutlinePlus />
        </div>
      </div>
      <div
        className="mt-6 flex gap-4 items-start"
        style={{
          flexWrap: "wrap",
        }}
      >
        {updatedNarration?.subjects?.map((subject, index) => {
          return (
            <Tag
              onClose={() => handleDelete(subject.id)}
              key={index}
              tag={subject.subject}
            />
          );
        })}
      </div>
    </ContentContainer>
  );
};
