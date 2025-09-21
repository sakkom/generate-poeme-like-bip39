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
    console.log("入力されたテキスト:", text);

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
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        padding: "20vmin 0",
      }}
    >
      <GridInput
        maxChars={20}
        lineLength={5}
        columnCount={4}
        onUpdateContent={handleContentUpdate}
      />
      {hash && isPoem && (
        <div
          style={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link href={`/visit/${hash}`}>
            <span className="match">マッチ</span>
          </Link>
        </div>
      )}
    </div>
  );
}
