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
import Input, { InputOld } from "../components/ui/input";
import { InputWithState } from "../components/general/InputWithState";
import InputWithSuggestion from "../components/general/InputWithSuggestion";
import {
  Box,
  CircularProgress,
  Popper,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { AiFillDelete, AiFillEdit, AiOutlineClose } from "react-icons/ai";
import apiUrls from "../api/urls";
import { useNavigate } from "react-router-dom";
import { customApiCall } from "../utils/axios";
import Button from "../components/ui/buttons/primary-button";
import { BiCloset, BiNote } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { FaComment, FaRegCommentDots, FaRegStickyNote } from "react-icons/fa";
import { CustomModal, CustomModal2 } from "../components/general/CustomModal";
import { BsChatLeftText } from "react-icons/bs";
import FilterModal, {
  FilterModalLT,
} from "../components/show-traditions/filter-modal";
import { extractTreeWords, makeTreeOptions } from "../utils/manipulation";
import { NarrationSummaryNavbar } from "../components/NarrationSummaryNavbar";
import { getUserFromLocalStorage } from "../utils/localStorage";
import { getFont, isAdmin, isLoggedIn, isSuperAdmin } from "../utils/acl";
import { setDataLoaded } from "../features/summaryTree/summaryTreeSlice";
import { MdBookmarkAdd } from "react-icons/md";
import axios from "axios";
import { TextAndAction } from "./Bookmarks";
import { CiBookmarkPlus } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { LuBookmarkPlus } from "react-icons/lu";
import { RiEdit2Line } from "react-icons/ri";
import styled from "@emotion/styled";
import { tooltipClasses } from "@mui/material/Tooltip";
import { NarrationSearch } from "./NarrationSearch";
import { useQueryClient } from "@tanstack/react-query";
import { Label, PendingNarrationSentLabel, RejectedNarrationSentLabel, SendingNarrationSentLabel, AcceptedNarrationSentLabel } from "../components/ui/Label";
import { FiSend } from "react-icons/fi";

export const removeTashkel = (s) => s.replace(/[\u064B-\u0652]/gm, "");

const getWords = (text) => {
  return removeTashkel(text)
    .replaceAll(".", "")
    .replaceAll("@", "")
    .replaceAll("$", "")
    .replaceAll("/", "")
    .replaceAll("t", "")
    .replaceAll("\t", "")
    .split(" ")
    .filter((s) => s.length > 2 && !s.includes("  "));
};

const textIsRelevant = (text, relevantParts) => {
  if (!text?.length > 0 || !relevantParts?.length > 0) return;
  const goodText = removeTashkel(text)
    .replaceAll(".", "")
    .replaceAll("@", "")
    .replaceAll("/", "")
    .replaceAll("t", "")
    .replaceAll("\t", "")
    .replaceAll("$", "");

  const isRelevant = relevantParts?.some((part) => {
    return getWords(part).every((t, i) => goodText.includes(t));
  });
  return isRelevant;
};

function ArabicTextComponent({
  children,
  footnotes = [],
  className,
  relevantParts,
}) {
  const { user } = useSelector((store) => store.user);
  let dollar = false;
  let atSign = true;
  let noteIndex = -1;
  const [showModal, setShowModal] = useState(false);
  const [footnote, setFootnote] = useState("");
  const singleLangParts = children
    .split("ظظظ")
    ?.filter(
      (singleLangText) => singleLangText.replaceAll(" ", "")?.length > 10
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
        const isRelevant = textIsRelevant(singleLangText, relevantParts);
        return (
          <>
            <div
              className={`inline-block ${isRelevant ? "bg-[#ffff007d]" : ""}`}
            >
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

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "#0bab64",
    boxShadow: theme.shadows[1],
    fontSize: 14,
    fontFamily: "IRANSansWeb",
  },
}));

