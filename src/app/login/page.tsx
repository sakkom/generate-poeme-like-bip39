"use client";
import { useState } from "react";
import { getPoetryHash } from "@/utils/util";
import Link from "next/link";
import GridInput from "../../comps/GridInput";
import { hasHash } from "@/utils/database";

export default function Page() {
  const [poetryHash, setPoetryHash] = useState("");
  const [hasPoetry, setHasPoetry] = useState(false);

  const handleContentUpdate = async (inputPoetry: string) => {
    if (!inputPoetry) return;

    const poetryHash = await getPoetryHash(inputPoetry);
    const isMatch = await hasHash(poetryHash);

    if (isMatch) {
      setHasPoetry(isMatch);
      setPoetryHash(poetryHash);
      sessionStorage.setItem(poetryHash, inputPoetry);
    }
  };

  return (
    <div
      className="center"
      style={{ display: "flex", flexDirection: "column", gap: "3vmin" }}
    >
      {hasPoetry && poetryHash && (
        <div
          style={{
            width: "250px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1vmin",
            borderRadius: "1vmin",
          }}
        >
          <Link href={`/${poetryHash}`}>
            <div
              style={{
                color: "black",
              }}
            >
              /
              <span style={{ wordBreak: "break-all" }}>
                {poetryHash?.split("").map((char, index) => {
                  const colors = ["#00ffff", "#ffff00", "#ff6600"];
                  return (
                    <span key={index} style={{ color: colors[index % 3] }}>
                      {char}
                    </span>
                  );
                })}
              </span>
            </div>
          </Link>
        </div>
      )}
      <GridInput
        maxChars={20}
        lineLength={4}
        columnCount={5}
        onUpdateContent={handleContentUpdate}
        isDictionary={false}
      />
    </div>
  );
}
