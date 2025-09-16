"use client";

import { useRef, useState } from "react";
import { matchHash } from "@/utils/createPoem";
import { getHash } from "@/utils/hash";
import Link from "next/link";

/*/vistから/hashに流れる自然な検索そしてログイン機能を実装 */
export default function Page() {
  const [hash, setHash] = useState("");
  const [isPoem, setIsPoem] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async () => {
    const value = inputRef.current?.value;
    if (!value) return;
    const hash = await getHash(value);
    setHash(hash);
    const isMatch = await matchHash(hash);
    setIsPoem(isMatch);
  };
  return (
    <div>
      <div>
        <input type="text" name="poem" ref={inputRef} onChange={handleChange} />
      </div>
      {isPoem ? (
        <Link href={`/visit/${hash}`}>
          http://localhost:3000/
          <span style={{ color: "pink" }}>{hash}</span>
        </Link>
      ) : (
        <p>
          http://localhost:3000/<span style={{ color: "gray" }}>{hash}</span>
        </p>
      )}
      <div></div>
    </div>
  );
}
// 高気圧環境
// ルービック・キューブ
