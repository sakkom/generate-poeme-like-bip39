// interface CircleButtonProps {
//   onClick?: () => void | Promise<void>;
//   style?: React.CSSProperties;
//   backgroundColor?: string;
//   children: React.ReactNode;
//   disabled?: boolean;
//   className?: string;
// }

// const CircleButton: React.FC<CircleButtonProps> = ({
//   onClick,
//   style = {},
//   backgroundColor = "#ffff00",
//   children,
//   disabled = false,
//   className = "button",
// }) => {
//   const baseStyle: React.CSSProperties = {
//     width: "16vmin",
//     height: "16vmin",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "50%",
//     cursor: disabled ? "default" : "pointer",
//     border: "none",
//     fontWeight: "bold",
//     position: "absolute",
//     textDecoration: "none",
//     color: "black",
//     backgroundColor,
//     ...style,
//   };

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={className}
//       style={baseStyle}
//     >
//       {children}
//     </button>
//   );
// };

// export default CircleButton;

interface CircleButtonProps {
  children: React.ReactNode;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  background?: string;
}

export const CircleButton: React.FC<CircleButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "button",
  style = {},
  background,
}) => {
  const baseStyle: React.CSSProperties = {
    width: "16vmin",
    height: "16vmin",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    cursor: disabled ? "default" : "pointer",
    border: "none",
    fontWeight: "bold",
    position: "absolute",
    textDecoration: "none",
    color: "black",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    background: `radial-gradient(circle, ${background} 0%, #fff 90%)`,
    ...style,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={baseStyle}
    >
      {children}
    </button>
  );
};
