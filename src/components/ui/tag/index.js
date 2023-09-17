import { CgClose } from "react-icons/cg";

import classes from "./tag.module.css";

export default function Tag({ tag }) {
  return (
    <div className={classes.container}>
      <CgClose className={classes.close} />
      <span>{tag}</span>
    </div>
  );
}
