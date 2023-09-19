import classes from "./input.module.css";

export default function Input({
  style,
  type,
  placeholder,
  reference,
  className,
}) {
  return (
    <input
      style={style}
      ref={reference}
      className={`${classes.input} ${className}`}
      type={type}
      placeholder={placeholder}
    />
  );
}
