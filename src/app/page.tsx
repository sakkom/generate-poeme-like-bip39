"use client";

import { NavigationRotate } from "../comps/NavigationRotate";

export default function Home() {
  return (
    <>
      <div className="center">
        <div
          style={{
            width: "80%",
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // border: "1px solid white",
            background:
              "radial-gradient(circle,  #ff6600 0%, #ffff00 50%, #00ffff 100%)",
          }}
        >
          <NavigationRotate text="About" href="/about" />
          <NavigationRotate text="Generate" href="/generate" />
          <NavigationRotate text="Login" href="/visit" />
          <NavigationRotate text="opened" href="/open" />
          <NavigationRotate text="vocabulary" href="/create" />
        </div>
        {/*<div
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            writingMode: "vertical-lr",
            height: "100vh",
            position: "absolute",
            top: 0,
            left: "10%",
            gap: "1rem",
            color: "black",
          }}
        >
          <div>ホーム</div>
          <div>生成</div>
          <div>ログイン</div>
          <div>公開</div>
          <div>辞書</div>
        </div>*/}
      </div>
    </>
  );
}
