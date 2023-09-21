import { CgClose } from "react-icons/cg";

import classes from "./tag.module.css";

export default function Tag({ tag, onClose }) {
  return (
    <div className={classes.container}>
      <CgClose className={classes.close} onClick={onClose} />
      <span>{tag}</span>
    </div>
  );
}
