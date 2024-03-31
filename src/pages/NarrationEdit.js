import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "../components/general/ContentContainer";
import Input from "../components/ui/input";
import Tag from "../components/ui/tag";
import { AiOutlinePlus, AiOutlinePlusCircle } from "react-icons/ai";
import Dropdown from "../components/ui/dropdown";
import {
  useGetBooks,
  useGetImam,
  useGetNarrationFilterOptions,
  useGetNarrationIndividual,
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
import { isAdmin, isLoggedIn, isSuperAdmin } from "../utils/acl";
import { TextAndAction } from "./Bookmarks";

export const NarrationEdit = () => {
  const { narrationId } = useParams();
  const { user } = useSelector((store) => store.user);

  const navigate = useNavigate();

  const { data: narration, isLoading } = useGetNarrationIndividual(
    narrationId || 0,
    !isSuperAdmin(user) ? user : undefined
  );

  useEffect(() => {
    if (
      narration &&
      !narration?.subjects?.length &&
      !narration?.content_summary_tree?.length
    )
      window.scrollTo({ left: 0, top: window.innerHeight, behavior: "smooth" });
  }, [!!narration]);
  // if (!isLoggedIn(user)) return <Navigate to={"/"} />;
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
            onClickHandler={() => navigate("/")}
          >
            اتمام ویرایش و بازگشت
          </Button>
        </div>
      )}
    </section>
  );
};
