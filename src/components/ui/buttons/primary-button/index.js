import "./button.css";

export default function Button({
  className,
  children,
  onClickHandler,
  variant,
  type,
  style,
  ...props
}) {
  return (
    <button
      style={style}
      type={type}
      className={`btn p-2 py-1 rounded btn-${variant} ${className}`}
      onClick={onClickHandler}
      {...props}
    >
      {children}
    </button>
  );
}
