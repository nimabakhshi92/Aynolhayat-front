import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "../components/general/ContentContainer";
import Input from "../components/ui/input";
import Tag from "../components/ui/tag";
import { AiOutlinePlus, AiOutlinePlusCircle } from "react-icons/ai";
import Dropdown from "../components/ui/dropdown";
import {
  useGetBooks,
  useGetImam,
  useGetNarrationIndividual,
  useGetSubjects,
  useGetSurah,
  useGetVerse,
} from "../api/hooks/allHooks";
import InputWithSuggestion from "../components/general/InputWithSuggestion";
import { AllNarrationFootnotes } from "../components/NarrationSave/NarrationFootnotes";
import { AllNarrationSummaries } from "../components/NarrationSave/NarrationSummaries";
import Button from "../components/ui/buttons/primary-button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createNarration } from "../features/narrationSave/narrationSlice";
import { NarrationEditForm } from "../components/NarrationSave/NarrationEditForm";
import { NarrationSubjectEditForm } from "../components/NarrationSave/NarrationSubjectEditForm";
import { useQueryClient } from "react-query";
import { NarrationSummaryEditForm } from "../components/NarrationSave/NarrationSummaryEditForm";
import { NarrationFootnoteEditForm } from "../components/NarrationSave/NarrationFootnoteEditForm";

export const NarrationEdit = () => {
  const { narrationId } = useParams();
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: narration, isLoading } = useGetNarrationIndividual(narrationId);

  // useEffect(() => {
  //   console.log(
  //     'queryClient.getQueryData(["narrationIndividual", narrationId])'
  //   );
  //   queryClient.setQueryData(["narrationIndividual", narrationId], {});
  //   console.log(queryClient.getQueryData(["narrationIndividual", narrationId]));
  //   console.log(narration);
  // }, [isLoading]);
  const newSubject = useRef();

  // const [addedSubjects, setAddedSubjects] = useState([]);
  // const [selectedImam, setSelectedImam] = useState(imam[0]);
  // const [selectedBook, setSelectedBook] = useState(book[0]);

  const emptySummary = {
    alphabet: "",
    subject_1: "",
    subject_2: "",
    expression: "",
    summary: "",
    surah_no: "",
    verse_no: "",
    verse_content: "",
  };
  const emptyFootnote = {
    expression: "",
    explanation: "",
  };
  const [allSummaries, setAllSummaries] = useState([emptySummary]);
  const [allFootnotes, setAllFootnotes] = useState([emptyFootnote]);

  // const clearValues = () => {
  //   narrationName.current.value = null;
  //   narrationNarrator.current.value = null;
  //   narrationContent.current.value = null;
  //   narrationBookVolNo.current.value = null;
  //   narrationBookPageNo.current.value = null;
  //   narrationBookNarrationNo.current.value = null;
  //   newSubject.current.value = null;

  //   setAddedSubjects([]);
  //   setSelectedImam(null);
  //   setSelectedBook(null);
  //   setAllSummaries([emptySummary]);
  //   setAllFootnotes([emptyFootnote]);
  // };

  // if (!imam?.length > 0 || !book?.length > 0) return <p>data is not loaded</p>;
  if (!(user?.id === 1)) return <Navigate to={"/"} />;
  return (
    <section className="mt-8">
      <NarrationEditForm narration={narration} />

      <NarrationSubjectEditForm narration={narration} />

      <NarrationSummaryEditForm narration={narration} />
      <NarrationFootnoteEditForm narration={narration} />
      {/* <AllNarrationSummaries
        allSummaries={allSummaries}
        setAllSummaries={setAllSummaries}
        emptySummary={emptySummary}
      />

      <AllNarrationFootnotes
        allFootnotes={allFootnotes}
        setAllFootnotes={setAllFootnotes}
        emptyFootnote={emptyFootnote}
      /> */}
      <div className="flex justify-end gap-4 mt-4">
        <Button
          type="button"
          variant="primary"
          className="w-40 h-8"
          style={{ fontSize: "14px" }}
          onClickHandler={() => navigate("/")}
        >
          اتمام ویرایش و بازگشت
        </Button>
      </div>
    </section>
  );
};
