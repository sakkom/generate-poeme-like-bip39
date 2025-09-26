"use client";
import { useState, useEffect } from "react";
import { whiteOYC } from "./color";

export const Background = ({
  children,
  width = 100,
}: {
  children: React.ReactNode;
  width?: number;
}) => {
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
      className="background"
      style={{
        background: `radial-gradient(circle,
          ${whiteOYC.orange} 0%,
          ${whiteOYC.yellow} ${middleStop}%,
          ${whiteOYC.cyan} 100%
        )`,
        minHeight: "100dvh",
        width: `${width}%`,
      }}
    >
      {children}
    </div>
  );
};
