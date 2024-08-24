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
import { SingleNarration } from "./NarrationWarehouseLT";
import { isLoggedIn } from "../utils/acl";

export const TextAndAction = ({
  message,
  buttonText,
  onClick,
  hasButton = true,
}) => {
  return (
    <div
      style={{
        flexDirection: "column",
        position: "fixed",
        zIndex: 103,
      }}
      className="w-100 h-100 top-1/4 left-1/3  flex  items-center justify-center"
    >
      <p>{message}</p>
      {hasButton && (
        <Button variant="primary" className="p-3 mt-8" onClickHandler={onClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export const Bookmarks = () => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoaindg] = useState(false);
  const [bookmarkedNarrations, setBookmarkedNarrations] = useState([]);
  useEffect(() => {
    const getBookmarks = async () => {
      try {
        setIsLoaindg(true);
        const url = apiUrls.narration.bookmark;
        const response = await customApiCall.get({ url });
        setBookmarkedNarrations(response);
      } catch {
      } finally {
        setIsLoaindg(false);
      }
    };
    getBookmarks();
  }, []);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleDeleteBookmark = async (id) => {
    try {
      const url = apiUrls.narration.bookmarkRemove(id);
      const response = await customApiCall.delete({ url });
      try {
        const url = apiUrls.narration.bookmark;
        const response = await customApiCall.get({ url });
        setBookmarkedNarrations(response);
      } catch { }
    } catch { }
  };
  const navigate = useNavigate();

  const user = getUserFromLocalStorage();

  const onBookmarkChange = async () => {
    try {
      const url = apiUrls.narration.bookmark;
      const response = await customApiCall.get({ url });
      setBookmarkedNarrations(response);
    } catch { }
  };
  // queryClient.invalidateQueries([
  //   "narrationList",
  //   selectedPage,
  //   {
  //     ...selectedOptions,
  //     ...serachOptions,
  //     ...treeOptions,
  //     user_id: personal ? user.id : null,
  //   },
  // ]);

  if (!isLoggedIn(user))
    return (
      <TextAndAction
        onClick={() => navigate("/login")}
        buttonText="ورود"
        message="برای دیدن نشان شده های خود لطفا ابتدا وارد شوید"
      />
    );

  if (!bookmarkedNarrations?.length && !isLoading)
    return (
      <TextAndAction
        hasButton={false}
        message="هنوز هیچ حدیثی را نشان نکردی!"
      />
    );

  if (bookmarkedNarrations?.length)
    return (
      <div className="sm:mr-12 pt-2">
        <div className="mt-4">
          <article
            style={{
              // display: "flex",
              // flexDirection: "column",
              // justifyContent: "space-between",
              minHeight: "80vh",
              position: "relative",
            }}
          >
            {/* {isLoading && (
              <CircularProgress
                className="absolute top-1/2 left-1/2 "
                color="success"
              />
            )} */}
            {/* {!isLoading && ( */}
            <>
              <section className="h-full px-4" style={{}}>
                {bookmarkedNarrations?.map((bookmark, index) => {
                  const narration = {
                    ...bookmark.narration,
                    is_bookmarked: true,
                    bookmarks: [{ id: bookmark.id }],
                  };
                  return (
                    <SingleNarration
                      key={bookmark.id}
                      narration={narration}
                      onBookmarkChange={onBookmarkChange}
                    // onBookmark={() => handleDeleteBookmark(bookmark.id)}
                    />
                  );
                })}
              </section>
            </>
            {/* )} */}
          </article>
        </div>
      </div>
    );
};
