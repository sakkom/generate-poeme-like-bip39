import { useEffect, useState } from "react";
import { whiteOYC } from "./color";

interface DrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
}
export const Drawer: React.FC<DrawerProps> = ({ isOpen, children }) => {
  return (
    <div
      style={{
        height: "70dvh",
        width: "15dvw",
        position: "fixed",
        top: "5dvh",
        right: 0,
        transform: isOpen ? "translateY(0)" : "translateY(-200%)",
        transition: "transform 0.1s steps(3, end)",
        // backgroundColor: "rgba(255, 255, 255, 0.5)",
        // background: `linear-gradient(to bottom,
        //   ${whiteOYC.orange} 0%,
        //   ${whiteOYC.yellow} ${middleStop}%,
        //   ${whiteOYC.cyan} 100%
        // )`,
        // borderRadius: " 0 0 5vmin 5vmin",
        color: "black",
        zIndex: 100,
        willChange: "transform",
      }}
    >
      {/*<div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-10vmin",
          right: 0,
          height: 0,
          borderBottom: "1px solid #000",
        }}
      />*/}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: "-10vmin",
          width: 0,
          borderLeft: "1px solid #000",
        }}
      />
      <div
        style={{
          height: "100%",
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
