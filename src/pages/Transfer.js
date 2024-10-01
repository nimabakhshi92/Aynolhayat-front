import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetSharedNarrations
} from "../api/hooks/allHooks";
import { NarrationSentStatusLabel } from "../components/ui/Label";
import { Table } from "../components/ui/Table";
import { convertGregorianToJalali } from "../functions/general";
import { isCheckerAdmin } from "../utils/acl";
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
