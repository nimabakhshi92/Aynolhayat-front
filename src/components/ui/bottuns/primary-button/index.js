import classes from "./primary-button.module.css";

export default function PrimaryButton({children}) {
    return <button className={classes.button}>{children}</button>
}
