"use client";
import { useEffect, useState } from "react";
import { whiteOYC } from "./color";

interface Sha256HelixProps {
  hash: string;
}

export const Sha256Helix = ({ hash }: Sha256HelixProps) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = 1000 / 30;
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1 / 30);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  function place(index: number) {
    const angle = (Math.PI * 2 * index) / hash.length;
    const radiusPx = 50;
    const x = Math.cos(angle + time) * radiusPx;
    const z = Math.sin(angle + time) * radiusPx;
    const y = Math.sin(angle / 2.5 + time) * radiusPx * 3;
    return {
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
      z: Math.round(z * 100) / 100,
    };
  }

  function getCharColor(index: number) {
    const colors = Object.values(whiteOYC);
    const colorIndex = Math.floor(index) % colors.length;
    return colors[colorIndex];
  }

  return (
    <>
      {hash.split("").map((char, index) => {
        const { x, y, z } = place(index);
        const color = getCharColor(index);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate3d(${x}px, ${y}px, ${z}px)`,
              transformStyle: "preserve-3d",
              color,
              // border: "1px solid black",
            }}
          >
            {char}
          </div>
        );
      })}
    </>
  );
};
