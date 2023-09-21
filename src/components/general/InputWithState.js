import classes from "../ui/input/input.module.css";

export const InputWithState = ({
  style,
  type,
  placeholder,
  value,
  setValue,
  className,
  onClick,
  onBlur,
  onChange,
  onKeyDown,
  disabled,
}) => {
  return (
    <input
      style={style}
      value={value}
      className={`${classes.input} ${className}`}
      type={type}
      placeholder={placeholder}
      onClick={onClick}
      onChange={(e) => {
        setValue(e.target.value);
        if (onChange) onChange();
      }}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      disabled={disabled}
    />
  );
};
