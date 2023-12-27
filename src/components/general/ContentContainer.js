import { getFont } from "../../utils/acl";
import DotsDropdown from "../ui/dots-dropdown";
import classes from "./ContentContainer.module.css";

export const ContentContainer = ({
  children,
  className,
  title,
  actionComponent,
}) => {
  return (
    <div
      style={{
        boxShadow: "-3px 8px 16px -3px #00000026",
        borderRadius: "8px",
        marginBottom: "32px",
        backgroundColor: "white",
      }}
      className={`${className}`}
    >
      <div
        className={classes.header_container}
        style={{
          fontSize: getFont(1.4) + "rem",
        }}
      >
        <div
          className={classes.content_container__title}
          style={{
            fontSize: getFont(1.2) + "rem",
          }}
        >
          <span>{title}</span>
        </div>
        {actionComponent}
      </div>
      <div
        className={classes.content_container}
        style={{
          fontSize: getFont(1.8) + "rem",
        }}
      >
        {children}
      </div>
    </div>
  );
};
