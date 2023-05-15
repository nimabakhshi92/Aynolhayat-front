import Frame from "../../ui/layouts/user-entrance/frame";
import LoginForm from "./login-form";
import UserEntrance from "../../ui/layouts/user-entrance";

export default function Login() {

    return (
        <UserEntrance>
            <Frame>
                <LoginForm />
            </Frame>
        </UserEntrance>
    )
}
