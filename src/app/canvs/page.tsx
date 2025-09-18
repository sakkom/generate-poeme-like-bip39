"use client";
import React, { useRef, useEffect } from "react";
const HoneyComb = (p5: any) => {
  p5.setup = () => {
    p5.createCanvas(window.innerWidth, window.innerHeight);
  };
  p5.draw = () => {
    p5.background(255);
    p5.stroke(0);
    p5.strokeWeight(2);

    const radius = 80;
    const hexHeight = radius * 1.1 * p5.sin(p5.TWO_PI / 6.0) * 2;
    const deltaX = radius * 1.1 * (1 + p5.cos(p5.TWO_PI / 6.0));
    const deltaY = hexHeight;
    const cols = p5.ceil(p5.width / 2 / deltaX);
    const rows = p5.ceil(p5.height / 2 / deltaY);
    const centerX = p5.width / 2;
    const centerY = p5.height / 2;

    for (let row = -rows; row <= rows; row++) {
      for (let col = -cols; col <= cols; col++) {
        let x = centerX + col * deltaX;
        let y = centerY + row * deltaY;

        if (Math.abs(col % 2) === 1) {
          y += deltaY / 2;
        }

        drawHexagon(p5, x, y, radius);
      }
    }
  };

  const drawHexagon = (
    p5: any,
    centerX: number,
    centerY: number,
    radius: number,
  ) => {
    p5.beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = (p5.TWO_PI / 6.0) * i;
      const x = centerX + radius * p5.cos(angle);
      const y = centerY + radius * p5.sin(angle);
      p5.vertex(x, y);
    }
    p5.endShape(p5.CLOSE);
  };
};

export default function Page() {
  useEffect(() => {
    const loadP5 = async () => {
      const p5 = (await import("p5")).default;
      new p5(HoneyComb);
    };
    loadP5();
  }, []);
  return <div></div>;
}
