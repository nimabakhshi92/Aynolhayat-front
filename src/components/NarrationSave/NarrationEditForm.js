import { useEffect, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";
import Dropdown from "../ui/dropdown";
import Input from "../ui/input";
import { useGetBooks, useGetImam } from "../../api/hooks/allHooks";

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

  useEffect(() => {
    setUpdatedNarration(narration);
  }, [narration]);
  return (
    <ContentContainer className="mb-4" title="اطلاعات شناسنامه‌ای حدیث">
      <div className="grid gap-4 grid-cols-3 grid-rows-3">
        <Input
          value={updatedNarration?.name}
          onChange={(e) => handleChange("name", e.target.value)}
          type="text"
          placeholder="نام حدیث"
        />
        <Dropdown
          selected={updatedNarration?.imam?.name}
          setSelected={(e) => handleChange("imam", e.target.value)}
          items={imam}
          dataKey="name"
          placeholder="نام معصوم"
        />

        <Input
          value={updatedNarration?.narrator}
          onChange={(e) => handleChange("narrator", e.target.value)}
          type="text"
          placeholder="راویان حدیث"
        />
        <Input
          className="col-span-2"
          value={updatedNarration?.content}
          onChange={(e) => handleChange("content", e.target.value)}
          type="text"
          placeholder="متن حدیث"
        />
        <Dropdown
          selected={updatedNarration?.book?.name}
          setSelected={(e) => handleChange("book", e.target.value)}
          items={book}
          dataKey="name"
          placeholder="نام کتاب"
        />
        <Input
          value={updatedNarration?.book_vol_no}
          onChange={(e) => handleChange("book_vol_no", e.target.value)}
          type="number"
          placeholder="شماره جلد کتاب"
        />
        <Input
          value={updatedNarration?.book_page_no}
          onChange={(e) => handleChange("book_page_no", e.target.value)}
          type="number"
          placeholder="شماره صفحه"
        />
        <Input
          value={updatedNarration?.book_narration_no}
          onChange={(e) => handleChange("book_narration_no", e.target.value)}
          type="number"
          placeholder="شماره حدیث"
        />
      </div>
    </ContentContainer>
  );
};
