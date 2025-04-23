import { GiSettingsKnobs } from "react-icons/gi";

import classes from "./filter.module.css";
import { VscSettings } from "react-icons/vsc";

export default function Filter() {
  return (
    <div className={classes.container}>
      <VscSettings />
    </div>
  );
}
