"use client";

import { useRouter } from "next/navigation";
import { KanjiKanaMeaning } from "@/interface/dictInterface";
import { createPoem } from "@/utils/createPoem";
import { getPoemHash } from "@/utils/mnemonic";
import { generateConstrainedHaiku } from "@/utils/randomDict";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [poemWords, setPoem] = useState<KanjiKanaMeaning[]>();
  //hashはデザインのため取得
  const [hash, setHash] = useState<string>();
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (poemWords) {
        setHash(await getPoemHash(poemWords));
      }
    })();
  }, [poemWords]);

  //hashを渡すか、サーバーサイドでhashを渡すか。ならserverでhashのがいい。
  const commitHash = async () => {
    if (!poemWords) return;
    const createdHash = await createPoem(await getPoemHash(poemWords)).catch(
      (error) => {
        console.error(error);
      },
    );
    if (createdHash) {
      setIsDone(true);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        {!isDone ? (
          <>
            <div>
              {poemWords?.map((word, k) => (
                <div key={k}>{word.kanji ? word.kanji : word.kana}</div>
              ))}
              <div>{hash}</div>
            </div>
            <div>
              <button onClick={() => setPoem(generateConstrainedHaiku())}>
                generate
              </button>
              <button onClick={async () => await commitHash()}>commit</button>
            </div>
          </>
        ) : (
          <>
            <div>the key is this here</div>
            <div>
              http://localhost:3000/{hash}
              <br />
              この詩を記憶することでこの詩にアクセスできます。
              パスフレーズの詩を記憶しない場合はハックされない限りアクセスされません。
            </div>
          </>
        )}
      </div>
    </>
  );
}
