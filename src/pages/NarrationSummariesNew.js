import { useEffect, useRef, useState } from "react";
import {
  useGetNarrationFilterOptions,
  useGetNarrationList,
  useGetSubjects,
  useGetSummaryTree,
} from "../api/hooks/allHooks";
import noteIcon from "../assets/images/shapes/Icon-Note.svg";
import shape_green from "../assets/images/shapes/shape-green.svg";
import { Pagination } from "../components/Pagination";
import { ContentContainer } from "../components/general/ContentContainer";
import Dropdown, { DropdownSingleSelect } from "../components/ui/dropdown";
import Input from "../components/ui/input";
import { InputWithState } from "../components/general/InputWithState";
import InputWithSuggestion from "../components/general/InputWithSuggestion";
import { useQueryClient } from "react-query";
import { CircularProgress } from "@mui/material";
import { AiFillDelete, AiFillEdit, AiOutlineClose } from "react-icons/ai";
import apiUrls from "../api/urls";
import { useNavigate } from "react-router-dom";
import { customApiCall } from "../utils/axios";
import Button from "../components/ui/buttons/primary-button";
import { BiCloset, BiNote } from "react-icons/bi";
import { useSelector } from "react-redux";
import { FaComment, FaRegCommentDots, FaRegStickyNote } from "react-icons/fa";
import { CustomModal, CustomModal2 } from "../components/general/CustomModal";
import { BsChatLeftText } from "react-icons/bs";
import FilterModal from "../components/show-traditions/filter-modal";
import { extractTreeWords, makeTreeOptions } from "../utils/manipulation";

