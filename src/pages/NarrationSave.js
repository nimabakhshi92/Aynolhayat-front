import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "../components/general/ContentContainer";
import Input from "../components/ui/input";
import Tag from "../components/ui/tag";
import { AiOutlinePlus, AiOutlinePlusCircle } from "react-icons/ai";
import Dropdown from "../components/ui/dropdown";
import {
  useGetBooks,
  useGetImam,
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

export const NarrationSave = () => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const narrationName = useRef();
  const narrationNarrator = useRef();
  const narrationContent = useRef();
  const narrationBookVolNo = useRef();
  const narrationBookPageNo = useRef();
  const narrationBookNarrationNo = useRef();
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
    subject_3: "",
    subject_4: "",
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

  const clearValues = () => {
    narrationName.current.value = null;
    narrationNarrator.current.value = null;
    narrationContent.current.value = null;
    narrationBookVolNo.current.value = null;
    narrationBookPageNo.current.value = null;
    narrationBookNarrationNo.current.value = null;
    newSubject.current.value = null;

    setAddedSubjects([]);
    setSelectedImam(null);
    setSelectedBook(null);
    setAllSummaries([emptySummary]);
    setAllFootnotes([emptyFootnote]);
  };
  const handleSubmit = (e) => {
    if (
      !selectedImam?.id ||
      !selectedBook?.id ||
      !narrationName.current?.value ||
      !narrationNarrator.current?.value ||
      !narrationContent.current?.value ||
      !narrationBookVolNo.current?.value ||
      !narrationBookPageNo.current?.value ||
      !narrationBookNarrationNo.current?.value
    ) {
      toast.error("پر کردن همه فیلدهای اطلاعات شناسنامه ای الزامی است");
      return;
    }

    const narration = {
      imam: Number(selectedImam.id),
      book: Number(selectedBook.id),
      name: narrationName.current?.value,
      narrator: narrationNarrator.current?.value,
      content: narrationContent.current?.value,
      book_vol_no: Number(narrationBookVolNo.current?.value),
      book_page_no: Number(narrationBookPageNo.current?.value),
      book_narration_no: Number(narrationBookNarrationNo.current?.value),
    };

    const filledFootnotes = allFootnotes?.filter(
      (footnote) => !!footnote.expression
    );
    const filledSummaries = allSummaries?.filter(
      (summary) => !!summary.alphabet
    );
    const summary_tree = filledSummaries?.map((summary) => {
      const newSummary = {
        content_summary_tree: {
          alphabet: summary.alphabet,
          subject_1: summary.subject_1,
          subject_2: summary.subject_2,
          subject_3: summary.subject_3,
          subject_4: summary.subject_4,
          expression: summary.expression,
          summary: summary.summary,
        },
      };
      const quran_verse = summary?.surah_no ? Number(summary?.verse_no) : null;
      if (quran_verse) newSummary.quran_verse = quran_verse;
      return newSummary;
    });

    const formattedSubjects = addedSubjects?.map((sub) => ({ subject: sub }));
    if (formattedSubjects?.length > 0) narration.subjects = formattedSubjects;
    if (filledFootnotes?.length > 0) narration.footnotes = filledFootnotes;
    if (filledSummaries?.length > 0) narration.summary_tree = summary_tree;

    dispatch(createNarration(narration));
  };
  const { status, isLoading } = useSelector((store) => store.narration);
  useEffect(() => {
    if (status === 200) clearValues();
  }, [isLoading]);
  if (!imam?.length > 0 || !book?.length > 0) return <p>data is not loaded</p>;
  if (!(user?.id === 1)) return <Navigate to={"/"} />;
  return (
    <section className="mt-8">
      <ContentContainer className="mb-4" title="اطلاعات شناسنامه‌ای حدیث">
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          <Input reference={narrationName} type="text" placeholder="نام حدیث" />
          <Dropdown
            selected={selectedImam}
            setSelected={setSelectedImam}
            items={imam}
            dataKey="name"
            placeholder="نام معصوم"
          />

          <Input
            reference={narrationNarrator}
            type="text"
            placeholder="راویان حدیث"
          />
          <Input
            className="col-span-2"
            reference={narrationContent}
            type="text"
            placeholder="متن حدیث"
          />
          <Dropdown
            selected={selectedBook}
            setSelected={setSelectedBook}
            items={book}
            dataKey="name"
            placeholder="نام کتاب"
          />
          <Input
            reference={narrationBookVolNo}
            type="number"
            placeholder="شماره جلد کتاب"
          />
          <Input
            reference={narrationBookPageNo}
            type="number"
            placeholder="شماره صفحه"
          />
          <Input
            reference={narrationBookNarrationNo}
            type="number"
            placeholder="شماره حدیث"
          />
        </div>
      </ContentContainer>

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
      />
      <div className="flex justify-end gap-4 mt-4">
        <Button
          variant="secondary"
          type="button"
          className="w-40 h-8"
          style={{ fontSize: "14px" }}
          onClickHandler={() => navigate("/", { preventScrollReset: false })}
        >
          انصراف
        </Button>
        <Button
          type="button"
          variant="primary"
          className="w-40 h-8"
          style={{ fontSize: "14px" }}
          onClickHandler={handleSubmit}
        >
          ذخیره
        </Button>
      </div>
    </section>
  );
};
