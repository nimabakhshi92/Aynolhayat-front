import { useEffect, useRef, useState } from "react";
import {
  useGetNarrationFilterOptions,
  useGetNarrationList,
  useGetSubjects,
} from "../api/hooks/allHooks";
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

const removeTashkel = (s) => s.replace(/[\u064B-\u0652]/gm, "");

// function colorizeTashkeel(string, oneColor = "red", footnotes) {
//   let dollar = false;
//   let atSign = false;
//   let index = -1;
//   const [showModal, setShowModal] = useState(false);
//   return (
//     <>
//       <CustomModal
//         modalOpen={showModal}
//         setModalOpen={setShowModal}
//         height="21.6rem"
//         className="relative"
//       >
//         <p>salam</p>
//       </CustomModal>
//       <span style={{ color: "blue" }}>
//         {[...string].map((char) => {
//           if (char === "$") {
//             dollar = !dollar;
//           } else if (char === "@") {
//             atSign = !atSign;
//             index += 1;
//             if (atSign)
//               return (
//                 <span className="relative inline-block w-1">
//                   <FaRegStickyNote
//                     className="absolute "
//                     style={{
//                       color: "#00000090",
//                       transform: "translate(10px,-27px)",
//                       cursor: "pointer",
//                     }}
//                     onMouseEnter={() => {}}
//                   />
//                 </span>
//               );
//             // atSign = !atSign;
//           } else
//             return /[\u064B-\u0652]/.test(char) ? (
//               <span style={{ color: oneColor }}>&#8203;{`${char}`}</span>
//             ) : (
//               <span
//                 style={{
//                   color: dollar ? "#1ec718" : "#102cc9",
//                   // backgroundColor: atSign && "#ff000030",
//                   // cursor: atSign && "pointer",
//                 }}
//               >
//                 {char}
//               </span>
//             );
//         })}
//       </span>
//     </>
//   );
// }

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
                          console.log(noteIndex);
                          atSign = !atSign;
                          if (atSign) {
                            noteIndex += 1;
                            const footnoteExplanation =
                              footnotes[noteIndex]?.explanation;
                            console.log(footnoteExplanation);
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

const SingleNarration = ({ narration, onDelete, onEdit }) => {
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
            short ? narration.content.substr(0, 1000) : narration.content
          }
          footnotes={narration.footnotes}
        />
        {short && narration.content.length > 1000 && (
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
        {!short && narration.content.length > 1000 && (
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
    </ContentContainer>
  );
};

export const NarrationWarehouse = () => {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState(1);
  const queryClient = useQueryClient();
  const searchTerm = useRef();
  const searchSubject = useRef();
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
  const { data: narrationList, isLoading } = useGetNarrationList(selectedPage, {
    ...selectedOptions,
    ...serachOptions,
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
        className="mt-4 grid grid-cols-[1fr_1fr] gap-4 py-4 -px-4"
        style={{
          position: "sticky",
          top: "60px",
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
        <article
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
        </article>

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
