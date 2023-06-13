import classes from "./primary-button.module.css";

export default function PrimaryButton({children, onClickHandler}) {
    return <button onClick={onClickHandler} className={classes.button}>{children}</button>
}
