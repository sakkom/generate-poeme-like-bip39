import { Background } from "@/comps/Background";
import Link from "next/link";

export default function Page() {
  const items = [
    { text: "About", href: "/about" },
    { text: "Generate", href: "/generate" },
    { text: "Login", href: "/login" },
    { text: "public", href: "/public" },
    { text: "vocabulary", href: "/vocabulary" },
  ];

  return (
    <div className="center">
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularText items={items} />
      </div>
    </div>
  );
}

const CircularText = ({
  items,
}: {
  items: { text: string; href: string }[];
}) => {
  const fontSize = 10;
  const radius = 30; // vmin
  const gap = 3; // 単語間のgap（文字数相当）

  // 総文字数 + gap計算
  const totalChars = items.reduce((sum, item) => sum + item.text.length, 0);
  const totalWithGaps = totalChars + items.length * gap;

  let currentPosition = 0;

  const lastWordIndex = items.length - 1;
  const lastWordLength = items[lastWordIndex].text.length - 1;
  const allCharsCompleteTime = lastWordIndex * 0.2 + lastWordLength * 0.03 + 1; // 1sはfadeIn時間

  return (
    <div
      style={{
        position: "relative",
        width: `${radius * 2}vmin`,
        height: `${radius * 2}vmin`,
        animation: "rotate 60s linear infinite",
      }}
    >
      {items.map((item, itemIndex) => {
        return (
          <Link key={item.text} href={item.href}>
            {item.text.split("").map((char, charIndex) => {
              const angle = (currentPosition / totalWithGaps) * 2 * Math.PI;
              const x = radius + Math.cos(angle - Math.PI / 2) * radius;
              const y = radius + Math.sin(angle - Math.PI / 2) * radius;

              currentPosition++;

              const wordDelay = itemIndex * 0.2; // 各単語間0.2秒差
              const charDelay = charIndex * 0.03; // 各文字間0.03秒差
              const totalDelay = wordDelay + charDelay;

              return (
                <span
                  key={`${item.text}-${charIndex}`}
                  style={{
                    position: "absolute",
                    left: `${x}vmin`,
                    top: `${y}vmin`,
                    fontSize: `${fontSize}vmin`,
                    // fontWeight: "bold",
                    color: "black",
                    // opacity: 0.6,
                    // transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                    // opacity: 1.0,
                    // textShadow: "0 0 10px rgba(255, 255, 255, 1.0)",
                    transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                    cursor: "pointer",
                  }}
                >
                  {char}
                </span>
              );
            })}
            {itemIndex < items.length - 1 &&
              (() => {
                currentPosition += gap;
                return null;
              })()}
          </Link>
        );
      })}
    </div>
  );
};
