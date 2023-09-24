import { useEffect, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";
import Dropdown from "../ui/dropdown";
import { InputWithState } from "../general/InputWithState";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import { useGetSurah, useGetVerse } from "../../api/hooks/allHooks";
import Input from "../ui/input";

export const SingleNarrationFootnotes = ({ onInputChange }) => {
  const [footnote, setFootnote] = useState({
    expression: "",
    explanation: "",
  });
  const handleChange = (key, newValue) => {
    setFootnote({ ...footnote, [key]: newValue });
    onInputChange({ ...footnote, [key]: newValue });
  };
  return (
    <div
      style={{
        borderBottom: "1px solid var(--neutral-color-400)",
        marginBottom: "32px",
        paddingBottom: "32px",
      }}
      className="grid gap-4 grid-cols-2"
    >
      <InputWithState
        value={footnote.expression}
        setValue={(newValue) => handleChange("expression", newValue)}
        type="text"
        placeholder="عبارت"
      />
      <InputWithState
        value={footnote.explanation}
        setValue={(newValue) => handleChange("explanation", newValue)}
        type="text"
        placeholder="توضیح"
      />
    </div>
  );
};

export const AllNarrationFootnotes = ({
  allFootnotes,
  setAllFootnotes,
  emptyFootnote,
}) => {
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
      {allFootnotes?.map((_, index) => (
        <SingleNarrationFootnotes
          key={index}
          onInputChange={(newValues) => handleOnInputChange(index, newValues)}
        />
      ))}
    </ContentContainer>
  );
};
