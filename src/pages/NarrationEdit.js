import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "../components/general/ContentContainer";
import Input from "../components/ui/input";
import Tag from "../components/ui/tag";
import { AiOutlinePlus, AiOutlinePlusCircle } from "react-icons/ai";
import Dropdown from "../components/ui/dropdown";
import {
  duplicateSharedNarration,
  updateSharedNarrations,
  useGetBooks,
  useGetImam,
  useGetNarrationFilterOptions,
  useGetNarrationIndividual,
  useGetSingleSharedNarration,
  useGetSubjects,
  useGetSurah,
  useGetVerse,
} from "../api/hooks/allHooks";
import InputWithSuggestion from "../components/general/InputWithSuggestion";
import { AllNarrationFootnotes } from "../components/NarrationSave/NarrationFootnotes";
import { AllNarrationSummaries } from "../components/NarrationSave/NarrationSummaries";
import Button from "../components/ui/buttons/primary-button";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createNarration } from "../features/narrationSave/narrationSlice";
import { NarrationEditForm } from "../components/NarrationSave/NarrationEditForm";
import { NarrationSubjectEditForm } from "../components/NarrationSave/NarrationSubjectEditForm";
import { NarrationSummaryEditForm } from "../components/NarrationSave/NarrationSummaryEditForm";
import { NarrationFootnoteEditForm } from "../components/NarrationSave/NarrationFootnoteEditForm";
import { isAdmin, isCheckerAdmin, isLoggedIn, isSuperAdmin } from "../utils/acl";
import { TextAndAction } from "./Bookmarks";
import Modal from '@mui/material/Modal';
import { Stack } from "@mui/material";
import { shareNarrationStatus } from "../utils/enums";

export const NarrationEdit = ({ checkOnly }) => {
  const { narrationId, sharedNarrationId } = useParams();
  const { user } = useSelector((store) => store.user);

  const navigate = useNavigate();

  const { data: narrationIndividual, isLoading } = useGetNarrationIndividual(
    narrationId || 0,
    !isSuperAdmin(user) ? user : undefined
  );

  const { data: sharedNarration } = useGetSingleSharedNarration(sharedNarrationId);

  const narration = checkOnly ? sharedNarration?.narration : narrationIndividual

  console.log('checkOnly: ', checkOnly)
  console.log('narration: ', narration)
  console.log('sharedNarration: ', sharedNarration)
  console.log('narrationIndividual: ', narrationIndividual)

  useEffect(() => {
    if (
      narration &&
      !narration?.subjects?.length &&
      !narration?.content_summary_tree?.length
    )
      window.scrollTo({ left: 0, top: window.innerHeight, behavior: "smooth" });
  }, [!!narration]);

  const checkShareRequest = async () => {
    try {
      await updateSharedNarrations({ id: sharedNarrationId, data: { status: shareNarrationStatus.CHECKING } })
      // await duplicateSharedNarration({ narrationId: narration?.id })
      toast.success('عملیات مورد نظر انجام شد')
      navigate('/transfer')
    } catch {
      toast.error('متاسفانه عملیات مورد نظر انجام نشد')
      navigate('/transfer')
    }
  }


  const rejectShareRequest = async () => {
    try {
      await updateSharedNarrations({ id: sharedNarrationId, data: { status: shareNarrationStatus.REJECTED } })
      toast.success('عملیات مورد نظر انجام شد')
      navigate('/transfer')
    } catch {
      toast.error('متاسفانه عملیات مورد نظر انجام نشد')
      navigate('/transfer')
    }
  }


  const acceptShareRequest = async () => {
    try {
      await updateSharedNarrations({ id: sharedNarrationId, data: { status: shareNarrationStatus.ACCEPTED } })
      // await duplicateSharedNarration({ narrationId: narration?.id })
      toast.success('عملیات مورد نظر انجام شد')
      navigate('/transfer')
    } catch {
      toast.error('متاسفانه عملیات مورد نظر انجام نشد')
      navigate('/transfer')
    }
  }

  const isButtonShown = (status, newStatus) => {
    if (status === shareNarrationStatus.PENDING)
      return newStatus === shareNarrationStatus.CHECKING
    if (status === shareNarrationStatus.CHECKING)
      return newStatus === shareNarrationStatus.REJECTED || newStatus === shareNarrationStatus.ACCEPTED
    if (status === shareNarrationStatus.ACCEPTED)
      return newStatus === shareNarrationStatus.REJECTED
  }


  // if (!isLoggedIn(user)) return <Navigate to={"/"} />;
  if (checkOnly && !isCheckerAdmin(user))
    return <Navigate to={"/"} />
  if (!isLoggedIn(user))
    return (
      <TextAndAction
        onClick={() => navigate("/login")}
        buttonText="ورود"
        message="برای ذخیره حدیث شحصی لطفا ابتدا وارد شوید"
      />
    );

  return (
    <section className="mt-8 pb-4 px-2 sm:px-4 ">
      <div></div>
      {checkOnly &&
        <div className="-mt-8 " style={{
          width: '100vw',
          height: '100vh',
          right: -10,
          left: -10,
          position: 'fixed',
          zIndex: 10,
          backgroundColor: '#ffffff01'
          // backgroundColor: '#f00'
        }}>
          <Stack className="w-full bg-[white] justify-center" flexDirection={'row'}
            style={{ borderBottom: '1px solid var(--neutral-color-400)' }}
          >
            <Stack className="w-2/3 px-10 h-15  justify-around items-center"
              flexDirection={'row'}
            >
              {isButtonShown(sharedNarration?.status, shareNarrationStatus.CHECKING) &&
                <Button variant={'info'} className='w-35 h-10'
                  onClickHandler={() => checkShareRequest()}
                >
                  در حال بررسی
                </Button>
              }

              {isButtonShown(sharedNarration?.status, shareNarrationStatus.REJECTED) &&
                <Button variant={'primary'} className='w-35 h-10' style={{ backgroundColor: 'red' }}
                  onClickHandler={() => rejectShareRequest()}
                >
                  نیاز به تغییر
                </Button>
              }

              {isButtonShown(sharedNarration?.status, shareNarrationStatus.ACCEPTED) &&
                <Button variant={'primary'} className='w-35 h-10'
                  onClickHandler={() => acceptShareRequest()}
                >
                  تایید
                </Button>
              }

              <Button variant={'secondary'} className='w-35 h-10'
                onClickHandler={() => navigate(-1)}
              >
                بازگشت
              </Button>


            </Stack>
          </Stack>


        </div>
      }
      <NarrationEditForm narration={narration} />
      {narration && (
        <>
          <NarrationSubjectEditForm narration={narration} />
          <NarrationSummaryEditForm
            narration={narration}
            summaries={narration?.content_summary_tree || []}
          />
          <NarrationFootnoteEditForm narration={narration} />
        </>
      )}
      {narration && (
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            variant="primary"
            className="w-40 h-8"
            style={{ fontSize: "14px" }}
            onClickHandler={() => {
              if (!isSuperAdmin(user))
                navigate("/my-narrations")
              else {
                navigate("/")
              }
            }
            }
          >
            اتمام ویرایش و بازگشت
          </Button>
        </div>
      )}
    </section>
  );
};
