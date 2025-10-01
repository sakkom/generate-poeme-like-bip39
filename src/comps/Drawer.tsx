import { useEffect, useState } from "react";
import { whiteOYC } from "./color";

interface DrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
}
export const Drawer: React.FC<DrawerProps> = ({ isOpen, children }) => {
  const [middleStop, setMiddleStop] = useState(50);

  useEffect(() => {
    let time = 0;
    let animationId: number;

    const animate = () => {
      time += 0.0167;

      // シンプルなsin関数で呼吸
      const newMiddleStop = 50 + Math.sin(time) * 10; // 35%~65%
      setMiddleStop(newMiddleStop);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      style={{
        maxHeight: "60dvh",
        maxWidth: "20dvw",
        position: "fixed",
        top: "20vmin",
        right: 0,
        transform: isOpen
          ? "translateY(0)"
          : "translateY(calc(-100% - 20vmin - 10vmin))",
        transition: "transform 0.3s steps(3, end)",
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
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "-8vmin", // 左に伸ばす
          right: 0,
          height: 0,
          borderBottom: "1px solid #000",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: "-8vmin",
          width: 0,
          borderLeft: "1px solid #000",
        }}
      />
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
