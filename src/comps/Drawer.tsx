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
        maxHeight: "10dvh",
        width: "100dvw",
        position: "fixed",
        top: 0,
        left: 0,
        transform: isOpen ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.3s steps(3, end)",
        // backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderBottom: "2px dotted #fff",
        padding: "1vmin 0",
        // background: `linear-gradient(to bottom,
        //   ${whiteOYC.orange} 0%,
        //   ${whiteOYC.yellow} ${middleStop}%,
        //   ${whiteOYC.cyan} 100%
        // )`,
        // borderRadius: " 0 0 5vmin 5vmin",
        color: "white",
        zIndex: 100,
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
