import classes from "./humver-btn.module.css";

export default function HumberBtn({ menuClickHandler }) {
  return (
    <div onClick={menuClickHandler} className={classes.humber_btn_container}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}
