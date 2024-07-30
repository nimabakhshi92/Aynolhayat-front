import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";

import { AiFillDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAddNarrationFootnote,
  useDeleteNarrationFootnote,
  useGetSurah,
  useModifyNarrationFootnote,
} from "../../api/hooks/allHooks";
import { InputWithState } from "../general/InputWithState";
import InputWithSuggestion, { InputWithSuggestionWithDebounceBlur } from "../general/InputWithSuggestion";
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
  const flag = useRef(false)

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
    flag.current = ''
    if (footnote?.id)
      modifyFootnote({
        narrationId: narration?.id,
        footnoteId: footnote?.id,
        data: { [key]: newValue },
      },
        {
          onSuccess: () => {
            flag.current = key
          }
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
        {/* <InputWithState
          value={footnote.expression}
          setValue={(newValue) => handleChange("expression", newValue)}
          type="text"
          placeholder="عبارت"
          onBlur={() => handleBlur("expression", footnote.expression)}
        /> */}

        <InputWithSuggestionWithDebounceBlur
          value={footnote.expression}
          placeholder="عبارت"
          onBlur={(e) => handleBlur("expression", e.target.value)}
          type="text"
          className="w-full"
          onChange={(e) => {
            handleChange("expression", e.target.value);
          }}

          key={"i0" + footnote.id}
          flag={flag?.current === 'expression'}
        />
        <InputWithSuggestionWithDebounceBlur
          value={footnote.explanation}
          placeholder="توضیح"
          onBlur={(e) => handleBlur("explanation", e.target.value)}
          type="text"
          className="w-full"
          onChange={(e) => {
            handleChange("explanation", e.target.value);
          }}

          key={"i1" + footnote.id}
          flag={flag?.current === 'explanation'}
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
