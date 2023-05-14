import classes from "./login-form.module.css";
import PrimaryButton from "../../ui/bottuns/primary-button";
import SecondaryButton from "../../ui/bottuns/secondary-button";
import InputContainer from "../input-container";
import ForgetPassword from "../forget-password";

export default function LoginForm() {
    return (
        <form className={classes.form_container}>
            <h1>جنة المأوی</h1>
            <InputContainer/>
            <div>
                <PrimaryButton>ورود</PrimaryButton>
                <ForgetPassword />
            </div>
            <SecondaryButton>ایجاد حساب کاربری</SecondaryButton>
        </form>
    )
}
