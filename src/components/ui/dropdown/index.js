import { useState } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";

import classes from "./dropdown.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Checkbox from "@mui/material/Checkbox";

export const DropdownSingleSelect = ({
  className,
  style,
  items,
  label,
  selected,
  setSelected,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };
  const onMenuClick = (item) => {
    if (item === selected) setSelected(null);
    else setSelected(item);
  };
  return (
    <div onClick={handleOpen} className={className} style={style}>
      <div className="px-6 pt-2 " style={{ backgroundColor: "white" }}>
        <div
          className="py-2"
          style={{
            borderBottom: "1px solid #e8e8e8",
          }}
        >
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <span style={{ fontSize: "14px" }}>{label}</span>
              {!!selected && (
                <div
                  style={{
                    backgroundColor: "var(--primary-color)",
                    borderRadius: "50%",
                    marginRight: "8px",
                    width: "6px",
                    height: "6px",
                  }}
                ></div>
              )}
            </div>
            {open ? (
              <FaChevronUp fontSize={18} color="var(--neutral-color-500)" />
            ) : (
              <FaChevronDown fontSize={18} color="var(--neutral-color-500)" />
            )}
          </div>
          <div className="mt-1">
            <span
              style={{ color: "var(--neutral-color-500)", fontSize: "14px" }}
            >
              {selected}
            </span>
          </div>
        </div>
        <div></div>
      </div>
      {open && (
        <ul
          className="w-full overflow-y-scroll max-h-50 px-6 pt-2"
          style={{
            listStyleType: "none",
            backgroundColor: "var(--secondary-whaite-color)",
          }}
        >
          {items?.map((item, index) => (
            <li
              className={classes.filterOption}
              key={index}
              style={{
                fontSize: "12px",
                marginBottom: "8px",
                color: selected === item ? "var(--primary-color)" : "inherit",
              }}
              onClick={(e) => onMenuClick(item)}
            >
              <Checkbox
                onChange={(e) => onMenuClick(item)}
                checked={selected === item}
                sx={{
                  color: "var(--neutral-color-500)",
                  "&.Mui-checked": {
                    color: "var(--primary-color)",
                  },
                }}
              />
              <span style={{ fontSize: "14px" }}>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

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
