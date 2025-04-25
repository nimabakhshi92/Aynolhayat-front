import { AiFillCloseCircle } from "react-icons/ai";
import classes from "./modal.module.css";

export default function Modal({ onCloseHandler, children }) {
  return (
    <div className={classes.main_container}>
      <div className={classes.container}>
        <div className={classes.close}>
          <AiFillCloseCircle onClick={onCloseHandler} />
        </div>
        {children}
      </div>
    </div>
  );
}
