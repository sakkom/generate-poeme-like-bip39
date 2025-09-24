import Link from "next/link";

export const NavigationRotate = ({
  text,
  href,
}: {
  text: string;
  href: string;
}) => {
  return (
    <Link
      href={href}
      style={{
        color: "black !important",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "2rem",
          // transform: `rotate(-10deg)`,
        }}
      >
        {text.split("").map((char, i) => {
          return (
            <h1
              key={`${text}-${i}`}
              style={{
                opacity: 0,
                transform: `${i % 2 == 0 ? `translateY(1rem)  rotate(-360deg)` : `translateY(-1rem)  rotate(360deg)`}`,
                animation:
                  i % 2 == 0
                    ? `topSide 0.5s ease-in ${i * 0.05}s forwards`
                    : `bottomSide 0.5s ease-in ${i * 0.05}s forwards`,
                margin: 0,
                color: "black",
                // textShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
              }}
            >
              {char}
            </h1>
          );
        })}
      </div>
    </Link>
  );
};
