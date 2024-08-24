import { useEffect, useRef, useState } from "react";
import {
  useGetImam,
  useGetNarrationFilterOptions,
  useGetNarrationList,
  useGetSharedNarrations,
  useGetSubjects,
  useGetSummaryTree,
  useGetVerse,
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
import { CircularProgress, Stack, useMediaQuery } from "@mui/material";
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
import { SingleNarration, removeTashkel } from "./NarrationWarehouseLT";
import { Table } from "../components/ui/Table";
import { AcceptedNarrationSentLabel, Label, NarrationSentStatusLabel } from "../components/ui/Label";
import { isAdmin, isCheckerAdmin, isSuperAdmin } from "../utils/acl";
import { convertGregorianToJalali } from "../functions/general";
import { shareNarrationStatus } from "../utils/enums";


const checkerAdminStatusRanks = {
  [shareNarrationStatus.TRANSFERRED]: 1,
  [shareNarrationStatus.ACCEPTED]: 2,
  [shareNarrationStatus.REJECTED]: 3,
  [shareNarrationStatus.CHECKING]: 4,
  [shareNarrationStatus.PENDING]: 5,
}

const nonCheckerAdminStatusRanks = {
  [shareNarrationStatus.TRANSFERRED]: 1,
  [shareNarrationStatus.ACCEPTED]: 2,
  [shareNarrationStatus.PENDING]: 3,
  [shareNarrationStatus.CHECKING]: 4,
  [shareNarrationStatus.REJECTED]: 5,
}

const getStatusRank = (checkerAdmin, status) => {
  const rankStatusMapping = checkerAdmin ? checkerAdminStatusRanks : nonCheckerAdminStatusRanks
  return rankStatusMapping[status] || 0
}


export const Transfer = ({ }) => {
  const { user } = useSelector((store) => store.user);
  const checkerAdmin = isCheckerAdmin(user)
  const navigate = useNavigate();

  const { data: allSentStatus } = useGetSharedNarrations()

  const tableData = allSentStatus?.map(narrationStatus => {
    const narration = narrationStatus?.narration
    const bookVolText = narration?.book_vol_no ? `جلد ${narration?.book_vol_no}` : " "
    const bookPageText = narration?.book_page_no ? `-  صفحه ${narration?.book_page_no}` : ""
    return {
      id: narrationStatus?.id,
      name: narration?.name,
      content: narration?.content?.substr(0, 150) + '...',
      created: convertGregorianToJalali(narrationStatus?.created),
      modified: convertGregorianToJalali(narrationStatus?.modified),
      status: narrationStatus?.status,
      book: narration?.book?.name + ' ' + bookVolText + ' ' + bookPageText,
      senderName: narrationStatus?.sender?.username,
      narrationId: narration?.id
    }
  })



  tableData?.sort((a, b) => {
    const aStatusRank = getStatusRank(checkerAdmin, a?.status)
    const bStatusRank = getStatusRank(checkerAdmin, b?.status)
    if (aStatusRank !== bStatusRank) return bStatusRank - aStatusRank
    else {
      return b?.modified - a?.modified
    }

  })

  const headers = [
    {
      label: 'عنوان حدیث',
      dataKey: "name",
      valueTransformation: (row) => row["name"],
    },
    {
      label: 'قسمتی از متن',
      dataKey: "content",
      valueTransformation: (row) => row["content"],
    },
    {
      label: 'کتاب',
      dataKey: "book",
      valueTransformation: (row) => row["book"],
    },
    {
      label: 'وضعیت',
      dataKey: "status",
      valueTransformation: (row) => <NarrationSentStatusLabel status={row['status']} />,
    },
    {
      label: 'تاریخ درخواست',
      dataKey: "created",
      valueTransformation: (row) => row["created"],
    },

  ];

  const checkerAdminHeaders = [...headers, {
    label: 'فرستنده',
    dataKey: "senderName",
    valueTransformation: (row) => row["senderName"],
  },
  ]


  const handleRowClick = (row) => {
    // if (row['status'] === shareNarrationStatus.PENDING)
    navigate(`/shared-narrations/${row?.id}?`)
  }
  return (
    <Stack className="justify-center items-center">

      <Table
        data={tableData}
        headers={checkerAdmin ? checkerAdminHeaders : headers}
        onRowClick={checkerAdmin ? handleRowClick : null}
        className='mt-4 mr-8'
        style={{
          width: '95%',
        }} />
    </Stack>

  );
};
