import EntranceForm from "../../entrance-form";
import InputContainer from "../../input-container";
import PrimaryButton from "../../../ui/buttons/primary-button";
import SecondaryButton from "../../../ui/buttons/secondary-button";
import {useRef} from "react";

export default function SingUpForm(){
    const emailRef = useRef()
    const passwordRef = useRef()

    function onClickHandler(){
        console.log(emailRef.current.value, passwordRef.current.value)
    }

    return(
        <EntranceForm>
            <InputContainer reference={{emailRef, passwordRef}} />
            <PrimaryButton onClickHandler={onClickHandler}>ثبت نام</PrimaryButton>
            <SecondaryButton>بازگشت به صفحه ورود</SecondaryButton>
        </EntranceForm>
    )
}