function ArabicTextComponent({ children, footnotes }) {
  let dollar = false;
  let atSign = true;
  let noteIndex = -1;
  const [showModal, setShowModal] = useState(false);
  const [footnote, setFootnote] = useState("");
  const singleLangParts = children
    .split("ظظظ")
    ?.filter(
      (singleLangText) => singleLangText.replaceAll(" ", "")?.length > 0
    );
  return (
    <span
      style={
        {
          // wordBreak: "keep-all",
        }
      }
    >
      <CustomModal2
        open={showModal}
        setOpen={setShowModal}
        height="21.6rem"
        className="relative"
        style={{
          border: "1px solid gray",
          top: "30vh",
          padding: "16px",
        }}
        title="پاورقی"
        text={footnote}
      ></CustomModal2>
      {singleLangParts?.map((singleLangText, index) => {
        const isTranslation = index % 2 !== 0;
        const isLastPart = index !== Math.floor(singleLangParts?.length) - 1;
        return (
          <>
            <div className={"inline-block"}>
              {singleLangText?.split(" ").map((word) => {
                return (
                  <span
                    style={{
                      display: "inline-block",
                      marginLeft: "4px",
                    }}
                  >
                    <span
                      style={{
                        color: isTranslation ? "black" : "#102cc9",
                        fontSize: isTranslation ? "1rem" : "1.4rem",
                      }}
                    >
                      {[...word].map((char) => {
                        if (char === "$") {
                          dollar = !dollar;
                        } else if (char === "@") {
                          atSign = !atSign;
                          if (atSign) {
                            noteIndex += 1;
                            const footnoteExplanation =
                              footnotes[noteIndex]?.explanation;
                            return (
                              <span className="relative inline-block w-1">
                                <BsChatLeftText
                                  className="absolute "
                                  style={{
                                    color: "#000000",
                                    transform: "translate(10px,-27px)",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={() => {
                                    setFootnote(footnoteExplanation);
                                    setShowModal(true);
                                  }}
                                  onClick={() => setShowModal(true)}
                                />
                              </span>
                            );
                          } // atSign = !atSign;
                        } else
                          return /[\u064B-\u0652]/.test(char) ? (
                            <span style={{ color: "red" }}>&#8203;{char}</span>
                          ) : (
                            <span
                              style={{
                                color: dollar && "#0e8708",
                                // backgroundColor: atSign && "#ff000030",
                                // cursor: atSign && "pointer",
                              }}
                            >
                              {char}
                            </span>
                          );
                      })}
                    </span>
                  </span>
                );
              })}
            </div>

            {isTranslation && isLastPart && (
              <div
                style={{
                  width: "75%",
                  margin: "16px auto",
                  height: "0px",
                  backgroundColor: "gray",
                }}
              ></div>
            )}
          </>
        );
      })}
    </span>
  );
}

const SingleNarration = ({ narration, onDelete, onEdit, showSummary }) => {
  const [short, setShort] = useState(true);
  const { user } = useSelector((store) => store.user);

  const [open, setOpen] = useState(false);
  const pass = useRef();
  return (
    <ContentContainer
      title={`${narration.book.name}`}
      actionComponent={
        <div className="flex gap-4 items-center">
          {user?.id === 1 ? (
            <>
              <AiFillDelete
                className="cursor-pointer"
                onClick={() => setOpen(true)}
              />
              <AiFillEdit className="cursor-pointer" onClick={onEdit} />
            </>
          ) : null}

          <span>
            {narration.book_vol_no ? `جلد ${narration.book_vol_no}` : ""}
            &nbsp;
            {narration.book_page_no ? `/  صفحه ${narration.book_page_no}` : ""}
          </span>
        </div>
      }
      className="mb-4"
    >
      {open && (
        <div
          className=" fixed top-1/2 left-1/2 "
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            transform: "translate(-50%, -50%)",
            zIndex: 101,
          }}
        >
          <div
            style={{
              flexDirection: "column",
            }}
            className="relative p-6 flex gap-8  w-100  items-center "
          >
            <p className="mt-6">
              آیا از حذف حدیث مطمئن هستید؟ لطفا در کادر زیر پسورد را وارد کنید:
            </p>
            <Input reference={pass} />
            <Button
              variant="primary"
              className="w-30"
              onClickHandler={() => {
                setOpen(false);
                if (onDelete) onDelete(pass.current?.value);
              }}
            >
              OK
            </Button>
            <AiOutlineClose
              className="absolute cursor-pointer right-2 top-2"
              onClick={() => setOpen(false)}
            />
          </div>
        </div>
      )}
      {!showSummary && (
        <>
          <p
            style={{
              color: "brown",
              fontSize: "1rem",
            }}
          >
            {narration.narrator}
          </p>
          <p>
            <ArabicTextComponent
              children={
                short ? narration.content.substr(0, 500) : narration.content
              }
              footnotes={narration.footnotes}
            />
            {short && narration.content.length > 500 && (
              <span
                onClick={() => setShort(false)}
                style={{
                  cursor: "pointer",
                  color: "var(--secondary-blue-color)",
                  fontSize: "14px",
                }}
              >
                ... نمایش کامل
              </span>
            )}
            {!short && narration.content.length > 500 && (
              <span
                onClick={() => setShort(true)}
                style={{
                  cursor: "pointer",
                  color: "var(--secondary-blue-color)",
                  fontSize: "14px",
                }}
              >
                ... نمایش کمتر
              </span>
            )}
          </p>
        </>
      )}

      {showSummary &&
        (narration?.content_summary_tree || []).map((contentItem, subIndex) => (
          <>
            {subIndex !== 0 && (
              <img
                className="h-2 block w-full my-2"
                src={shape_green}
                alt="shape-green"
              />
            )}
            <div className="flex items-start justify-between w-full ">
              <p className="w-[48%]">{contentItem.summary}</p>
              <p className="w-[48%]">{contentItem.expression}</p>
            </div>
          </>
        ))}
    </ContentContainer>
  );
};

// export default function SingleNarrationJustSummary({ data, section }) {
//   return (
//     <div>
//       {(narration?.content_summary_tree || []).map((subItem, subIndex) => (
//         <>
//           <p>{contentItem.expression}</p>
//           <p>{contentItem.summary}</p>
//         </>
//       ))}
//     </div>
//   );
// }

