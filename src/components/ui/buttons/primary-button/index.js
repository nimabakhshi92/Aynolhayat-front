import "./button.css";

export default function Button({
  className,
  children,
  onClickHandler,
  variant,
  type,
  style,
}) {
  return (
    <button
      style={style}
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
}
