"use client";
import { useState } from "react";
import { matchHash } from "@/utils/addPoetry";
import { getPoetryHash } from "@/utils/util";
import Link from "next/link";
import GridInput from "../../comps/GridInput";

export default function Page() {
  const [hash, setHash] = useState("");
  const [isPoem, setIsPoem] = useState(false);

  const handleContentUpdate = async (text: string) => {
    if (!text) {
      setHash("");
      setIsPoem(false);
      return;
    }

    const newHash = await getPoetryHash(text);
    setHash(newHash);
    const isMatch = await matchHash(newHash);
    setIsPoem(isMatch);

    if (isMatch) {
      sessionStorage.setItem(newHash, text);
    }
  };

  return (
    <div
      className="center"
      style={{ display: "flex", flexDirection: "column", gap: "3vmin" }}
    >
      {hash && isPoem && (
        <div
          style={{
            width: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1vmin",
            borderRadius: "1vmin",
          }}
        >
          <Link href={`/visit/${hash}`}>
            <div
              style={{
                color: "black",
              }}
            >
              www.poetry-loggin.net/
              <span style={{ wordBreak: "break-all" }}>
                {hash?.split("").map((char, index) => {
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
        lineLength={5}
        columnCount={4}
        onUpdateContent={handleContentUpdate}
      />
    </div>
  );
}