export const NarrationWarehouseOld = () => {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const queryClient = useQueryClient();
  const searchTerm = useRef();
  const searchSubject = useRef();
  const { section, selectedNode } = useSelector((store) => store.summaryTree);

  const { data } = useGetSummaryTree(section);
  const treeWords = extractTreeWords(
    selectedNode[section],
    data,
    section,
    section !== "surah" ? "alphabet" : "surah_name"
  );
  // const [searchSubject, setSearchSubject] = useState("");
  const emptyOptions = {
    alphabet: null,
    subject: null,
    sub_subject: null,
    narration_name: null,
    imam_name: null,
    surah_name: null,
    verse_no: null,
  };
  const displayOptions = {
    alphabet: "الفبا",
    subject: "موضوع",
    sub_subject: "زیرموضوع",
    narration_name: "نام حدیث",
    imam_name: "نام امام",
    surah_name: "نام سوره",
    verse_no: "شماره آیه",
  };

  const serachOptions = {
    subjects_search: searchSubject?.current?.value || "",
    texts_search: searchTerm?.current?.value || "",
  };
  const [selectedOptions, setSelectedOptions] = useState(emptyOptions);
  const { data: options } = useGetNarrationFilterOptions();
  const treeOptions = makeTreeOptions(treeWords, section);

  const { data: narrationList, isLoading } = useGetNarrationList(selectedPage, {
    ...selectedOptions,
    ...serachOptions,
    ...treeOptions,
  });

  const handleSelect = (newValue, category) => {
    setSelectedOptions({ ...selectedOptions, [category]: newValue });
  };

  const handleDelete = async (narrationId, pass) => {
    if (Number(pass) !== 1348) return;
    const url = apiUrls.narration.get(narrationId);
    const resp = await customApiCall.delete({ url });
    queryClient.refetchQueries();
  };

  const sort = (array) => {
    if (!array) return array;
    const newArray = [...array];
    newArray.sort();
    return newArray;
  };
  let { data: subject } = useGetSubjects();
  subject = subject?.subjects || [];
  const dropdown = [
    { id: 1, title: "پربازدیدترین" },
    { id: 2, title: "پرتکرارترین" },
    { id: 3, title: "قدیمی ترین" },
  ];
  const [a, setA] = useState({ id: 1, title: "پربازدیدترین" });

  return (
    <>
      <section
        className="grid grid-cols-[1fr_1fr] gap-4 py-2 -px-4"
        style={{
          position: "sticky",
          top: "90px",
          zIndex: 100,
          backgroundColor: "var(--blue-100)",
        }}
      >
        <Input
          className="search"
          type="search"
          reference={searchTerm}
          placeholder="جستجو در متن احادیث"
          onChange={() => queryClient.refetchQueries()}
        />
        <InputWithSuggestion
          className="w-full"
          reference={searchSubject}
          placeholder="جستجوی موضوعی"
          suggestions={subject}
          onChange={() => queryClient.refetchQueries()}
        />
      </section>

      <div className="mt-1 grid grid-cols-[300px_auto] gap-4  ">
        {/* <article
          style={{
            backgroundColor: "white",
            height: "fit-content",
            minHeight: "400px",
            paddingBottom: "32px",
            borderRadius: "8px",
            overflow: "hidden",
            minHeight: "75vh",
            position: "sticky",
            top: "140px",
          }}
        >
          {Object.keys(emptyOptions).map((category, index) => {
            return (
              <DropdownSingleSelect
                key={index}
                items={sort([
                  ...new Set(options?.map((option) => option[category])),
                ])}
                label={displayOptions[category]}
                selected={selectedOptions[category]}
                setSelected={(newValue) => handleSelect(newValue, category)}
              />
            );
          })}
        </article> */}
        <FilterModal data={data} className="block" />

        <article
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "80vh",
            position: "relative",
          }}
        >
          {isLoading && (
            <CircularProgress
              className="absolute top-1/2 left-1/2 "
              color="success"
            />
          )}
          {!isLoading && (
            <>
              <div
                className="p-4 px-10 mb-4 flex items-center justify-between"
                style={{
                  boxShadow: "-3px 8px 16px -3px #00000026",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  fontSize: "16px",
                  color: "var(--neutral-color-500)",
                }}
              >
                <div className="">
                  <span>{narrationList?.number_of_records || 0}</span>
                  &nbsp;
                  <span>حدیث یافت شد </span>
                </div>
                <div className="flex gap-2">
                  <span
                    className="cursor-pointer"
                    onClick={() => setShowSummary(false)}
                  >
                    نمایش متن
                  </span>
                  <span
                    className="cursor-pointer"
                    onClick={() => setShowSummary(true)}
                  >
                    نمایش خلاصه
                  </span>
                </div>
                <div className="flex gap-3 items-center">
                  <p>مرتب سازی :</p>
                  <div className="w-50">
                    <Dropdown
                      className="h-8 "
                      dataKey="title"
                      selected={a}
                      setSelected={setA}
                      items={dropdown}
                    />
                  </div>
                </div>
              </div>
              <section className="h-full" style={{}}>
                {narrationList?.results?.map((narration, index) => (
                  <SingleNarration
                    key={index}
                    onEdit={() => navigate(`${narration?.id}`)}
                    onDelete={(pass) => handleDelete(narration?.id, pass)}
                    narration={narration}
                    showSummary={showSummary}
                  />
                ))}
              </section>
              {narrationList?.last > 0 && (
                <Pagination
                  className="mt-8"
                  noOfPages={narrationList.last}
                  selected={selectedPage}
                  setSelected={setSelectedPage}
                />
              )}
            </>
          )}
        </article>
      </div>
    </>
  );
};

