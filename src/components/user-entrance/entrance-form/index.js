import classes from "./entrance-form.module.css";

export default function EntranceForm({children}){

    return(
        <form className={classes.form_container}>
            <h1>جنة المأوی</h1>
            {children}
        </form>
    )
}