export const SingleNarration = ({
  narration,
  onDelete,
  onEdit,
  onSend,
  sentStatus,
  onBookmarkChange,
  showSummary = false,
  lvl1,
  lvl2,
  lvl3,
  section,
  className,
  hasBookmark = true,
  personal,
}) => {
  const [isSummary, setIsShowSummary] = useState(showSummary);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [short, setShort] = useState(true);
  const { user } = useSelector((store) => store.user);

  const [open, setOpen] = useState(false);
  const pass = useRef();
  const relevantSummaryTree = (narration?.content_summary_tree || []).filter(
    (contentItem) => {
      if (section !== "surah")
        return (
          contentItem.alphabet === lvl1 &&
          contentItem.alphabet !== "بیان" &&
          contentItem.subject === lvl2 &&
          contentItem.sub_subject === lvl3
        );
      else
        return (
          contentItem.alphabet === "بیان" &&
          contentItem.verse?.surah_name === lvl1 &&
          contentItem.verse?.verse_no === lvl2
        );
    }
  );

  const [isBookmarked, setIsBookmarked] = useState(narration?.is_bookmarked);
  useEffect(() => {
    setIsBookmarked(narration?.is_bookmarked);
  }, [narration?.is_bookmarked]);

  const [openTooltip, setOpenTooltip] = useState(false);
  const handleBookmark = async () => {
    // if (!onBookmark) {
    try {
      if (!isBookmarked) {
        setIsBookmarked(true);
        const url = apiUrls.narration.bookmark;
        await customApiCall.post({ url, data: { narration_id: narration.id } });
        setOpenTooltip(true);
      } else {
        setIsBookmarked(false);
        const bookmarkId = narration?.bookmarks?.length
          ? narration?.bookmarks[0]?.id
          : 0;
        const url = apiUrls.narration.bookmarkRemove(bookmarkId);
        await customApiCall.delete({ url });
        setOpenTooltip(true);
      }
    } catch {
    } finally {
      if (onBookmarkChange) {
        console.log(onBookmarkChange);
        onBookmarkChange();
      }
    }
    // } else {
    // onBookmark();
    // }
  };

  useEffect(() => {
    if (openTooltip)
      setTimeout(() => {
        setOpenTooltip(false);
      }, 1000);
  }, [openTooltip]);
  const r = useRef();

  return (
    <ContentContainer
      // title={`${narration.book.name}`}
      title={`${narration.imam.name} می فرمایند:`}
      actionComponent={
        <div className=" gap-4 items-center flex">
          <>
            {sentStatus === 'sending' &&
              <SendingNarrationSentLabel />
            }
            {sentStatus === 'pending' &&

              <PendingNarrationSentLabel />}
            {sentStatus === 'accepted' &&
              <AcceptedNarrationSentLabel />
            }
            {sentStatus === 'rejected' &&
              <RejectedNarrationSentLabel />
            }
            {(isAdmin(user) && personal && (!['sending', 'pending', 'accepted'].includes(sentStatus))) && onSend && (
              <FiSend
                className="cursor-pointer  w-5 h-5"
                onClick={onSend}
              />
            )}
            {(isSuperAdmin(user) || personal) && onDelete && (
              <RiDeleteBin2Line
                className="cursor-pointer w-5 h-5"
                onClick={() => setOpen(true)}
              />
            )}
            {(isSuperAdmin(user) || personal) && onEdit && (
              <RiEdit2Line
                className="cursor-pointer  w-5 h-5"
                onClick={onEdit}
              />
            )}
            {isLoggedIn(user) && (
              // && hasBookmark
              <>
                <LightTooltip
                  PopperProps={{
                    disablePortal: true,
                  }}
                  // onClose={handleTooltipClose}
                  open={openTooltip}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title={!isBookmarked ? "نشان حذف شد !" : "نشان شد !"}
                  placement="top-end"
                >
                  <span ref={r}>
                    {isBookmarked ? (
                      <FaBookmark
                        className="cursor-pointer w-5 h-5"
                        onClick={handleBookmark}
                        fill="green"
                      />
                    ) : (
                      <LuBookmarkPlus
                        className="cursor-pointer w-5 h-5"
                        onClick={handleBookmark}
                      />
                    )}
                  </span>
                </LightTooltip>

                {/* <Popper id="simple-popper" open={true} anchorEl={r.current}>
                  <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>
                    The content of the Popper.
                    </Box>
                </Popper> */}
              </>
            )}

          </>
        </div>
      }
      className={`mb-4 relative min-h-30 ${className}`}
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
              آیا از حذف حدیث مطمئن هستید؟ لطفا در کادر زیر کلمه delete را وارد
              کنید:
            </p>
            <InputOld reference={pass} />
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
            <div
              className="w-full"
              style={{
                fontSize:
                  (isSuperAdmin(user) ? getFont(1.1) : 1.1) *
                  (isSmallScreen ? 1 : 1.2) +
                  "rem",
                maxWidth: "calc(100% - 100px)",
              }}
            >
              <p className="">
                <span>{narration.book.name}</span>
                <span>{" - "}</span>
                <span>
                  {narration.book_vol_no ? `جلد ${narration.book_vol_no}` : ""}
                  &nbsp;
                  {narration.book_page_no
                    ? `-  صفحه ${narration.book_page_no}`
                    : ""}
                </span>
              </p>
              <p
                style={{
                  color: "brown",
                }}
              >
                {narration.narrator}
              </p>
            </div>
            {showSummary && (
              <Button
                className="absolute left-2"
                onClickHandler={() => setIsShowSummary(true)}
                variant="secondary"
                style={{ fontSize: isSmallScreen ? "10px" : "12px" }}
              >
                نمایش خلاصه
              </Button>
            )}
          </div>
          <p>
            <ArabicTextComponent
              relevantParts={relevantSummaryTree?.map((sT) => sT.summary)}
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
                fontSize:
                  (isSuperAdmin(user) ? getFont(1.2) : 1.2) *
                  (isSmallScreen ? 1 : 1.2) +
                  "rem",
                marginRight: "12px",
              }}
            >
              خلاصه قسمت های مرتبط با موضوع حدیث:
            </span>
            <Button
              className="absolute left-0 "
              onClickHandler={() => setIsShowSummary(false)}
              variant="secondary"
              style={{ fontSize: isSmallScreen ? "10px" : "12px" }}
            >
              نمایش متن کامل
            </Button>
          </div>
          <div>
            {relevantSummaryTree.map((contentItem, subIndex) => {
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

                  <div className="flex items-start flex-col sm:flex-row justify-between w-full pr-3">
                    <ArabicTextComponent
                      className="block w-full sm:w-[48%]"
                      children={contentItem.summary}
                    />
                    <p
                      className=" sm:w-[48%]"
                      style={{
                        fontSize:
                          (isSuperAdmin(user) ? getFont(1.4) : 1.4) + "rem",
                      }}
                    >
                      {contentItem.expression}
                    </p>

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

export const NarrationWarehouseLT = ({ personal = false }) => {
  const navigate = useNavigate();
  const [selectedPage, setSelectedPage] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const queryClient = useQueryClient();
  const searchTerm = useRef();
  const searchSubject = useRef();
  const { section, selectedNode } = useSelector((store) => store.summaryTree);
  const { user } = useSelector((store) => store.user);
  const { data: rawData, isLoading: tableOfContentsIsLoading } = useGetSummaryTree(section, user, personal);
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

  const { data: rawNarrationList, isLoading } = useGetNarrationList(selectedPage, {
    ...selectedOptions,
    ...serachOptions,
    ...treeOptions,
    user_id: personal ? user.id : null,
  });

  const narrationListResult = rawNarrationList?.results?.filter((e) => {
    if (section === "bank")
      return true
    const hasBayan = e?.content_summary_tree?.some(item => (
      (item.alphabet === "بیان") &&
      (item?.verse?.verse_no === treeOptions?.verse_no) &&
      (item?.verse?.surah_name === treeOptions?.surah_name)
    ))
    const hasRelevantVerse = e?.content_summary_tree?.some(item => (
      (item.alphabet === treeOptions.alphabet) &&
      (item.subject === treeOptions.subject) &&
      (item.sub_subject === treeOptions.sub_subject) &&
      (item?.verse?.verse_no) &&
      (item?.verse?.surah_name)
    ))

    return (section === "surah" && hasBayan) || (section === "narration" && !hasBayan)
      || (section === "verse" && !hasBayan && hasRelevantVerse);
  });
  const narrationList = { ...rawNarrationList, results: narrationListResult }


  const onBookmarkChange = () =>
    queryClient.invalidateQueries([
      "narrationList",
      selectedPage,
      {
        ...selectedOptions,
        ...serachOptions,
        ...treeOptions,
        user_id: personal ? user.id : null,
      },
    ]);

  const handleSelect = (newValue, category) => {
    setSelectedOptions({ ...selectedOptions, [category]: newValue });
  };

  const handleDelete = async (narrationId, pass) => {
    if (pass !== "delete") return;
    const url = apiUrls.narration.get(narrationId);
    try {
      const resp = await customApiCall.delete({ url });
    } catch { }
    finally {
      queryClient.invalidateQueries([
        "narrationList",
        selectedPage,
        {
          ...selectedOptions,
          ...serachOptions,
          ...treeOptions,
          user_id: personal ? user.id : null,
        },
      ]);
      // queryClient.refetchQueries();
    }
  };

  let { data: subject, isLoading: dataIsLoading } = useGetSubjects();
  subject = subject?.subjects || [];

  const { treeIsOpen } = useSelector((state) => state.summaryTree);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.length > 0) dispatch(setDataLoaded(true));
  }, [data]);

  useEffect(() => {
    setSelectedPage(1);
  }, [selectedNode]);



  if (personal && !isLoggedIn(user))
    return (
      <TextAndAction
        onClick={() => navigate("/login")}
        buttonText="ورود"
        message="برای دیدن ذخیره شده های خود لطفا ابتدا وارد شوید"
      />
    );

  if (personal && !narrationList?.results?.length && !isLoading)
    return (
      <TextAndAction
        onClick={() => navigate("/save narration")}
        buttonText="حدیث جدید"
        message="هنوز هیچ حدیثی ذخیره نکردی. از اینجا شروع کن"
      />
    );
  return (
    <div className="sm:pr-8 pr-0">
      <NarrationSummaryNavbar />
      {section === "bank" && <NarrationSearch personal={personal} />}
      {section !== "bank" && (
        <>
          <FilterModalLT
            data={data}
            className={`${!isSmallScreen || treeIsOpen ? "w-full" : "w-0"
              }  sm:w-90 sm:mr-22 ${isSmallScreen && !treeIsOpen ? "top-0" : "top-30"
              } sm:top-50 right-0`}
            style={{
              zIndex: isSmallScreen ? "110" : 10,
              // height: "calc(100vh - 6rem)",
              position: "fixed",
              // visibility: !isSmallScreen || treeIsOpen ? "visible" : "hidden",
              // width: !isSmallScreen || treeIsOpen ? "100%" : "0",
              maxHeight: isSmallScreen && !treeIsOpen ? "0px" : "100vh",
              overflow: "hidden",
              // transition: "all 0.6s linear",
              // top: isSmallScreen && !treeIsOpen ? "0rem" : "12rem",
            }}
          />
          <div className=" mt-15 mr-0 sm:mr-[42rem] ">
            <article className="p-4 pt-20 grid gap-6 grid-cols-[1fr]">
              {(isLoading || tableOfContentsIsLoading || dataIsLoading) && (
                <CircularProgress
                  className="absolute top-1/2 sm:left-1/3 left-[44%]  "
                  color="success"
                />
              )}
              {!isLoading &&
                !dataIsLoading &&
                data?.length > 0 &&
                selectedNode[section] !== "" &&
                narrationList?.results?.length > 0 && (
                  <>
                    <div style={{ color: "var(--primary-color)", zIndex: 2 }}>
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
                    <section className="-mt-6" style={{}}>
                      {narrationList?.results?.map((narration, index) => {
                        return (
                          <SingleNarration
                            key={index}
                            onEdit={() =>
                              navigate(`/edit narration/${narration?.id}`)
                            }
                            onDelete={(pass) => handleDelete(narration?.id, pass)}

                            narration={narration}
                            showSummary={true}
                            lvl1={treeWords[0]}
                            lvl2={treeWords[1]}
                            lvl3={treeWords[2]}
                            section={section}
                            personal={personal}
                            onBookmarkChange={onBookmarkChange}
                          />
                        )
                      })}
                    </section>
                    {narrationList?.last > 1 && (
                      <Pagination
                        className="mb-8 mt-4"
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
      )}
    </div>
  );
};
