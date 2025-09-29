interface DrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
}
export const Drawer: React.FC<DrawerProps> = ({ isOpen, children }) => {
  return (
    <div
      style={{
        height: "65dvh",
        width: "100dvw",
        position: "fixed",
        bottom: 0,
        left: 0,
        transform: isOpen ? "translateY(0" : "translateY(100%)",
        transition: "transform 0.3s steps(3, end)",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: "10vmin 10vmin 0 0",
        color: "black",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
