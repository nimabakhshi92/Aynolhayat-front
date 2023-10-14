import { useEffect, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";
import Dropdown from "../ui/dropdown";
import Input from "../ui/input";
import {
  useGetBooks,
  useGetImam,
  useModifyNarrationInfo,
} from "../../api/hooks/allHooks";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNarration,
  createNarration,
} from "../../features/narrationSave/narrationSlice";
import { toast } from "react-toastify";
import Button from "../ui/buttons/primary-button";
import { useNavigate } from "react-router-dom";

const emptyNarration = {
  imam: null,
  book: null,
  name: null,
  narrator: null,
  content: null,
  book_vol_no: null,
  book_page_no: null,
  book_narration_no: null,
};

export const NarrationEditForm = ({ narration }) => {
  const [updatedNarration, setUpdatedNarration] = useState(emptyNarration);
  const { narration: storeNarration } = useSelector((store) => store.narration);
  let { data: imam } = useGetImam();
  imam = imam || [];
  let { data: book } = useGetBooks();
  book = book || [];
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const handleChange = (key, value) => {
    const updated = { ...updatedNarration, [key]: value };
    setUpdatedNarration(updated);
  };
  const { mutate } = useModifyNarrationInfo();
  const navigate = useNavigate();
  const handleBlur = (fieldName, fieldValue) => {
    if (narration)
      mutate({
        narrationId: narration?.id,
        data: { [fieldName]: fieldValue },
      });
  };
  const handleSubmit = (e) => {
    console.log(updatedNarration);
    if (
      !updatedNarration.imam ||
      !updatedNarration.book ||
      !updatedNarration.name ||
      !updatedNarration.narrator ||
      !updatedNarration.content ||
      !updatedNarration.book_vol_no ||
      !updatedNarration.book_page_no ||
      !updatedNarration.book_narration_no
    ) {
      toast.error("پر کردن همه فیلدهای اطلاعات شناسنامه ای الزامی است");
      return;
    }

    const newNarration = {
      imam: Number(updatedNarration.imam.id),
      book: Number(updatedNarration.book.id),
      name: updatedNarration.name,
      narrator: updatedNarration.narrator,
      content: updatedNarration.content,
      book_vol_no: Number(updatedNarration.book_vol_no),
      book_page_no: Number(updatedNarration.book_page_no),
      book_narration_no: Number(updatedNarration.book_narration_no),
    };

    dispatch(createNarration(newNarration));
  };
  useEffect(() => {
    if (storeNarration?.id) {
      dispatch(clearNarration());
      navigate(`${storeNarration?.id}`, {
        preventScrollReset: false,
      });
    }
  }, [storeNarration]);

  useEffect(() => {
    if (narration) setUpdatedNarration(narration);
  }, [narration]);
  return (
    <>
      <ContentContainer className="mb-4" title="اطلاعات شناسنامه‌ای حدیث">
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>نام حدیث</p>
            <Input
              value={updatedNarration?.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={(e) => handleBlur("name", updatedNarration?.name)}
              type="text"
              placeholder="نام حدیث"
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>نام معصوم</p>
            <Dropdown
              selected={updatedNarration?.imam}
              setSelected={(newValue) => {
                handleChange("imam", newValue);
                handleBlur("imam", newValue.id);
              }}
              // onBlur={(e) => handleBlur("imam", updatedNarration?.imam.id)}
              items={imam}
              dataKey="name"
              placeholder="نام معصوم"
            />
          </div>

          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>راویان حدیث</p>
            <Input
              value={updatedNarration?.narrator}
              onChange={(e) => handleChange("narrator", e.target.value)}
              onBlur={(e) => handleBlur("narrator", updatedNarration?.narrator)}
              type="text"
              placeholder="راویان حدیث"
            />
          </div>
          <div
            className="flex gap-1 col-span-2"
            style={{ flexDirection: "column" }}
          >
            <p>متن حدیث</p>
            <Input
              className=""
              value={updatedNarration?.content}
              onChange={(e) => handleChange("content", e.target.value)}
              onBlur={(e) => handleBlur("content", updatedNarration?.content)}
              type="text"
              placeholder="متن حدیث"
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>نام کتاب</p>
            <Dropdown
              selected={updatedNarration?.book}
              setSelected={(newValue) => {
                handleChange("book", newValue);
                handleBlur("book", newValue.id);
              }}
              items={book}
              dataKey="name"
              placeholder="نام کتاب"
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>شماره جلد کتاب</p>
            <Input
              value={updatedNarration?.book_vol_no}
              onChange={(e) => handleChange("book_vol_no", e.target.value)}
              onBlur={(e) =>
                handleBlur("book_vol_no", updatedNarration?.book_vol_no)
              }
              type="number"
              placeholder="شماره جلد کتاب"
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>شماره صفحه</p>
            <Input
              value={updatedNarration?.book_page_no}
              onChange={(e) => handleChange("book_page_no", e.target.value)}
              onBlur={(e) =>
                handleBlur("book_page_no", updatedNarration?.book_page_no)
              }
              type="number"
              placeholder="شماره صفحه"
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>شماره حدیث</p>
            <Input
              value={updatedNarration?.book_narration_no}
              onChange={(e) =>
                handleChange("book_narration_no", e.target.value)
              }
              onBlur={(e) =>
                handleBlur(
                  "book_narration_no",
                  updatedNarration?.book_narration_no
                )
              }
              type="number"
              placeholder="شماره حدیث"
            />
          </div>
        </div>
      </ContentContainer>
      {!narration && (
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="secondary"
            type="button"
            className="w-40 h-8"
            style={{ fontSize: "14px" }}
            onClickHandler={() => navigate("/", { preventScrollReset: false })}
          >
            انصراف
          </Button>
          <Button
            type="button"
            variant="primary"
            className="w-40 h-8"
            style={{ fontSize: "14px" }}
            onClickHandler={handleSubmit}
          >
            ذخیره
          </Button>
        </div>
      )}
    </>
  );
};
