"use client";
import { whiteOYC } from "@/comps/color";
import { Drawer } from "@/comps/Drawer";
import { useEffect, useState } from "react";

export default function Page() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
    <div>
      <h1>Welcome to Next.js!</h1>
      <button onClick={() => setIsDrawerOpen(!isDrawerOpen)}>Drawer</button>
      <Drawer isOpen={isDrawerOpen}>
        {/*<h5>This is the content of the drawer.</h5>*/}
        <button
          style={{
            height: "20vmin",
            width: "20vmin",
            background: `radial-gradient(circle,
              ${whiteOYC.orange} 0%,
              ${whiteOYC.yellow} ${middleStop}%,
              ${whiteOYC.cyan} 100%
            )`,
            border: "none",
            borderRadius: "50%",
            color: "black",
          }}
        >
          button
        </button>
      </Drawer>
    </div>
  );
}
