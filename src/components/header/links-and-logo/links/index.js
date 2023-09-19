import { NavLink } from "react-router-dom";
import classes from "./links.module.css";

export default function Links({ onModal }) {
  return (
    <div
      className={`${
        onModal ? classes.link_container__in_modal : classes.link_container
      } ${onModal && classes.font_color}`}
    >
      {onModal && <span>عین الحیاه</span>}
      <NavLink
        className={({ isActive }) =>
          `hover:border-b border-solid ${isActive && "border-b border-solid"}`
        }
        to={"/"}
        tabIndex={-1}
      >
        خلاصه احادیث
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `hover:border-b border-solid ${isActive && "border-b border-solid"}`
        }
        to={"save narration"}
        tabIndex={-1}
      >
        ذخیره حدیث
      </NavLink>

      {/* <NavLink to={"/"} tabIndex={-1}>
        ذخیره کتاب
      </NavLink> */}
    </div>
  );
}
