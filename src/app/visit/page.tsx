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
    <div className="center">
      <GridInput
        maxChars={20}
        lineLength={5}
        columnCount={4}
        onUpdateContent={handleContentUpdate}
      />

      {hash && (
        <div style={{ marginTop: "20px" }}>
          {isPoem ? (
            <Link href={`/visit/${hash}`}>
              http://localhost:3000/
              <span style={{ color: "pink" }}>{hash}</span>
            </Link>
          ) : (
            <p>
              http://localhost:3000/
              <span style={{ color: "gray" }}>{hash}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
