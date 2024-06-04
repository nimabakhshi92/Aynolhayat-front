import Button from "../../../ui/buttons/primary-button";
import InputContainer from "../../input-container";
import ForgetPassword from "../forget-password";
import { useRef, useState } from "react";
import EntranceForm from "../../entrance-form";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../../../../features/user/userSlice";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import Input from "../../../ui/input";

export default function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((store) => store.user);
  const [next, setNext] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const onClickHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("اطلاعات را کامل وارد کنید");
      return;
    }
    const values = {
      username: email,
      email,
      password,
    };
    if (isLogin) dispatch(loginUser(values));
    else dispatch(signupUser(values));
    setNext(true);
  };

  console.log(user);
  if (user && user?.id !== 2 && next) return <Navigate to={"/"} />;

  return (
    <EntranceForm>
      <Input
        type="email"
        placeholder="ایمیل"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="رمز عبور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <Button variant="primary" onClickHandler={onClickHandler} type="submit">
          {isLogin ? "ورود" : "ثبت نام"}
        </Button>
        {isLogin ? (
          <p>
            <span>حساب کاربری ندارید؟ </span>
            <a className="cursor-pointer" onClick={() => setIsLogin(false)}>
              ایجاد حساب کاربری
            </a>
          </p>
        ) : (
          <p>
            <span>حساب کاربری دارید؟</span>
            <a className="cursor-pointer" onClick={() => setIsLogin(true)}>
              {" "}
              بازگشت به صفحه ورود
            </a>
          </p>
        )}
        {/* <ForgetPassword /> */}
      </div>
      {/* <Button variant="secondary" onClickHandler={() => setIsLogin(!isLogin)}>
        {isLogin ? "ایجاد حساب کاربری" : "بازگشت به صفحه ورود"}
      </Button> */}
    </EntranceForm>
  );
}
