import classes from "./secondary-button.module.css";

export default function SecondaryButton({children}) {
    return <button className={classes.button}>{children}</button>
}
