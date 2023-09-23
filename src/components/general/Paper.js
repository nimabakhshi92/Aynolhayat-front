export const Paper = ({ children, className, style }) => {
  return (
    <div
      className={className}
      style={{
        boxShadow: "-3px 8px 16px -3px #00000026",
        borderRadius: "8px",
        backgroundColor: "white",
        fontSize: "16px",
        padding: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
