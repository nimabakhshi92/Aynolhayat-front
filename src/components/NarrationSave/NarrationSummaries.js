import { useEffect, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";
import Dropdown from "../ui/dropdown";
import { InputWithState } from "../general/InputWithState";
import { AiOutlinePlusCircle, AiOutlineClose } from "react-icons/ai";
import { useGetSurah, useGetVerse } from "../../api/hooks/allHooks";
import Input from "../ui/input";

export const SingleNarrationSummaries = ({ onInputChange }) => {
  let { data: surah } = useGetSurah();
  surah = surah || [];
  const sortedSurah = surah?.sort((a, b) => a.surah_no - b.surah_no);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const verseNos = Array.from(
    { length: selectedSurah?.no_of_verses || 1 },
    (_, i) => i + 1
  );
  const [selectedVerse, setSelectedVerse] = useState(1);

  let { data: verse } = useGetVerse(selectedSurah?.surah_no, selectedVerse);
  verse = (verse || [])[0] || {};

  useEffect(() => setSelectedVerse(1), [selectedSurah]);
  const [summary, setSummary] = useState({
    alphabet: "",
    subject_1: "",
    subject_2: "",
    expression: "",
    summary: "",
    surah_no: "",
    verse_no: "",
    verse_content: "",
  });
  const handleChange = (key, newValue) => {
    setSummary({ ...summary, [key]: newValue });
    onInputChange({ ...summary, [key]: newValue });
  };
  return (
    <div
      style={{
        borderBottom: "1px solid var(--neutral-color-400)",
        marginBottom: "32px",
        paddingBottom: "32px",
      }}
      className="grid gap-4 grid-cols-7 grid-rows-2"
    >
      <InputWithState
        value={summary.alphabet}
        setValue={(newValue) => handleChange("alphabet", newValue)}
        type="text"
        placeholder="سطح 1"
      />
      <InputWithState
        value={summary.subject_1}
        setValue={(newValue) => handleChange("subject_1", newValue)}
        type="text"
        placeholder="سطح 2"
      />
      <InputWithState
        value={summary.subject_2}
        setValue={(newValue) => handleChange("subject_2", newValue)}
        type="text"
        placeholder="توضیح من"
      />
      <InputWithState
        className="col-span-2"
        value={summary.expression}
        setValue={(newValue) => handleChange("expression", newValue)}
        type="text"
        placeholder="عبارت فارسی"
      />
      <InputWithState
        className="col-span-2"
        value={summary.summary}
        setValue={(newValue) => handleChange("summary", newValue)}
        type="text"
        placeholder="عبارت عربی"
      />
      <div className="relative col-span-2">
        <Dropdown
          className=""
          selected={selectedSurah}
          setSelected={(newValue) => {
            setSelectedSurah(newValue);
            handleChange("surah_no", newValue?.surah_no);
          }}
          items={sortedSurah?.map((surah) => ({
            ...surah,
            surahWithNo: surah.surah_no + "- " + surah.surah_name,
          }))}
          dataKey="surahWithNo"
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
          handleChange("verse_no", newValue);
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
  );
};

export const AllNarrationSummaries = ({
  allSummaries,
  setAllSummaries,
  emptySummary,
}) => {
  const handleOnInputChange = (index, newValues) => {
    const updatedAllSummaries = [...allSummaries];
    updatedAllSummaries[index] = newValues;
    setAllSummaries(updatedAllSummaries);
  };
  const handleAddInputComponent = () => {
    setAllSummaries([...allSummaries, emptySummary]);
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
      {allSummaries?.map((_, index) => (
        <SingleNarrationSummaries
          onInputChange={(newValues) => handleOnInputChange(index, newValues)}
        />
      ))}
    </ContentContainer>
  );
};
