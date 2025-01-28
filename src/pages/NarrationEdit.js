import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  updateSharedNarrations,
  useGetNarrationIndividual,
  useGetSingleSharedNarration,
  useGetTotalQuran
} from "../api/hooks/allHooks";
import { NarrationEditForm } from "../components/NarrationSave/NarrationEditForm";
import { NarrationFootnoteEditForm } from "../components/NarrationSave/NarrationFootnoteEditForm";
import { NarrationSubjectEditForm } from "../components/NarrationSave/NarrationSubjectEditForm";
import { NarrationSummaryEditForm } from "../components/NarrationSave/NarrationSummaryEditForm";
import Button from "../components/ui/buttons/primary-button";
import { isCheckerAdmin, isLoggedIn, isSuperAdmin, isTaggerAdmin } from "../utils/acl";
import { shareNarrationStatus } from "../utils/enums";
import { TextAndAction } from "./Bookmarks";
import { BiLoader } from "react-icons/bi";

export const NarrationEdit = ({ checkOnly, myNarrations = false, saveNarration = false }) => {
  const { narrationId, sharedNarrationId } = useParams();
  const { user } = useSelector((store) => store.user);

  const navigate = useNavigate();

  const { data: narrationIndividual, isLoading } = useGetNarrationIndividual(
    narrationId || 0,
    ((isSuperAdmin(user) || isTaggerAdmin(user)) && !myNarrations) ? undefined : user
  );
  const { data: sharedNarration } = useGetSingleSharedNarration(sharedNarrationId);

  const narration = checkOnly ? sharedNarration?.narration : narrationIndividual

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
      return false
  }


  const { isLoading: quranIsLoading } = useGetTotalQuran()

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
    <section className="mt-8 pb-20 px-2 sm:px-4 ">
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
          {
            quranIsLoading ? (
              <Stack className="w-full h-20 items-center justify-center" >
                <BiLoader className="w-6 h-6 animate-spin" />
              </Stack>
            ) :
              <>
                <NarrationSubjectEditForm narration={narration} />
                <NarrationSummaryEditForm
                  narration={narration}
                  summaries={narration?.content_summary_tree || []}
                />
                <NarrationFootnoteEditForm narration={narration} />

              </>
          }
        </>
      )}
      {
        narration && (
          <div className="flex justify-end gap-4 mt-4 fixed bottom-8 left-8 shadow-lg">
            <Button
              type="button"
              variant="primary"
              className="w-40 h-8 "
              style={{ fontSize: "14px" }}
              onClickHandler={() => {
                navigate(-1)
              }
              }
            >
              اتمام ویرایش و بازگشت
            </Button>
          </div>
        )
      }
    </section >
  );
};
