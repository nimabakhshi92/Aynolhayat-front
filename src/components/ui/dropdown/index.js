import { useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

import classes from "./dropdown.module.css";

export default function Dropdown({
  className,
  items,
  selected,
  setSelected,
  dataKey,
  placeholder,
}) {
  const displayValue = !selected
    ? placeholder
    : dataKey
    ? selected[dataKey]
    : selected;
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const onMenuClick = (item) => {
    setSelected(item);
  };

  return (
    <div onClick={handleOpen} className={`${classes.container} ${className}`}>
      <div className={classes.dropdown_content}>
        <div style={{ color: !selected ? "" : "var(--neutral-color-700)" }}>
          {displayValue}
        </div>
        <MdOutlineArrowForwardIos
          className={`${classes.arrow} ${open && classes.arrow_up}`}
        />
      </div>
      {open && (
        <ul className={classes.menu}>
          {items?.map((item, index) => (
            <li key={index} onClick={(e) => onMenuClick(item)}>
              {dataKey ? item[dataKey] : item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
