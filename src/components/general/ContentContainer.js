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
      <div className={classes.header_container}>
        <div className={classes.content_container__title}>
          <span>{title}</span>
        </div>
        {actionComponent}
      </div>
      <div className={classes.content_container}>{children}</div>
    </div>
  );
};
