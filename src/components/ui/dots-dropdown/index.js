import { useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

import classes from "./dots-dropdown.module.css";
import { BsThreeDots } from "react-icons/bs";

export default function DotsDropdown({ items }) {
  const [open, setOpen] = useState(false);
  const [dropdownText, setDropdownText] = useState();

  const handleOpen = () => {
    setOpen(!open);
  };

  const onMenuClick = (e) => {
    setDropdownText(e.target.textContent);
  };

  return (
    <div onClick={handleOpen} className={classes.container}>
      <BsThreeDots className={classes.dots} />
      {open && (
        <ul className={classes.menu}>
          {items?.map((item) => (
            <li key={item.id}>
              {item.title}
              {item.icon}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
