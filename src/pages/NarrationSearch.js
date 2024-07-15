import { useEffect, useRef, useState } from "react";
import {
  useGetImam,
  useGetNarrationFilterOptions,
  useGetNarrationList,
  useGetSharedNarrations,
  useGetSubjects,
  useGetSummaryTree,
  useGetVerse,
  useShareNarration,
  useUpdateSharedNarration,
} from "../api/hooks/allHooks";
import noteIcon from "../assets/images/shapes/Icon-Note.svg";
import shape_green from "../assets/images/shapes/shape-green.svg";
import { Pagination } from "../components/Pagination";
import { ContentContainer } from "../components/general/ContentContainer";
import Dropdown, { DropdownSingleSelect } from "../components/ui/dropdown";
import Input, { InputOld } from "../components/ui/input";
import { InputWithState } from "../components/general/InputWithState";
import InputWithSuggestion from "../components/general/InputWithSuggestion";
import { useQueryClient } from "@tanstack/react-query";
import { CircularProgress, useMediaQuery } from "@mui/material";
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
import { SingleNarration, removeTashkel } from "./NarrationWarehouse";
import { getSharedNarrationIdFromNarrationId, getSingleNarrationSentStatus } from "../functions/general";
import { shareNarrationStatus } from "../utils/enums";

const sort = (array) => {
  if (!array) return array;
  const newArray = [...array];
  newArray.sort();
  return newArray;
};

