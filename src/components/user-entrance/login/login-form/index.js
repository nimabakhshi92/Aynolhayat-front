import PrimaryButton from "../../../ui/bottuns/primary-button";
import SecondaryButton from "../../../ui/bottuns/secondary-button";
import InputContainer from "../../input-container";
import ForgetPassword from "../forget-password";
import {useRef} from "react";
import EntranceForm from "../../entrance-form";

export default function LoginForm() {
    const emailRef = useRef()
    const passwordRef = useRef()

    function onClickHandler(){
        console.log(emailRef.current.value, passwordRef.current.value)
    }

    return (
        <EntranceForm>
            <InputContainer reference={{emailRef, passwordRef}} />
            <div>
                <PrimaryButton onClickHandler={onClickHandler} type='submit' >ورود</PrimaryButton>
                <ForgetPassword />
            </div>
            <SecondaryButton>ایجاد حساب کاربری</SecondaryButton>
        </EntranceForm>
    )
}
