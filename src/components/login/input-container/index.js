import Input from "../../ui/input";

export default function InputContainer({reference}) {
    return (
        <div>
            <Input reference={reference.emailRef} type='email' placeholder='ایمیل'/>
            <Input reference={reference.passwordRef} type='password' placeholder='رمز عبور'/>
        </div>
    )
}
