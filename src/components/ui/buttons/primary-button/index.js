import "./button.css";

export default function Button({ children, onClickHandler, variant, type }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
}