export const NarrationSearch = ({ personal }) => {
  const dropdown = [
    { id: 1, title: "تاریخ ایجاد" },
    { id: 2, title: "تاریخ ویرایش" },
  ];
  const sortTypeOptions = [
    { id: 1, title: "نزولی" },
    { id: 2, title: "صعودی" },
  ];

  const sortOptionsNew = [
    { id: 1, title: "آخرین" },
    { id: 2, title: "اولین" },
    { id: 3, title: 'به روز ترین' }
  ];

  const [selectedSortOptionNew, setSelectedSortOptionNew] = useState(
    sortOptionsNew[0]
  );
  const [selectedSortOption, setSelectedSortOption] = useState(dropdown[0]);
  const [selectedSortType, setSelectedSortType] = useState(sortTypeOptions[0]);
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const queryClient = useQueryClient();
  const searchTerm = useRef();
  const searchSubject = useRef();
  const { section, selectedNode } = useSelector((store) => store.summaryTree);
  const { user } = useSelector((store) => store.user);
  const { data } = useGetSummaryTree(section);
  const treeWords = extractTreeWords(
    selectedNode[section],
    data,
    section,
    section !== "surah" ? "alphabet" : "surah_name"
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPage]);


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
    texts_search: removeTashkel(searchTerm?.current?.value || ""),
    // sort_by: selectedSortOption?.id === 2 ? "modified" : "created",
    sort_by: selectedSortOptionNew?.id === 3 ? 'modified' : "created",
    sort_type: selectedSortOptionNew?.id === 2 ? "asc" : "desc",
  };
  const [selectedOptions, setSelectedOptions] = useState(emptyOptions);
  const { data: options } = useGetNarrationFilterOptions();
  const treeOptions = makeTreeOptions(treeWords, section);

  const subjectOptions = sort([
    ...new Set(options?.map((option) => option?.alphabet)),
  ]);
  const [selectedSubject, setSelectedSubject] = useState();

  const subSubjectOptions = sort([
    ...new Set(
      options
        ?.filter(
          (option) => option.alphabet === selectedSubject || !selectedSubject
        )
        ?.map((option) => option?.subject)
    ),
  ]);
  const [selectedSubSubject, setSelectedSubSubject] = useState();

  const { data: narrationList, isLoading } = useGetNarrationList(selectedPage, {
    // ...selectedOptions,
    alphabet: selectedSubject,
    subject: selectedSubSubject,
    ...serachOptions,
    user_id: personal ? user.id : null,
    // ...treeOptions,
  });
  const handleSelect = (newValue, category) => {
    setSelectedOptions({ ...selectedOptions, [category]: newValue });
  };

  const handleDelete = async (narrationId, pass) => {
    if (pass !== "delete") return;
    const url = apiUrls.narration.get(narrationId);
    try {
      const resp = await customApiCall.delete({ url });
      queryClient.refetchQueries();
    } catch { }
  };


  const { data: allSentStatus } = useGetSharedNarrations()

  const { mutate } = useShareNarration();
  const { mutate: updateNarration } = useUpdateSharedNarration();

  const handleSend = async (narrationId) => {
    if (!narrationId) return
    const sentStatus = getSingleNarrationSentStatus({ narrationId, allSentStatus })
    const id = getSharedNarrationIdFromNarrationId({ narrationId, allSentStatus })

    if (!sentStatus) {

      mutate({ narrationId, });
    } else {
      updateNarration({ narrationId, id, data: { status: shareNarrationStatus.PENDING } });
    }
  };

  let { data: subject } = useGetSubjects();
  subject = subject?.subjects || [];
  const [searchStarted, setSearchStarted] = useState(true);
  const [flag, setFlag] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <div className="sm:mr-12">
      <section
        className={`w-full flex items-center justify-center`}
        style={{
          transition: "all 1s linear",
          marginTop: "7rem",
          paddingTop: "8rem",
          minHeight: searchStarted ? "6rem" : "calc(100vh - 16rem)",
        }}
      >
        <div className={`px-2 ${searchStarted ? "w-full" : "sm:w-3/4"}`}>
          <section
            className={`relative grid ${searchStarted
              ? "grid-cols-[1fr_1fr_1fr_1fr_1fr]"
              : "grid-cols-[1fr_1fr]"
              } gap-4 sm:gap-8 py-2 -px-4`}
          >
            <InputOld
              className={`w-full ${searchStarted ? "col-span-2" : "col-span-1"
                }`}
              type="search"
              reference={searchTerm}
              placeholder="جستجو در متن عربی احادیث"
            // onChange={() => queryClient.refetchQueries()}
            />
            <InputWithSuggestion
              parentClassName={`w-full ${searchStarted ? "col-span-2" : "col-span-1"
                }`}
              className="w-full"
              reference={searchSubject}
              placeholder="#هشتگ"
              suggestions={subject}
            // onChange={() => queryClient.refetchQueries()}
            />
            <div
              className={`w-full flex justify-center items-center ${searchStarted ? "col-span-1" : "col-span-2"
                } `}
            >
              <Button
                onClickHandler={() => {
                  setFlag(!flag);
                  setSearchStarted(true);
                  setSelectedPage(1);
                  queryClient.refetchQueries();
                }}
                variant="primary"
                className={`${searchStarted ? "w-full" : "w-1/3 sm:w-1/5"}`}
              // style={{}}
              >
                جستجو
              </Button>
            </div>
          </section>
          {/* <div className="flex justify-center items-center ">
            <Button
              onClickHandler={() => {
                setSearchStarted(true);
                queryClient.refetchQueries();
              }}
              variant="primary"
              className="w-1/3 mt-8"
            >
              جست و جو
            </Button>
          </div> */}
        </div>
      </section>

      {searchStarted && (
        <div className="mt-3">
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

          <article
            style={{
              // display: "flex",
              // flexDirection: "column",
              // justifyContent: "space-between",
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
                  className="p-3  px-2  sm:px-4 mb-4 mx-4 flex items-center justify-between"
                  style={{
                    boxShadow: "-3px 8px 16px -3px #00000026",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    fontSize: "16px",
                    color: "var(--neutral-color-500)",
                  }}
                >
                  <div style={{ fontSize: isSmallScreen ? "10px" : "14px" }}>
                    <span>{narrationList?.number_of_records || 0}</span>
                    &nbsp;
                    <span>حدیث یافت شد </span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex gap-1 items-center">
                      <p className="hidden sm:block">فیلتر :</p>
                      <div className="w-20 sm:w-50 relative">
                        <Dropdown
                          className="h-8 "
                          selected={selectedSubject}
                          setSelected={setSelectedSubject}
                          items={subjectOptions}
                          placeholder="موضوع"
                        />
                        <AiOutlineClose
                          color="var(--neutral-color-400)"
                          className="absolute left-8 top-3 w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setSelectedSubject("");
                          }}
                        />
                      </div>
                      <div className="w-25 sm:w-50 ml-0 sm:ml-8 relative">
                        <Dropdown
                          className="h-8 "
                          selected={selectedSubSubject}
                          setSelected={setSelectedSubSubject}
                          items={subSubjectOptions}
                          placeholder="زیر موضوع"
                        />
                        <AiOutlineClose
                          color="var(--neutral-color-400)"
                          className="absolute left-8 top-3 w-4 h-4 cursor-pointer"
                          onClick={() => {
                            setSelectedSubSubject("");
                          }}
                        />
                      </div>
                      <p className="hidden sm:block">مرتب سازی :</p>
                      <div className="w-20 sm:w-30">
                        <Dropdown
                          className="h-8 "
                          dataKey="title"
                          selected={selectedSortOptionNew}
                          setSelected={setSelectedSortOptionNew}
                          items={sortOptionsNew}
                        />
                      </div>

                      {/* <div className="w-25 sm:w-35">
                        <Dropdown
                          className="h-8 "
                          dataKey="title"
                          selected={selectedSortOption}
                          setSelected={setSelectedSortOption}
                          items={dropdown}
                        />
                      </div>
                      <div className="w-20 sm:w-30">
                        <Dropdown
                          className="h-8 "
                          dataKey="title"
                          selected={selectedSortType}
                          setSelected={setSelectedSortType}
                          items={sortTypeOptions}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
                <section className="h-full px-4" style={{}}>
                  {narrationList?.results?.map((narration, index) => (
                    <SingleNarration
                      key={index}
                      onEdit={() => navigate(`${narration?.id}`)}
                      onDelete={(pass) => handleDelete(narration?.id, pass)}
                      onSend={() => handleSend(narration?.id)}
                      sentStatus={getSingleNarrationSentStatus({ narrationId: narration?.id, allSentStatus })}
                      narration={narration}
                      showSummary={false}
                      personal={personal}
                    />
                  ))}
                </section>
              </>
            )}
          </article>
          {narrationList?.last > 0 && (
            <Pagination
              className=" m-4 mb-16"
              noOfPages={narrationList.last}
              selected={selectedPage}
              setSelected={setSelectedPage}
            />
          )}
        </div>
      )}
    </div>
  );
};
