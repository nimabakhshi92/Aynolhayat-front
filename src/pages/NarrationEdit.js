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
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createNarration } from "../features/narrationSave/narrationSlice";
import { NarrationEditForm } from "../components/NarrationSave/NarrationEditForm";

export const NarrationEdit = ({ narrationId }) => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const narration = useGetNarrationIndividual(narrationId);

  const newSubject = useRef();
  let { data: imam } = useGetImam();
  imam = imam || [];
  let { data: book } = useGetBooks();
  book = book || [];
  let { data: subject } = useGetSubjects();
  subject = subject?.subjects || [];

  const [addedSubjects, setAddedSubjects] = useState([]);
  const [selectedImam, setSelectedImam] = useState(imam[0]);
  const [selectedBook, setSelectedBook] = useState(book[0]);

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

  if (!imam?.length > 0 || !book?.length > 0) return <p>data is not loaded</p>;
  if (!(user?.id === 1)) return <Navigate to={"/"} />;
  return (
    <section className="mt-8">
      <NarrationEditForm narration={narration} />

      {/* 
      <ContentContainer className="mb-4" title="موضوعات مرتبط با حدیث">
        <div className="flex items-center">
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
              if (newSubject.current?.value)
                setAddedSubjects([...addedSubjects, newSubject.current?.value]);
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
              if (newSubject.current?.value)
                setAddedSubjects([...addedSubjects, newSubject.current?.value]);
              newSubject.current.value = "";
            }}
          >
            <AiOutlinePlus />
          </div>
        </div>
        <div className="mt-6 flex gap-4 items-start">
          {addedSubjects?.map((subject, index) => {
            return (
              <Tag
                onClose={() => {
                  setAddedSubjects(
                    addedSubjects.filter((sub) => sub !== subject)
                  );
                }}
                key={index}
                tag={subject}
              />
            );
          })}
        </div>
      </ContentContainer>

      <AllNarrationSummaries
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
