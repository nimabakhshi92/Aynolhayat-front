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
import { SingleNarration } from "../../pages/NarrationWarehouseLT";
import { InputWithSuggestionWithDebounceBlur } from "../general/InputWithSuggestion";

const emptyNarration = {
  imam: null,
  book: null,
  name: null,
  narrator: null,
  content: null,
  book_vol_no: null,
  book_page_no: null,
  book_narration_no: null,
  is_complete: null
};

const SimilarNarrations = ({
  narrationContent,
  setIsOpen,
  isOpen,
  setHasSimilar,
  trigger,
  setTrigger
}) => {
  const [similar, setSimilar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const url = apiUrls.narration.similar;
  useEffect(() => {
    const fn = async () => {
      setTrigger(false)
      setIsLoading(true);
      try {
        const data = { text: narrationContent };
        const resp = await customApiCall.post({ data, url });
        setSimilar(resp);
        setHasSimilar(!!resp.length);
        // if (resp?.length)
        //   setTrigger(true)
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    if (trigger)
      fn();
  }, [trigger, narrationContent]);

  if (similar.length && isOpen)
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
              onClickHandler={() => {
                setTrigger(false)
                setIsOpen(false)
              }}
            >
              بستن
            </Button>
          </div>
          <AiOutlineClose
            className="absolute cursor-pointer right-2 top-2"
            onClick={() => {
              setTrigger(false)
              setIsOpen(false)
            }}
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
  const [trigger, setTrigger] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedNarration, setUpdatedNarration] = useState(emptyNarration);
  const { narration: storeNarration, isLoading } = useSelector((store) => store.narration);
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

  const flag = useRef(false)
  const status = useRef()

  const handleBlur = (fieldName, fieldValue) => {
    status.current = 'isLoading'
    if (narration)
      flag.current = fieldName
    if (fieldName === "content" && fieldValue) {
      // setIsModalOpen(true);
      setTrigger(true);
    }
    if (!fieldValue || fieldValue == ' ')
      return;
    if (narration) {
      flag.current = fieldName
      mutate({
        narrationId: narration?.id,
        data: { [fieldName]: fieldValue },
      }, {
        onSuccess: () => {
          status.current = 'success'
        },
        onError: () => {
          status.current = 'error'
        }
      });
    } else {
      flag.current = undefined
    }
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
      !updatedNarration.book_narration_no ||
      updatedNarration.is_complete === undefined
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
      is_complete: Number(updatedNarration.is_complete),
    };

    dispatch(createNarration(newNarration));
  };
  useEffect(() => {
    if (storeNarration?.id) {
      dispatch(clearNarration());
      navigate(`/my-narrations/${storeNarration?.id}`, {
        preventScrollReset: false,
      });
    }
  }, [storeNarration]);

  useEffect(() => {
    if (narration) setUpdatedNarration(narration);
  }, [narration]);

  const [hasSimilar, setHasSimilar] = useState(null);
  const { border, color, subText } = narrationHasSimilarConfig(hasSimilar);

  const isCompletedItems = [
    { is_complete: 'کامل', id: 0, dataToSend: true },
    { is_complete: 'ناقص', id: 1, dataToSend: false },
  ]

  return (
    <>
      {(
        <SimilarNarrations
          narrationContent={updatedNarration.content}
          setIsOpen={setIsModalOpen}
          isOpen={isModalOpen}
          setHasSimilar={setHasSimilar}
          trigger={trigger}
          setTrigger={setTrigger}

        />
      )}
      <ContentContainer className="mb-4" title="اطلاعات شناسنامه‌ای حدیث">
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>نام حدیث</p>
            <InputWithSuggestionWithDebounceBlur
              className='w-full'
              value={updatedNarration?.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={(e) => handleBlur("name", e.target.value)}
              type="text"
              placeholder="نام حدیث"
              flag={flag?.current === 'name'}
              status={status.current}
              key={"i0"}
              debounceDependency={narration?.id}
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
              key={"i1"}
              debounceDependency={narration?.id}
            />
          </div>

          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>راویان حدیث</p>
            <InputWithSuggestionWithDebounceBlur
              className='w-full'
              value={updatedNarration?.narrator}
              onChange={(e) => handleChange("narrator", e.target.value)}
              onBlur={(e) => handleBlur("narrator", e.target.value)}
              type="text"
              placeholder="راویان حدیث"
              flag={flag?.current === 'narrator'}
              status={status.current}
              key={"i2"}
              debounceDependency={narration?.id}
            />
          </div>
          <div
            className="flex gap-1 col-span-2 sm:col-span-3 sm:row-span-2"
            style={{ flexDirection: "column" }}
          >
            <p>متن حدیث</p>
            <InputWithSuggestionWithDebounceBlur
              className='w-full'
              style={{
                height: "100%",
                border,
              }}
              value={updatedNarration?.content}
              onChange={(e) => handleChange("content", e.target.value)}
              onBlur={(e) => handleBlur("content", e.target.value)}
              type="text"
              subText={subText}
              color={color}
              placeholder="متن حدیث"
              flag={flag?.current === 'content'}
              status={status.current}
              textArea={true}
              key={"i3"}
              debounceDependency={narration?.id}
            />
            {hasSimilar !== null &&
              <p className="t-semi-large">
                {hasSimilar &&
                  <>
                    <span className="text-[red]">
                      حدیث ممکن است تکراری باشد.
                      برای دیدن احادیث مشابه احتمالی
                    </span>
                    <span onClick={() => setIsModalOpen(true)}
                      className="underline inline-block mx-1 text-[blue] cursor-pointer">
                      کلیک کنید
                    </span>
                  </>
                }
                {!hasSimilar && <>
                  {<p className="text-[green]">این حدیث تکراری نیست</p>}

                </>

                }
              </p>
            }
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
              key={"i4"}
              debounceDependency={narration?.id}
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>شماره جلد کتاب</p>
            <InputWithSuggestionWithDebounceBlur
              className='w-full'
              value={updatedNarration?.book_vol_no}
              onChange={(e) => handleChange("book_vol_no", e.target.value)}
              onBlur={(e) =>
                handleBlur("book_vol_no", e.target.value)
              }
              type="number"
              placeholder="شماره جلد کتاب"
              flag={flag?.current === 'book_vol_no'}
              status={status.current}
              key={"i5"}
              debounceDependency={narration?.id}
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>شماره صفحه</p>
            <InputWithSuggestionWithDebounceBlur
              className='w-full'
              value={updatedNarration?.book_page_no}
              onChange={(e) => handleChange("book_page_no", e.target.value)}
              onBlur={(e) =>
                handleBlur("book_page_no", e.target.value)
              }
              type="number"
              placeholder="شماره صفحه"
              flag={flag?.current === 'book_page_no'}
              status={status.current}
              key={"i6"}
              debounceDependency={narration?.id}
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>شماره حدیث</p>
            <InputWithSuggestionWithDebounceBlur
              className='w-full'
              value={updatedNarration?.book_narration_no}
              onChange={(e) =>
                handleChange("book_narration_no", e.target.value)
              }
              onBlur={(e) =>
                handleBlur(
                  "book_narration_no",
                  e.target.value
                )
              }
              type="number"
              placeholder="شماره حدیث"
              status={status.current}
              flag={flag?.current === 'book_narration_no'}
              key={"i7"}
              debounceDependency={narration?.id}
            />
          </div>
          <div className="flex gap-1 " style={{ flexDirection: "column" }}>
            <p>حدیث کامل است؟</p>
            <Dropdown
              selected={!updatedNarration?.is_complete ? isCompletedItems[1] : isCompletedItems[0]}
              setSelected={(newValue) => {
                handleChange("is_complete", newValue?.dataToSend);
                handleBlur("is_complete", newValue?.dataToSend);
              }}
              items={isCompletedItems}
              dataKey="is_complete"
              placeholder=""
              flag={flag?.current === 'is_complete'}
              key={"i8" + narration?.id}
            />
          </div>
        </div>
      </ContentContainer>
      {!narration && (
        <div className="flex justify-end gap-4 my-8">
          <Button
            key={'cancel'}
            variant="secondary"
            type="button"
            className="w-40 h-8"
            style={{ fontSize: "14px" }}
            onClickHandler={() => navigate("/", { preventScrollReset: false })}
          >
            انصراف
          </Button>
          <Button
            key={'submit'}
            type="button"
            variant="primary"
            className="w-40 h-8"
            style={{ fontSize: "14px" }}
            onClickHandler={handleSubmit}
            disabled={isLoading}
          >
            ذخیره
          </Button>
        </div>
      )}
    </>
  );
};