export const NarrationSummariesNew = () => {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const queryClient = useQueryClient();
  const searchTerm = useRef();
  const searchSubject = useRef();
  const { section, selectedNode } = useSelector((store) => store.summaryTree);

  const { data } = useGetSummaryTree(section);
  const treeWords = extractTreeWords(
    selectedNode[section],
    data,
    section,
    section !== "surah" ? "alphabet" : "surah_name"
  );
  // const [searchSubject, setSearchSubject] = useState("");
  const emptyOptions = {
    alphabet: null,
    subject: null,
    sub_subject: null,
    narration_name: null,
    imam_name: null,
    surah_name: null,
    verse_no: null,
  };
  const displayOptions = {
    alphabet: "الفبا",
    subject: "موضوع",
    sub_subject: "زیرموضوع",
    narration_name: "نام حدیث",
    imam_name: "نام امام",
    surah_name: "نام سوره",
    verse_no: "شماره آیه",
  };

  const serachOptions = {
    subjects_search: searchSubject?.current?.value || "",
    texts_search: searchTerm?.current?.value || "",
  };
  const [selectedOptions, setSelectedOptions] = useState(emptyOptions);
  const { data: options } = useGetNarrationFilterOptions();
  const treeOptions = makeTreeOptions(treeWords, section);

  const { data: narrationList, isLoading } = useGetNarrationList(selectedPage, {
    ...selectedOptions,
    ...serachOptions,
    ...treeOptions,
  });

  const handleSelect = (newValue, category) => {
    setSelectedOptions({ ...selectedOptions, [category]: newValue });
  };

  const handleDelete = async (narrationId, pass) => {
    if (Number(pass) !== 1348) return;
    const url = apiUrls.narration.get(narrationId);
    const resp = await customApiCall.delete({ url });
    queryClient.refetchQueries();
  };

  const sort = (array) => {
    if (!array) return array;
    const newArray = [...array];
    newArray.sort();
    return newArray;
  };
  let { data: subject } = useGetSubjects();
  subject = subject?.subjects || [];
  const dropdown = [
    { id: 1, title: "پربازدیدترین" },
    { id: 2, title: "پرتکرارترین" },
    { id: 3, title: "قدیمی ترین" },
  ];
  const [a, setA] = useState({ id: 1, title: "پربازدیدترین" });

  return (
    <div className="pt-2" style={{}}>
      <FilterModal
        data={data}
        className="w-90 "
        style={{
          zIndex: "10",
          height: "calc(100vh - 6rem)",
          position: "fixed",
          top: "6rem",
        }}
      />

      <div className="mt-1 " style={{ marginRight: "38rem" }}>
        <article
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "80vh",
            position: "relative",
          }}
        >
          {isLoading && (
            <CircularProgress
              className="absolute top-1/2 left-1/2 "
              color="success"
            />
          )}
          {!isLoading && (
            <>
              <section className="h-full" style={{}}>
                {narrationList?.results?.map((narration, index) => (
                  <SingleNarration
                    key={index}
                    onEdit={() => navigate(`${narration?.id}`)}
                    onDelete={(pass) => handleDelete(narration?.id, pass)}
                    narration={narration}
                    showSummary={showSummary}
                  />
                ))}
              </section>
              {narrationList?.last > 0 && (
                <Pagination
                  className="mt-8"
                  noOfPages={narrationList.last}
                  selected={selectedPage}
                  setSelected={setSelectedPage}
                />
              )}
            </>
          )}
        </article>
      </div>
    </div>
  );
};
