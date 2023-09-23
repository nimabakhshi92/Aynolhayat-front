import classes from "./input.module.css";

export default function Input({
  style,
  type,
  placeholder,
  reference,
  className,
  onClick,
  onBlur,
  onChange,
  onKeyDown,
  disabled,
  value,
}) {
  return (
    <input
      value={value}
      style={style}
      ref={reference}
      className={`${classes.input} ${className}`}
      type={type}
      placeholder={placeholder}
      onClick={onClick}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  );
}
