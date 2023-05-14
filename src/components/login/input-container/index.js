import Input from "../../ui/input";

export default function InputContainer() {
    return (
        <div>
            <Input type='email' placeholder='ایمیل'/>
            <Input type='password' placeholder='رمز عبور'/>
        </div>
    )
}
