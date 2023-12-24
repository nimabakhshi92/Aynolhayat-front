import Button from "../../../ui/buttons/primary-button";
import InputContainer from "../../input-container";
import ForgetPassword from "../forget-password";
import { useRef, useState } from "react";
import EntranceForm from "../../entrance-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../features/user/userSlice";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
export default function LoginForm() {
  const { t } = useTranslation();
  const emailRef = useRef();
  const passwordRef = useRef();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((store) => store.user);
  const [next, setNext] = useState(false);
  const onClickHandler = (e) => {
    e.preventDefault();
    if (!emailRef.current?.value | !passwordRef.current?.value) {
      toast.error("اطلاعات را کامل وارد کنید");
      return;
    }
    const values = {
      username: emailRef.current?.value,
      password: passwordRef.current?.value,
    };
    dispatch(loginUser(values));
    setNext(true);
  };

  if (user && next) return <Navigate to={"/"} />;

  return (
    <EntranceForm>
      <InputContainer reference={{ emailRef, passwordRef }} />
      <div>
        <Button variant="primary" onClickHandler={onClickHandler} type="submit">
          ورود
        </Button>
        <ForgetPassword />
      </div>
      <Button variant="secondary"> ایجاد حساب کاربری</Button>
    </EntranceForm>
  );
}
