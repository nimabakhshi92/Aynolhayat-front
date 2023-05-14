import classes from './login.module.css'
import Frame from "./frame";
import LoginForm from "./login-form";

export default function Login() {
    return (
        <div className={classes.container}>
            <Frame>
                <LoginForm />
            </Frame>
        </div>
    )
}
