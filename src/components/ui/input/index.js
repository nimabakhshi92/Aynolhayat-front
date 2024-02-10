import classes from "./input.module.css";

export default function Input(props) {
  const { reference, className, textArea } = props;
  if (textArea)
    return (
      <textarea
        {...props}
        ref={reference}
        className={`${classes.input} ${className}`}
      />
    );

  return (
    <input
      {...props}
      ref={reference}
      className={`${classes.input} ${className}`}
    />
  );
}
