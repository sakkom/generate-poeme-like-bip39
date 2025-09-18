"use client";
import Link from "next/link";

function TextRotate({ text, href }: { text: string; href: string }) {
  return (
    <Link href={href}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "2rem",
        }}
      >
        {text.split("").map((char, i) => {
          return (
            <h2
              key={`${text}-${i}`}
              style={{
                opacity: 0,
                transform: `${i % 2 == 0 ? `translateY(1rem)  rotate(-360deg)` : `translateY(-1rem)  rotate(360deg)`}`,
                animation:
                  i % 2 == 0
                    ? `topSide 0.5s ease-in ${i * 0.05}s forwards`
                    : `bottomSide 0.5s ease-in ${i * 0.05}s forwards`,
                margin: 0,
              }}
            >
              {char}
            </h2>
          );
        })}
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <style jsx global>{``}</style>

      <div className="center">
        <div
          style={{
            width: "80%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid white",
          }}
        >
          <TextRotate text="About" href="/about" />
          <TextRotate text="Generate" href="/generate" />
          <TextRotate text="Login" href="/visit" />
          <TextRotate text="opened" href="/open" />
          <TextRotate text="vocabulary" href="/create" />
        </div>
      </div>
    </>
  );
}
