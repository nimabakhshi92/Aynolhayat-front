import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  downloadNarrationsBackupFile,
  useGetDownloadNarrationsBackupList,
  useGetSharedNarrations
} from "../api/hooks/allHooks";
import { NarrationSentStatusLabel } from "../components/ui/Label";
import { Table } from "../components/ui/Table";
import { convertGregorianToJalali } from "../functions/general";
import { isCheckerAdmin } from "../utils/acl";
import Button from "../components/ui/buttons/primary-button";
import zipFileImage from '../assets/zip.png'
import { useState } from "react";

export const Download = ({ }) => {
  const { data } = useGetDownloadNarrationsBackupList()
  const [progress, setProgress] = useState(undefined);

  const onDownloadProgress = progressEvent => {
    const total = progressEvent.total;
    const current = progressEvent.loaded;
    const percentage = Math.floor((current / total) * 100);
    setProgress(percentage);
  }

  const handleClick = (filename) => {
    setProgress(0);
    downloadNarrationsBackupFile({ filename, onDownloadProgress })
  }
  return (
    <Stack className="pr-18 mt-2 absolute z-100 w-[90%]" direction={'column'} gap={2}>
      <div className="text-center w-full">
        <span className="t-4x-large text-[black] text-center">دانلود احادیث</span>
      </div>
      <div>
        <span className=" t-2x-large text-[black]">
          همه احادیث سایت
        </span>
      </div>
      <div className="w-full h-[2px] " style={{ background: 'var(--neutral-color-600)' }} />
      {data?.map(record => {
        const fileName = record.split('---')[0].replace('All- ', '')
        return <Stack alignItems={'center'} gap={2} direction={'row'} style={{
        }}>
          <img src={zipFileImage} className="w-7 h-7" />
          <a >{fileName}</a>
          <Button variant={'primary'} onClickHandler={() => handleClick(fileName)}>دانلود</Button>
        </Stack>
      })}
      {progress < 100 && progress >= 0 &&
        <div className="text-center flex justify-center items-center flex-col">

          <h1>{progress} %</h1>

          <div className="w-1/2 h-[10px] absolute bg-[white] flex items-center mt-6 rounded" style={{
            border: '1px solid #ddd',
            overflow: 'hidden',
            zIndex: 4,
          }}>
            <div style={{
              width: progress + '%'
            }} className="h-2 bg-[green]"></div>
          </div>
        </div>
      }
    </Stack>

  );
};
