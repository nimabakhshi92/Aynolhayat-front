import classes from "./input.module.css";

export default function Input(props) {
  const { reference, className, textArea, subText, color } = props;
  if (textArea)
    return (
      <>
        <textarea
          {...props}
          ref={reference}
          className={`${classes.input} ${className}`}
        />
        {subText && (
          <p style={{ marginTop: "-2px", fontSize: 12, color }}>{subText}</p>
        )}
      </>
    );

  return (
    <>
      <input
        {...props}
        ref={reference}
        className={`${classes.input} ${className}`}
      />
      {subText && (
        <p style={{ marginTop: "-2px", fontSize: 10, color }}>{subText}</p>
      )}
    </>
  );
}
