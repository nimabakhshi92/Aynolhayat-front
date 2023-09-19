import { useRef } from "react";
import { ContentContainer } from "../components/general/ContentContainer";
import Input from "../components/ui/input";
import Tag from "../components/ui/tag";

export const NarrationSave = () => {
  const narrationName = useRef();
  return (
    <section className="mt-8">
      <ContentContainer className="mb-4" title="اطلاعات شناسنامه‌ای حدیث">
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          <Input reference={narrationName} type="text" placeholder="نام حدیث" />
          <Input
            reference={narrationName}
            type="text"
            placeholder="پیامبر اکرم صلی الله علیه و آله"
          />
          <Input
            reference={narrationName}
            type="text"
            placeholder="راویان حدیث"
          />
          <Input
            className="col-span-2"
            reference={narrationName}
            type="text"
            placeholder="متن حدیث"
          />
          <Input reference={narrationName} type="text" placeholder="بحار" />
          <Input
            reference={narrationName}
            type="text"
            placeholder="شماره جلد کتاب"
          />
          <Input
            reference={narrationName}
            type="text"
            placeholder="شماره صفحه"
          />
          <Input
            reference={narrationName}
            type="text"
            placeholder="شماره حدیث"
          />
        </div>
      </ContentContainer>

      <ContentContainer className="mb-4" title="موضوعات مرتبط با حدیث">
        <div className="flex items-center">
          <Input
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              width: "250px",
            }}
            reference={narrationName}
            type="text"
            placeholder="موضوع اضافه کنید"
          />
          <div
            style={{
              backgroundColor: "var(--primary-color)",
              color: "white",
              width: "40px",
              height: "40px",
              fontSize: "30px",
              fontWeight: 400,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              textAlign: "center",
            }}
          >
            <span>+</span>
          </div>
        </div>
        <div className="mt-6 flex gap-4 items-start">
          <Tag tag="اجل" />
          <Tag tag="اجابت" />
          <Tag tag="نماز شب" />
          <Tag tag="بهشت و جهنم" />
          <Tag tag="اجل" />
          <Tag tag="اجل" />
          <Tag tag="اجل" />
          <Tag tag="اجل" />
        </div>
      </ContentContainer>

      <ContentContainer className="mb-4" title="خلاصه‌ها و فهرست">
        <div className="grid gap-4 grid-cols-7 grid-rows-2">
          <Input reference={narrationName} type="text" placeholder="سطح 1" />
          <Input reference={narrationName} type="text" placeholder="سطح 2" />
          <Input reference={narrationName} type="text" placeholder="سطح 3" />
          <Input
            className="col-span-2"
            reference={narrationName}
            type="text"
            placeholder="توضیح من"
          />
          <Input
            className="col-span-2"
            reference={narrationName}
            type="text"
            placeholder="عبارت عربی"
          />
          <Input
            className="col-span-2"
            reference={narrationName}
            type="text"
            placeholder="سوره الفاتحه"
          />
          <Input reference={narrationName} type="text" placeholder="1" />
          <Input
            className="col-span-4"
            reference={narrationName}
            type="text"
            placeholder="بسم الله الرحمن الرحیم"
          />
        </div>
      </ContentContainer>
      <ContentContainer className="mb-4" title="پاورقی">
        <div className="grid gap-4 grid-cols-2">
          <Input reference={narrationName} type="text" placeholder="عبارت" />
          <Input reference={narrationName} type="text" placeholder="توضیح" />
        </div>
      </ContentContainer>
    </section>
  );
};
