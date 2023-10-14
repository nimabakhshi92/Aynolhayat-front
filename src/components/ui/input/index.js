import classes from "./input.module.css";

export default function Input(props) {
  const { reference, className } = props;
  return (
    <input
      {...props}
      ref={reference}
      className={`${classes.input} ${className}`}
    />
  );
}
