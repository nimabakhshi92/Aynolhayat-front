import { useEffect, useRef, useState } from "react";
import {
  useGetImam,
  useGetNarrationFilterOptions,
  useGetNarrationList,
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
import { SingleNarration, removeTashkel } from "./NarrationWarehouse";
import { Table } from "../components/ui/Table";
import { AcceptedNarrationSentLabel, Label, NarrationSentStatusLabel } from "../components/ui/Label";
import { isAdmin, isSuperAdmin } from "../utils/acl";

const sort = (array) => {
  if (!array) return array;
  const newArray = [...array];
  newArray.sort();
  return newArray;
};

export const Transfer = ({ }) => {
  const { user } = useSelector((store) => store.user);
  const superAdmin = isSuperAdmin(user)
  const navigate = useNavigate();


  const headers = [
    {
      label: 'عنوان حدیث',
      dataKey: "a",
      valueTransformation: (row) => row["a"],
    },
    {
      label: 'آدرس حدیث',
      dataKey: "b",
      valueTransformation: (row) => row["b"],
    },
    {
      label: 'وضعیت',
      dataKey: "c",
      valueTransformation: (row) => row["c"],
    },
    {
      label: 'تاریخ درخواست',
      dataKey: "d",
      valueTransformation: (row) => <NarrationSentStatusLabel status={row['d']} />,
    },
  ];

  const superAdminHeaders = [
    {
      label: 'عنوان حدیث',
      dataKey: "a",
      valueTransformation: (row) => row["a"],
    },
    {
      label: 'آدرس حدیث',
      dataKey: "b",
      valueTransformation: (row) => row["b"],
    },
    {
      label: 'فرستنده',
      dataKey: "c",
      valueTransformation: (row) => row["c"],
    },
    {
      label: 'وضعیت',
      dataKey: "c",
      valueTransformation: (row) => row["c"],
    },
    {
      label: 'تاریخ درخواست',
      dataKey: "d",
      valueTransformation: (row) => <NarrationSentStatusLabel status={row['d']} />,
    },
  ];

  const dat3a = [
    {
      a: 'حدیث 1',
      id: 123,
      b: 'دیوار',
      c: 'مسلمان',
      d: 'accepted'
    },
    {
      a: 'حدیث 2',
      b: 'پنجره',
      c: 'توحید',
      d: 'pending'
    },
    {
      a: 'حدیث 3',
      b: 'کامپیوتر',
      c: 'عدل',
      d: 'rejected'
    }


  ]

  const handleRowClick = (row) => {
    navigate(`/shared-narrations/${row?.id}?`)
  }
  return (
    <Stack className="justify-center items-center">

      <Table
        data={dat3a}
        headers={headers}
        onRowClick={superAdmin ? handleRowClick : null}
        className='mt-4'
        style={{
          width: '80%',
        }} />
    </Stack>

  );
};
