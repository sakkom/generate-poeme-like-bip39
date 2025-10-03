"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, use, useRef, useMemo } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const router = useRouter();
  const [poetry, setPoetry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dimention, setDimention] = useState({ width: 0, height: 0 });
  const hash = use(params).hash;
  const boundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boundRef.current && poetry) {
      const { width, height } = boundRef.current.getBoundingClientRect();
      setDimention({ width, height });
    }
  }, [poetry]);

  const randomChars = useMemo(() => {
    if (dimention.width === 0 || dimention.height === 0 || !poetry) return [];

    const minSize = Math.min(dimention.width, dimention.height);
    const squareSize = minSize;
    const startX = (dimention.width - squareSize) / 2;
    const startY = (dimention.height - squareSize) / 2;
    return poetry.split("").map((char, index) => ({
      index,
      char,
      randomX: startX + Math.random() * squareSize,
      randomY: startY + Math.random() * squareSize,
    }));
  }, [poetry, dimention]);

  useEffect(() => {
    const storedPoetry = sessionStorage.getItem(hash);
    if (!storedPoetry) {
      router.push("/login");
      return;
    }
    setPoetry(storedPoetry);
    setIsLoading(false);
  }, [hash, router]);

  if (isLoading || !poetry) {
    return (
      <div className="center">
        <p style={{ color: "black" }}>Authenticating...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes appearAndAlign {
          0% {
            opacity: 0;
            left: var(--random-x);
            top: var(--random-y);
            transform: scale(0.2);
          }
          100% {
            opacity: 1;
            left: var(--final-x);
            top: var(--final-y);
            rotate: 0deg;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="center">
        <div
          ref={boundRef}
          style={{
            position: "relative",
            height: "80dvh",
            width: "80dvw",
          }}
        >
          {randomChars?.map((char) => {
            const fontSize = 24;
            const centerX = dimention.width / 2;
            const finalX = centerX - fontSize / 2;
            const offsetY = dimention.height * 0.1;
            const finalY = offsetY + char.index * fontSize;

            return (
              <span
                className="poetry"
                key={char.index}
                style={{
                  position: "absolute",
                  fontSize: `${fontSize}px`,
                  color: "black",
                  writingMode: "vertical-rl",
                  ["--random-x" as any]: `${char.randomX}px`,
                  ["--random-y" as any]: `${char.randomY}px`,
                  ["--final-x" as any]: `${finalX}px`,
                  ["--final-y" as any]: `${finalY}px`,
                  animation: `appearAndAlign 1s ease-in forwards`,
                  fontWeight: "bold",
                  wordBreak: "break-all",
                  rotate:
                    char.index % 2 === 0
                      ? "calc(360 * 10deg)"
                      : "calc(360 * 10deg)",
                }}
              >
                {char.char}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
}
