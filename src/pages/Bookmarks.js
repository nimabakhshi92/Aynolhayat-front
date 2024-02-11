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
import { SingleNarration } from "./NarrationWarehouse";

export const Bookmarks = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [narrationList, setNarrationList] = useState([]);
  useEffect(() => {
    const getBookmarks = async () => {
      try {
        const url = apiUrls.narration.bookmark;
        const response = await customApiCall.get({ url });
        setNarrationList(response);
      } catch {}
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
        setNarrationList(response);
      } catch {}
    } catch {}
  };

  const user = getUserFromLocalStorage();
  console.log(user);
  if (user?.username === "nima@a.com" || user?.id === 2)
    return (
      <div
        style={{
          flexDirection: "column",
          position: "fixed",
          zIndex: 103,
        }}
        className="w-100 h-100 top-1/4 left-1/3  flex  items-center justify-center"
      >
        <p>برای دیدن نشان شده های خود لطفا ابتدا وارد شوید</p>
        <Button
          variant="primary"
          className="w-20 mt-8"
          onClickHandler={() => navigate("/login")}
        >
          ورود
        </Button>
      </div>
    );

  if (narrationList?.length)
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
                {narrationList?.map((narration, index) => (
                  <SingleNarration
                    key={narration.id}
                    narration={narration.narration}
                    onBookmark={() => handleDeleteBookmark(narration.id)}
                  />
                ))}
              </section>
            </>
            {/* )} */}
          </article>
        </div>
      </div>
    );
};
