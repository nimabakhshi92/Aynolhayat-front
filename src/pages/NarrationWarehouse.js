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
import FilterModal, {
  FilterModalLT,
} from "../components/show-traditions/filter-modal";
import { extractTreeWords, makeTreeOptions } from "../utils/manipulation";
import { NarrationSummaryNavbar } from "../components/NarrationSummaryNavbar";
import { getUserFromLocalStorage } from "../utils/localStorage";
import { getFont, isAdmin, isSuperAdmin } from "../utils/acl";

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

function ArabicTextComponent({ children, footnotes = [], className }) {
  const { user } = useSelector((store) => store.user);
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
      className={className}
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
                        fontSize:
                          (isTranslation
                            ? isSuperAdmin(user)
                              ? getFont(1.4)
                              : 1.4
                            : isSuperAdmin(user)
                            ? getFont(1.6)
                            : 1.6) + "rem",
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
                            <span
                              style={{
                                color: "red",
                                userSelect: "none",
                              }}
                            >
                              &#8203;{char}
                            </span>
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

export const SingleNarration = ({
  narration,
  onDelete,
  onEdit,
  showSummary = false,
  lvl1,
  lvl2,
  lvl3,
  section,
}) => {
  const [isSummary, setIsShowSummary] = useState(showSummary);

  const [short, setShort] = useState(true);
  const { user } = useSelector((store) => store.user);

  const [open, setOpen] = useState(false);
  const pass = useRef();
  return (
    <ContentContainer
      // title={`${narration.book.name}`}
      title={`${narration.imam.name} می فرمایند:`}
      actionComponent={
        <div className="flex gap-4 items-center">
          {isAdmin(user) ? (
            <>
              <AiFillDelete
                className="cursor-pointer"
                onClick={() => setOpen(true)}
              />
              <AiFillEdit className="cursor-pointer" onClick={onEdit} />
            </>
          ) : null}

          <span>
            <span>{narration.book.name}</span>
            <span>{" - "}</span>
            <span>
              {narration.book_vol_no ? `جلد ${narration.book_vol_no}` : ""}
              &nbsp;
              {narration.book_page_no
                ? `-  صفحه ${narration.book_page_no}`
                : ""}
            </span>
          </span>
        </div>
      }
      className="mb-4 relative min-h-30"
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
      {!isSummary && (
        <>
          <div className="flex justify-between items-start">
            <p
              style={{
                color: "brown",
                fontSize: (isSuperAdmin(user) ? getFont(1.3) : 1.3) + "rem",
                maxWidth: "calc(100% - 100px)",
              }}
            >
              {narration.narrator}
            </p>
            {showSummary && (
              <Button
                className="absolute top-14 left-4"
                onClickHandler={() => setIsShowSummary(true)}
                variant="secondary"
              >
                نمایش خلاصه
              </Button>
            )}
          </div>
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
                  fontSize: (isSuperAdmin(user) ? getFont(1.4) : 1.4) + "rem",
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
                  fontSize: (isSuperAdmin(user) ? getFont(1.4) : 1.4) + "rem",
                }}
              >
                ... نمایش کمتر
              </span>
            )}
          </p>
        </>
      )}

      {showSummary && isSummary && (
        <>
          <div className="w-full relative h-10">
            <span
              style={{
                fontSize: (isSuperAdmin(user) ? getFont(1.4) : 1.4) + "rem",
                marginRight: "12px",
              }}
            >
              خلاصه قسمت های مرتبط با موضوع حدیث:
            </span>
            <Button
              className="absolute left-4"
              onClickHandler={() => setIsShowSummary(false)}
              variant="secondary"
            >
              نمایش متن کامل
            </Button>
          </div>
          <div>
            {(narration?.content_summary_tree || [])
              .filter((contentItem) => {
                if (section !== "surah")
                  return (
                    contentItem.alphabet === lvl1 &&
                    contentItem.subject === lvl2 &&
                    contentItem.sub_subject === lvl3
                  );
                else
                  return (
                    contentItem.alphabet === "بیان" &&
                    contentItem.verse?.surah_name === lvl1 &&
                    contentItem.verse?.verse_no === lvl2
                  );
              })
              .map((contentItem, subIndex) => {
                const itemTitle =
                  section === "surah"
                    ? contentItem?.subject
                    : contentItem?.subject_3;
                return (
                  <>
                    {subIndex !== 0 && (
                      <img
                        className="h-2 block w-full my-2"
                        src={shape_green}
                        alt="shape-green"
                      />
                    )}
                    {itemTitle && (
                      <div
                        className="flex gap-2"
                        style={{
                          color: "var(--primary-color)",
                          fontSize:
                            (isSuperAdmin(user) ? getFont(1.4) : 1.4) + "rem",
                        }}
                      >
                        <img src={noteIcon} alt="icon" />
                        <span>{itemTitle}</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between w-full mr-3">
                      <p
                        className="w-[48%]"
                        style={{
                          fontSize:
                            (isSuperAdmin(user) ? getFont(1.4) : 1.4) + "rem",
                        }}
                      >
                        {contentItem.expression}
                      </p>
                      <ArabicTextComponent
                        className="block w-[48%]"
                        children={contentItem.summary}
                      />

                      {/* <p className="w-[48%]">{contentItem.summary}</p> */}
                    </div>
                  </>
                );
              })}
          </div>
        </>
      )}
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

// export const NarrationWarehouseOld = () => {
//   const navigate = useNavigate();
//   const [selectedPage, setSelectedPage] = useState(1);
//   const [showSummary, setShowSummary] = useState(false);
//   const queryClient = useQueryClient();
//   const searchTerm = useRef();
//   const searchSubject = useRef();
//   const { section, selectedNode } = useSelector((store) => store.summaryTree);

//   const { data } = useGetSummaryTree(section);
//   const treeWords = extractTreeWords(
//     selectedNode[section],
//     data,
//     section,
//     section !== "surah" ? "alphabet" : "surah_name"
//   );
//   // const [searchSubject, setSearchSubject] = useState("");
//   const emptyOptions = {
//     alphabet: null,
//     subject: null,
//     sub_subject: null,
//     narration_name: null,
//     imam_name: null,
//     surah_name: null,
//     verse_no: null,
//   };
//   const displayOptions = {
//     alphabet: "الفبا",
//     subject: "موضوع",
//     sub_subject: "زیرموضوع",
//     narration_name: "نام حدیث",
//     imam_name: "نام امام",
//     surah_name: "نام سوره",
//     verse_no: "شماره آیه",
//   };

//   const serachOptions = {
//     subjects_search: searchSubject?.current?.value || "",
//     texts_search: searchTerm?.current?.value || "",
//   };
//   const [selectedOptions, setSelectedOptions] = useState(emptyOptions);
//   const { data: options } = useGetNarrationFilterOptions();
//   const treeOptions = makeTreeOptions(treeWords, section);

//   const { data: narrationList, isLoading } = useGetNarrationList(selectedPage, {
//     ...selectedOptions,
//     ...serachOptions,
//     ...treeOptions,
//   });

//   const handleSelect = (newValue, category) => {
//     setSelectedOptions({ ...selectedOptions, [category]: newValue });
//   };

//   const handleDelete = async (narrationId, pass) => {
//     if (Number(pass) !== 1348) return;
//     const url = apiUrls.narration.get(narrationId);
//     const resp = await customApiCall.delete({ url });
//     queryClient.refetchQueries();
//   };

//   const sort = (array) => {
//     if (!array) return array;
//     const newArray = [...array];
//     newArray.sort();
//     return newArray;
//   };
//   let { data: subject } = useGetSubjects();
//   subject = subject?.subjects || [];
//   const dropdown = [
//     { id: 1, title: "پربازدیدترین" },
//     { id: 2, title: "پرتکرارترین" },
//     { id: 3, title: "قدیمی ترین" },
//   ];
//   const [a, setA] = useState({ id: 1, title: "پربازدیدترین" });

//   return (
//     <>
//       <section
//         className="grid grid-cols-[1fr_1fr] gap-4 py-2 -px-4"
//         style={{
//           position: "sticky",
//           top: "90px",
//           zIndex: 100,
//           backgroundColor: "var(--blue-100)",
//         }}
//       >
//         <Input
//           className="search"
//           type="search"
//           reference={searchTerm}
//           placeholder="جستجو در متن احادیث"
//           onChange={() => queryClient.refetchQueries()}
//         />
//         <InputWithSuggestion
//           className="w-full"
//           reference={searchSubject}
//           placeholder="جستجوی موضوعی"
//           suggestions={subject}
//           onChange={() => queryClient.refetchQueries()}
//         />
//       </section>

//       <div className="mt-1 grid grid-cols-[300px_auto] gap-4  ">
//         {/* <article
//           style={{
//             backgroundColor: "white",
//             height: "fit-content",
//             minHeight: "400px",
//             paddingBottom: "32px",
//             borderRadius: "8px",
//             overflow: "hidden",
//             minHeight: "75vh",
//             position: "sticky",
//             top: "140px",
//           }}
//         >
//           {Object.keys(emptyOptions).map((category, index) => {
//             return (
//               <DropdownSingleSelect
//                 key={index}
//                 items={sort([
//                   ...new Set(options?.map((option) => option[category])),
//                 ])}
//                 label={displayOptions[category]}
//                 selected={selectedOptions[category]}
//                 setSelected={(newValue) => handleSelect(newValue, category)}
//               />
//             );
//           })}
//         </article> */}
//         <FilterModal data={data} className="block" />

//         <article
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             minHeight: "80vh",
//             position: "relative",
//           }}
//         >
//           {isLoading && (
//             <CircularProgress
//               className="absolute top-1/2 left-1/2 "
//               color="success"
//             />
//           )}
//           {!isLoading && (
//             <>
//               <div
//                 className="p-4 px-10 mb-4 flex items-center justify-between"
//                 style={{
//                   boxShadow: "-3px 8px 16px -3px #00000026",
//                   borderRadius: "8px",
//                   backgroundColor: "white",
//                   fontSize: (isSuperAdmin(user) ? getFont(1.6) : 1.6) + "rem",

//                   color: "var(--neutral-color-500)",
//                 }}
//               >
//                 <div className="">
//                   <span>{narrationList?.number_of_records || 0}</span>
//                   &nbsp;
//                   <span>حدیث یافت شد </span>
//                 </div>
//                 <div className="flex gap-2">
//                   <span
//                     className="cursor-pointer"
//                     onClick={() => setShowSummary(false)}
//                   >
//                     نمایش متن
//                   </span>
//                   <span
//                     className="cursor-pointer"
//                     onClick={() => setShowSummary(true)}
//                   >
//                     نمایش خلاصه
//                   </span>
//                 </div>
//                 <div className="flex gap-3 items-center">
//                   <p>مرتب سازی :</p>
//                   <div className="w-50">
//                     <Dropdown
//                       className="h-8 "
//                       dataKey="title"
//                       selected={a}
//                       setSelected={setA}
//                       items={dropdown}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <section className="h-full" style={{}}>
//                 {narrationList?.results?.map((narration, index) => (
//                   <SingleNarration
//                     key={index}
//                     onEdit={() => navigate(`${narration?.id}`)}
//                     onDelete={(pass) => handleDelete(narration?.id, pass)}
//                     narration={narration}
//                     showSummary={showSummary}
//                   />
//                 ))}
//               </section>
//               {narrationList?.last > 0 && (
//                 <Pagination
//                   className="mt-8"
//                   noOfPages={narrationList.last}
//                   selected={selectedPage}
//                   setSelected={setSelectedPage}
//                 />
//               )}
//             </>
//           )}
//         </article>
//       </div>
//     </>
//   );
// };

// export const NarrationWarehouse = () => {
//   const navigate = useNavigate();
//   const [selectedPage, setSelectedPage] = useState(1);
//   const [showSummary, setShowSummary] = useState(false);
//   const queryClient = useQueryClient();
//   const searchTerm = useRef();
//   const searchSubject = useRef();
//   const { section, selectedNode } = useSelector((store) => store.summaryTree);

//   const { data } = useGetSummaryTree(section);
//   const treeWords = extractTreeWords(
//     selectedNode[section],
//     data,
//     section,
//     section !== "surah" ? "alphabet" : "surah_name"
//   );
//   // const [searchSubject, setSearchSubject] = useState("");
//   const emptyOptions = {
//     alphabet: null,
//     subject: null,
//     sub_subject: null,
//     narration_name: null,
//     imam_name: null,
//     surah_name: null,
//     verse_no: null,
//   };
//   const displayOptions = {
//     alphabet: "الفبا",
//     subject: "موضوع",
//     sub_subject: "زیرموضوع",
//     narration_name: "نام حدیث",
//     imam_name: "نام امام",
//     surah_name: "نام سوره",
//     verse_no: "شماره آیه",
//   };

//   const serachOptions = {
//     subjects_search: searchSubject?.current?.value || "",
//     texts_search: searchTerm?.current?.value || "",
//   };
//   const [selectedOptions, setSelectedOptions] = useState(emptyOptions);
//   const { data: options } = useGetNarrationFilterOptions();
//   const treeOptions = makeTreeOptions(treeWords, section);

//   const { data: narrationList, isLoading } = useGetNarrationList(selectedPage, {
//     ...selectedOptions,
//     ...serachOptions,
//     ...treeOptions,
//   });

//   const handleSelect = (newValue, category) => {
//     setSelectedOptions({ ...selectedOptions, [category]: newValue });
//   };

//   const handleDelete = async (narrationId, pass) => {
//     if (Number(pass) !== 1348) return;
//     const url = apiUrls.narration.get(narrationId);
//     const resp = await customApiCall.delete({ url });
//     queryClient.refetchQueries();
//   };

//   const sort = (array) => {
//     if (!array) return array;
//     const newArray = [...array];
//     newArray.sort();
//     return newArray;
//   };
//   let { data: subject } = useGetSubjects();
//   subject = subject?.subjects || [];
//   const dropdown = [
//     { id: 1, title: "پربازدیدترین" },
//     { id: 2, title: "پرتکرارترین" },
//     { id: 3, title: "قدیمی ترین" },
//   ];
//   const [a, setA] = useState({ id: 1, title: "پربازدیدترین" });

//   return (
//     <div className="flex pt-2" style={{ gap: "8px", flexDirection: "row" }}>
//       <FilterModal
//         data={data}
//         className="w-90 "
//         style={{
//           zIndex: "10",
//           height: "30vh",
//           position: "sticky",
//           top: "8px",
//         }}
//       />

//       <div className="mt-1 " style={{ width: "100%", marginRight: "38rem" }}>
//         <section
//           className="grid grid-cols-[1fr_1fr] gap-4 py-2 -px-4"
//           style={{
//             position: "sticky",
//             top: "90px",
//             zIndex: 100,
//             backgroundColor: "var(--blue-100)",
//           }}
//         >
//           <Input
//             className="search"
//             type="search"
//             reference={searchTerm}
//             placeholder="جستجو در متن احادیث"
//             onChange={() => queryClient.refetchQueries()}
//           />
//           <InputWithSuggestion
//             className="w-full"
//             reference={searchSubject}
//             placeholder="جستجوی موضوعی"
//             suggestions={subject}
//             onChange={() => queryClient.refetchQueries()}
//           />
//         </section>

//         <article
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             minHeight: "80vh",
//             position: "relative",
//           }}
//         >
//           {isLoading && (
//             <CircularProgress
//               className="absolute top-1/2 left-1/2 "
//               color="success"
//             />
//           )}
//           {!isLoading && (
//             <>
//               <div
//                 className="p-4 px-10 mb-4 flex items-center justify-between"
//                 style={{
//                   boxShadow: "-3px 8px 16px -3px #00000026",
//                   borderRadius: "8px",
//                   backgroundColor: "white",
//                   fontSize: (isSuperAdmin(user) ? getFont(1.6) : 1.6) + "rem",

//                   color: "var(--neutral-color-500)",
//                 }}
//               >
//                 <div className="">
//                   <span>{narrationList?.number_of_records || 0}</span>
//                   &nbsp;
//                   <span>حدیث یافت شد </span>
//                 </div>
//                 <div className="flex gap-2">
//                   <span
//                     className="cursor-pointer"
//                     onClick={() => setShowSummary(false)}
//                   >
//                     نمایش متن
//                   </span>
//                   <span
//                     className="cursor-pointer"
//                     onClick={() => setShowSummary(true)}
//                   >
//                     نمایش خلاصه
//                   </span>
//                 </div>
//                 <div className="flex gap-3 items-center">
//                   <p>مرتب سازی :</p>
//                   <div className="w-50">
//                     <Dropdown
//                       className="h-8 "
//                       dataKey="title"
//                       selected={a}
//                       setSelected={setA}
//                       items={dropdown}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <section className="h-full" style={{}}>
//                 {narrationList?.results?.map((narration, index) => (
//                   <SingleNarration
//                     key={index}
//                     onEdit={() => navigate(`${narration?.id}`)}
//                     onDelete={(pass) => handleDelete(narration?.id, pass)}
//                     narration={narration}
//                     showSummary={showSummary}
//                   />
//                 ))}
//               </section>
//               {narrationList?.last > 0 && (
//                 <Pagination
//                   className="mt-8"
//                   noOfPages={narrationList.last}
//                   selected={selectedPage}
//                   setSelected={setSelectedPage}
//                 />
//               )}
//             </>
//           )}
//         </article>
//       </div>
//     </div>
//   );
// };

export const NarrationWarehouseLT = () => {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const queryClient = useQueryClient();
  const searchTerm = useRef();
  const searchSubject = useRef();
  const { section, selectedNode } = useSelector((store) => store.summaryTree);
  const { user } = useSelector((store) => store.user);
  const { data: rawData } = useGetSummaryTree(section, user);
  const data = rawData?.filter((e) => {
    return section === "surah" || e.alphabet !== "بیان";
  });
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
  const [c, setC] = useState([]);

  // useEffect(() => {
  //   let newc = data.map((level1, index1) => {
  //     return {
  //       value: index1 + "l1" + level1.alphabet,
  //       label: level1.alphabet,
  //       children: level1.subjects?.map((level2, index2) => {
  //         return {
  //           value: index1 + "l1" + index2 + "l2" + level2.title,
  //           label: level2.title,
  //           children: level2.sub_subjects?.map((level3, index3) => {
  //             return {
  //               value:
  //                 index1 + "l1" + index2 + "l2" + index3 + "l3" + level3.title,
  //               label: level3.title,
  //               className:
  //                 index1 +
  //                   "l1" +
  //                   index2 +
  //                   "l2" +
  //                   index3 +
  //                   "l3" +
  //                   level3.title ===
  //                 clicked.value
  //                   ? "b-red"
  //                   : null,
  //               children: level2.subjects_3?.map((level4, index4) => {
  //                 return {
  //                   value:
  //                     index1 +
  //                     "l1" +
  //                     index2 +
  //                     "l2" +
  //                     index3 +
  //                     "l3" +
  //                     index4 +
  //                     "l4" +
  //                     level4.title,
  //                   label: level4.title,
  //                   children: level4.subjects_4?.map((level5, index5) => {
  //                     return {
  //                       value:
  //                         index1 +
  //                         "l1" +
  //                         index2 +
  //                         "l2" +
  //                         index3 +
  //                         "l3" +
  //                         index4 +
  //                         "l4" +
  //                         index5 +
  //                         "l5" +
  //                         level5.title,
  //                       label: level5.title,
  //                     };
  //                   }),
  //                 };
  //               }),
  //             };
  //           }),
  //         };
  //       }),
  //     };
  //   });
  //   setC(newc);
  // }, [data]);

  return (
    <div className=" pr-8" style={{}}>
      <NarrationSummaryNavbar />
      <div className="mr-12">
        <FilterModalLT
          data={data}
          className="w-90 "
          style={{
            zIndex: "10",
            height: "calc(100vh - 6rem)",
            position: "fixed",
            top: "15rem",
          }}
        />
        <div className="mt-15 " style={{ marginRight: "38rem" }}>
          <article className="p-4 pt-25 grid gap-6 grid-cols-[1fr]">
            {isLoading && (
              <CircularProgress
                className="absolute top-1/2 left-1/3 "
                color="success"
              />
            )}
            {!isLoading && (
              <>
                <div style={{ color: "var(--primary-color)" }}>
                  <span>{treeWords[0]}</span>
                  {treeWords[1] && (
                    <span>
                      <span
                        style={{
                          display: "inline-block",
                          color: "gray",
                          margin: "0 12px",
                          transform: "translateY(2px)",
                        }}
                      >
                        {" >> "}
                      </span>
                      <span>{treeWords[1]}</span>
                    </span>
                  )}
                  {treeWords[2] && (
                    <span>
                      <span
                        style={{
                          display: "inline-block",
                          color: "gray",
                          margin: "0 12px",
                          transform: "translateY(2px)",
                        }}
                      >
                        {" >> "}
                      </span>
                      <span>{treeWords[2]}</span>
                    </span>
                  )}
                </div>
                {/* <div
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
                </div> */}
                <section className="" style={{}}>
                  {narrationList?.results?.map((narration, index) => (
                    <SingleNarration
                      key={index}
                      onEdit={() => navigate(`${narration?.id}`)}
                      onDelete={(pass) => handleDelete(narration?.id, pass)}
                      narration={narration}
                      showSummary={true}
                      lvl1={treeWords[0]}
                      lvl2={treeWords[1]}
                      lvl3={treeWords[2]}
                      section={section}
                    />
                  ))}
                </section>
                {narrationList?.last > 1 && (
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
    </div>
  );
};
