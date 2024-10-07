import { Stack } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  downloadInstruction,
  downloadNarrations,
  downloadNarrationsBackupFile,
  useGetDownloadNarrationsBackupList
} from "../api/hooks/allHooks";
import zipFileImage from '../assets/zip.png';
import Button from "../components/ui/buttons/primary-button";
import { getCurrentJalaliDate } from "../functions/general";
import { isAdmin } from "../utils/acl";

export const Download = ({ }) => {
  const { user } = useSelector((store) => store.user);
  const { data } = useGetDownloadNarrationsBackupList()

  const [isDisabled, setIsDisabled] = useState(false)
  const [isAdminDisabled, setIsAdminDisabled] = useState(false)
  const [progress, setProgress] = useState(undefined);
  const [aminProgress, setAdminProgress] = useState(undefined);

  const [isInstructionsDisabled, setIsInstructionsDisabled] = useState(false)
  const [progressInstruction, setProgressInstruction] = useState(undefined);

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

  const onDownloadInstructionProgress = progressEvent => {
    const total = progressEvent.total;
    const current = progressEvent.loaded;
    const percentage = Math.floor((current / total) * 100);
    setProgressInstruction(percentage);
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


  const handleDownloadInstruction = async () => {
    setIsInstructionsDisabled(true)
    setProgressInstruction(0);
    try {
      await downloadInstruction({
        filename: 'Rahnama.zip',
        onDownloadProgress: onDownloadInstructionProgress
      })
      toast.success('فایل با موفقیت ارسال شد')
    } catch {
      toast.error('مشکلی از سمت ما پیش آمده. لطفا بعدا امتحان کنید')
    } finally {
      setIsInstructionsDisabled(false)
      setProgressInstruction(undefined);
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

      {/* <>
        <div className="mt-8">
          <span className=" t-2x-large text-[black]">
            راهنمای دانلود
          </span>
        </div>
        <div className="w-full h-[2px] " style={{ background: 'var(--neutral-color-600)' }} />
        <Stack className="" alignItems={'center'} gap={2} direction={'row'} >
          <a >برای دریافت راهنما کلیک کنید</a>
          {!isInstructionsDisabled &&
            <Button variant={'primary'} onClickHandler={() => handleDownloadInstruction()}>دانلود</Button>
          }
        </Stack>

        {progressInstruction < 100 && progressInstruction >= 0 &&
          <div className="text-center flex justify-center items-center flex-col">

            <h1>{progressInstruction} %</h1>

            <div className="w-1/2 h-[10px] absolute bg-[white] flex items-center mt-6 rounded" style={{
              border: '1px solid #ddd',
              overflow: 'hidden',
              zIndex: 4,
            }}>
              <div style={{
                width: progressInstruction + '%'
              }} className="h-2 bg-[green]"></div>
            </div>
          </div>
        }



      </> */}

    </Stack>

  );
};
