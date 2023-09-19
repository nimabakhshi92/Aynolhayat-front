import DotsDropdown from "../ui/dots-dropdown";
import classes from "./ContentContainer.module.css";

export const ContentContainer = ({
  children,
  className,
  title,
  actionIcon,
  actionFn,
}) => {
  return (
    <div
      style={{
        boxShadow: "-3px 8px 16px -3px #00000026",
        borderRadius: "8px",
        overflow: "hidden",
        marginBottom: "32px",
      }}
      className={`${className}`}
    >
      <div className={classes.header_container}>
        <div className={classes.content_container__title}>
          <span>{title}</span>
        </div>
        {/* <p>{title}</p> */}
      </div>
      <div className={classes.content_container}>{children}</div>
    </div>
  );
};
