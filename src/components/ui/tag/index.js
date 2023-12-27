import { CgClose } from "react-icons/cg";

import classes from "./tag.module.css";
import { useSelector } from "react-redux";
import { getFont, isSuperAdmin } from "../../../utils/acl";

export default function Tag({ tag, onClose }) {
  const { user } = useSelector((store) => store.user);
  return (
    <div
      className={classes.container}
      style={{
        fontSize: isSuperAdmin(user) ? getFont(10) : "10" + "rem",
      }}
    >
      <CgClose className={classes.close} onClick={onClose} />
      <span>{tag}</span>
    </div>
  );
}
