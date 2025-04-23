import { useEffect, useRef } from "react";
import classes from "./input.module.css";

export default function Input(props) {
  const { className, textArea, subText, color, flag } = props;
  const ref = useRef(false);
  useEffect(() => {
    if (ref?.current && flag) {
      ref.current.style.backgroundColor = "var(--primary-color)";
      setTimeout(() => {
        ref.current.style.backgroundColor = "";
      }, 1000);
    }
  }, [flag]);
  if (textArea)
    return (
      <>
        <textarea
          {...props}
          ref={ref}
          className={`${classes.input} ${className}`}
        />
        {subText && (
          <p style={{ marginTop: "-2px", fontSize: 12, color }}>{subText}</p>
        )}
      </>
    );

  return (
    <>
      <input {...props} ref={ref} className={`${classes.input} ${className}`} />
      {subText && (
        <p style={{ marginTop: "-2px", fontSize: 10, color }}>{subText}</p>
      )}
    </>
  );
}

export function InputOld(props) {
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
