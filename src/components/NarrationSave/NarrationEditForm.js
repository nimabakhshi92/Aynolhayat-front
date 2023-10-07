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

export const NarrationEditForm = ({ narration }) => {
  const [updatedNarration, setUpdatedNarration] = useState({});
  let { data: imam } = useGetImam();
  imam = imam || [];
  let { data: book } = useGetBooks();
  book = book || [];

  const handleChange = (key, value) => {
    const updated = { ...updatedNarration, [key]: value };
    setUpdatedNarration(updated);
  };

  const { mutate } = useModifyNarrationInfo();

  const handleBlur = (fieldName, fieldValue) => {
    mutate({
      narrationId: narration?.id,
      data: { [fieldName]: fieldValue },
    });
  };

  useEffect(() => {
    setUpdatedNarration(narration);
  }, [narration]);
  return (
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
            onChange={(e) => handleChange("book_narration_no", e.target.value)}
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
  );
};
