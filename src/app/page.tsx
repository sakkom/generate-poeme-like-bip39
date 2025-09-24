"use client";
import { NavigationRotate } from "../comps/NavigationRotate";

export default function Home() {
  const items = [
    { text: "About", href: "/about" },
    { text: "Generate", href: "/generate" },
    { text: "Login", href: "/visit" },
    { text: "opened", href: "/open" },
    { text: "vocabulary", href: "/create" },
  ];

  return (
    <>
      <div className="center">
        <div
          style={{
            width: "80%",
            minHeight: "100dvh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* 円形配置のコンテナ */}
          <div
            style={{
              position: "relative",
              width: "400px",
              height: "400px",
            }}
          >
            {items.map((item, index) => {
              const angle =
                ((2 * Math.PI) / items.length) * index - Math.PI / 2; // -90度からスタート
              const radius = 150;
              const x = 200 + Math.cos(angle) * radius;
              const y = 200 + Math.sin(angle) * radius;

              return (
                <div
                  key={item.text}
                  style={{
                    position: "absolute",
                    left: x - 80, // テキスト幅を考慮
                    top: y - 30, // テキスト高さを考慮
                    transform: "translate(-50%, -50%)", // 中心合わせ
                  }}
                >
                  <NavigationRotate text={item.text} href={item.href} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
