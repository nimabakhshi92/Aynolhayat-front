import classes from './login.module.css'

export default function Login() {
    return (
        <div className={classes.container}>
            <div className={classes.frame}>
                <form className={classes.form_container}>
                    <h1>جنة المأوی</h1>
                    <div>
                        <input type='email' placeholder='ایمیل'/>
                        <input type='password' placeholder='رمز عبور'/>
                    </div>
                    <div>
                        <button>ورود</button>
                        <div>
                            <span>فراموشی رمز عبور؟ </span>
                            <a href='https://google.com' >بازیابی رمز عبور</a>
                        </div>
                    </div>
                    <button>ایجاد حساب کاربری</button>
                </form>
            </div>
        </div>
    )
}
