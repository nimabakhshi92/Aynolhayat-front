import { useEffect, useRef, useState } from "react";
import { ContentContainer } from "../general/ContentContainer";
import Dropdown from "../ui/dropdown";
import Input from "../ui/input";
import {
  useGetBooks,
  useGetImam,
  useModifyNarrationInfo,
} from "../../api/hooks/allHooks";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNarration,
  createNarration,
} from "../../features/narrationSave/narrationSlice";
import { toast } from "react-toastify";
import Button from "../ui/buttons/primary-button";
import { useNavigate } from "react-router-dom";
import { customApiCall } from "../../utils/axios";
import { CircularProgress } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import apiUrls from "../../api/urls";
import { SingleNarration } from "../../pages/NarrationWarehouse";

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

const SimilarNarrations = ({
  narrationContent,
  setIsOpen,
  isOpen,
  setHasSimilar,
  trigger,
}) => {
  const [similar, setSimilar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const url = apiUrls.narration.similar;
  useEffect(() => {
    const fn = async () => {
      setIsLoading(true);
      try {
        const data = { text: narrationContent };
        const resp = await customApiCall.post({ data, url });
        setSimilar(resp);
        setHasSimilar(!!resp.length);
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) fn();
  }, [trigger]);

  if (similar.length)
    return (
      <div
        className="w-full h-full fixed "
        style={{
          backgroundColor: "#0009",
          zIndex: 100,
        }}
      >
        <div
          className="w-2/3  fixed top-1/2 left-1/2 overflow-scroll"
          style={{
            borderRadius: "8px",
            backgroundColor: "white",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
            border: "1px solid #ccc",
            height: "75%",
          }}
        >
          {isLoading && (
            <CircularProgress
              className="absolute top-1/2 left-1/2 -transform-x-1/2 -transform-y-1/2 "
              color="success"
            />
          )}
          <div
            style={{
              flexDirection: "column",
            }}
            className="relative p-6 flex gap-8  items-center "
          >
            {!isLoading && !similar.length > 0 && <p>این حدیث تکراری نیست</p>}
            {similar.length > 0 && (
              <>
                <p>{similar.length} حدیث مشابه یافت شد</p>
                {similar.map((narration) => {
                  return (
                    <SingleNarration narration={narration} className="w-full" />
                  );
                  // return <p>{item.content}</p>;
                })}
              </>
            )}
            <Button
              variant="primary"
              className="w-30"
              onClickHandler={() => setIsOpen(false)}
            >
              بستن
            </Button>
          </div>
          <AiOutlineClose
            className="absolute cursor-pointer right-2 top-2"
            onClick={() => setIsOpen(false)}
          />
        </div>
      </div>
    );
};

const narrationHasSimilarConfig = (hasSimilar) => {
  if (hasSimilar === true)
    return {
      border: "1px solid var(--error-color)",
      color: "var(--error-color)",
      subText: "حدیث احتمالا تکراری است",
    };
  if (hasSimilar === false)
    return {
      border: "1px solid var(--primary-color)",
      color: "var(--primary-color)",
      subText: "حدیث تکراری نیست",
    };
  return {
    border: undefined,
    color: undefined,
    subText: undefined,
  };
};

export const NarrationEditForm = ({ narration }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const [trigger, setTrigger] = useState(false);

  const flag = useRef(false)
  const handleBlur = (fieldName, fieldValue) => {
    flag.current = ''
    if (!narration && fieldName === "content" && fieldValue) {
      setIsModalOpen(true);
      setTrigger(!trigger);
    }
    if (narration)
      mutate({
        narrationId: narration?.id,
        data: { [fieldName]: fieldValue },
      }, {
        onSuccess: () => {
          flag.current = fieldName
        }
      });
  };
  const handleSubmit = (e) => {
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

  const [hasSimilar, setHasSimilar] = useState(null);
  const { border, color, subText } = narrationHasSimilarConfig(hasSimilar);
  return (
    <>
      {isModalOpen && (
        <SimilarNarrations
          narrationContent={updatedNarration.content}
          setIsOpen={setIsModalOpen}
          isOpen={isModalOpen}
          setHasSimilar={setHasSimilar}
          trigger={trigger}
        />
      )}
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
              flag={flag?.current === 'name'}
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
              flag={flag?.current === 'imam'}
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
              flag={flag?.current === 'narrator'}
            />
          </div>
          <div
            className="flex gap-1 col-span-2 sm:col-span-3 sm:row-span-2"
            style={{ flexDirection: "column" }}
          >
            <p>متن حدیث</p>
            <Input
              style={{
                height: "100%",
                border,
              }}
              value={updatedNarration?.content}
              onChange={(e) => handleChange("content", e.target.value)}
              onBlur={(e) => handleBlur("content", updatedNarration?.content)}
              type="text"
              subText={subText}
              color={color}
              placeholder="متن حدیث"
              textArea={true}
              flag={flag?.current === 'content'}
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
              flag={flag?.current === 'book'}
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
              flag={flag?.current === 'book_vol_no'}
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
              flag={flag?.current === 'book_page_no'}
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
              flag={flag?.current === 'book_narration_no'}
            />
          </div>
        </div>
      </ContentContainer>
      {!narration && (
        <div className="flex justify-end gap-4 my-8">
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
