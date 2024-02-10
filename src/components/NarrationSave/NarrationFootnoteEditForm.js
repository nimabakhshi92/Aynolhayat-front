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
const emptyFootnote0 = {
  expression: "",
  explanation: "",
};
export const SingleNarrationFootnoteForEdit = ({
  onInputChange,
  inFootnote,
  narration,
  last,
  handleAddInputComponent,
}) => {
  const [footnote, setFootnote] = useState(inFootnote);
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
      {handleAddInputComponent && footnote.id && (
        <AiOutlinePlusCircle
          className="w-6 h-6 cursor-pointer"
          color="var(--neutral-color-400)"
          onClick={handleAddInputComponent}
        />
      )}
    </div>
  );
};

export const NarrationFootnoteEditForm = ({ narration }) => {
  const [allFootnotes, setAllFootnotes] = useState([]);

  useEffect(() => {
    setAllFootnotes(narration?.footnotes);
  }, [narration]);

  const handleOnInputChange = (index, newValues) => {
    const updatedAllFootnotes = [...allFootnotes];
    updatedAllFootnotes[index] = newValues;
    setAllFootnotes(updatedAllFootnotes);
  };
  const handleAddInputComponent = () => {
    setAllFootnotes([...allFootnotes, emptyFootnote0]);
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
          handleAddInputComponent={
            index === allFootnotes.length - 1 && handleAddInputComponent
          }
          inFootnote={footnote}
          narration={narration}
          onInputChange={(newValues) => handleOnInputChange(index, newValues)}
        />
      ))}
    </ContentContainer>
  );
};
