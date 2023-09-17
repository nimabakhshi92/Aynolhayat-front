import EntranceForm from "../../entrance-form";
import InputContainer from "../../input-container";
import Button from "../../../ui/buttons/primary-button";
import { useRef } from "react";

export default function SingUpForm() {
  const emailRef = useRef();
  const passwordRef = useRef();

  function onClickHandler() {
    console.log(emailRef.current.value, passwordRef.current.value);
  }

  return (
    <EntranceForm>
      <InputContainer reference={{ emailRef, passwordRef }} />
      <Button variant="primary" onClickHandler={onClickHandler}>
        ثبت نام
      </Button>
      <Button variant="secondary">بازگشت به صفحه ورود</Button>
    </EntranceForm>
  );
}
