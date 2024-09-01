import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  downloadNarrations,
  downloadNarrationsBackupFile,
  useGetDownloadNarrationsBackupList,
  useGetSharedNarrations
} from "../api/hooks/allHooks";
import { NarrationSentStatusLabel } from "../components/ui/Label";
import { Table } from "../components/ui/Table";
import { convertGregorianToJalali, getCurrentJalaliDate } from "../functions/general";
import { isAdmin, isCheckerAdmin } from "../utils/acl";
import Button from "../components/ui/buttons/primary-button";
import zipFileImage from '../assets/zip.png'
import { useState } from "react";
import { toast } from "react-toastify";

export const Download = ({ }) => {
  const { user } = useSelector((store) => store.user);
  const { data } = useGetDownloadNarrationsBackupList()

  const [isDisabled, setIsDisabled] = useState(false)
  const [isAdminDisabled, setIsAdminDisabled] = useState(false)
  const [progress, setProgress] = useState(undefined);
  const [aminProgress, setAdminProgress] = useState(undefined);

  const onDownloadProgress = progressEvent => {
    const total = progressEvent.total;
    const current = progressEvent.loaded;
    const percentage = Math.floor((current / total) * 100);
    setProgress(percentage);
  }

  const onDownloadAdminProgress = progressEvent => {
    const total = progressEvent.total;
    const current = progressEvent.loaded;
    const percentage = Math.floor((current / total) * 100);
    setAdminProgress(percentage);
  }

  const handleClick = async (filename) => {
    setIsDisabled(true)
    setProgress(0);
    try {
      await downloadNarrationsBackupFile({ filename, onDownloadProgress })
      toast.success('فایل با موفقیت ارسال شد')
    } catch {
      toast.error('مشکلی از سمت ما پیش آمده. لطفا بعدا امتحان کنید')
    } finally {
      setIsDisabled(false)
      setProgress(undefined);
    }
  }

  const handleAdminClick = async (filename) => {
    setIsAdminDisabled(true)
    setAdminProgress(0);
    try {
      await downloadNarrations({
        narrationIds: [], userId: user.id, filename: 'My Files - ' + filename,
        onDownloadProgress: onDownloadAdminProgress
      })
      toast.success('فایل با موفقیت ارسال شد')
    } catch {
      toast.error('مشکلی از سمت ما پیش آمده. لطفا بعدا امتحان کنید')
    } finally {
      setIsAdminDisabled(false)
      setAdminProgress(undefined);
    }
  }


  const adminFilename = getCurrentJalaliDate()
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
          {!isDisabled &&
            <Button variant={'primary'} onClickHandler={() => handleClick(fileName)}>دانلود</Button>
          }
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

      {isAdmin(user) &&
        <>
          <div className="mt-8">
            <span className=" t-2x-large text-[black]">
              احادیث من
            </span>
          </div>
          <div className="w-full h-[2px] " style={{ background: 'var(--neutral-color-600)' }} />
          <Stack className="" alignItems={'center'} gap={2} direction={'row'} >
            <img src={zipFileImage} className="w-7 h-7" />
            <a >{adminFilename}</a>
            {!isAdminDisabled &&
              <Button variant={'primary'} onClickHandler={() => handleAdminClick(adminFilename)}>دانلود</Button>
            }
          </Stack>

          {aminProgress < 100 && aminProgress >= 0 &&
            <div className="text-center flex justify-center items-center flex-col">

              <h1>{aminProgress} %</h1>

              <div className="w-1/2 h-[10px] absolute bg-[white] flex items-center mt-6 rounded" style={{
                border: '1px solid #ddd',
                overflow: 'hidden',
                zIndex: 4,
              }}>
                <div style={{
                  width: aminProgress + '%'
                }} className="h-2 bg-[green]"></div>
              </div>
            </div>
          }



        </>
      }
      {/* <div className="p-2 cursor-pointer"
            // onClick={() => downloadNarrations([308])}>
            // onClick={() => downloadNarrations([283, 180, 181, 183, 184, 212, 215, 308, 310])}>
            onClick={() => downloadNarrations([296, 300, 305, 308, 310, 313])}>
            <span>سه شنبه 1402/02/12 - 23:34:57</span>
          </div> */}

    </Stack>

  );
};
