"use client";

import { NavigationRotate } from "../comps/NavigationRotate";

export default function Home() {
  return (
    <>
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
          <NavigationRotate text="About" href="/about" />
          <NavigationRotate text="Generate" href="/generate" />
          <NavigationRotate text="Login" href="/visit" />
          <NavigationRotate text="opened" href="/open" />
          <NavigationRotate text="vocabulary" href="/create" />
        </div>
      </div>
    </>
  );
}
