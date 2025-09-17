"use client";

import { useRouter } from "next/navigation";
import { KanjiKanaMeaning } from "@/interface/dictInterface";
import { createPoem } from "@/utils/createPoem";
import { getPoemHash } from "@/utils/hash";
import { generateConstrainedHaiku } from "@/utils/randomDict";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [poemWords, setPoem] = useState<KanjiKanaMeaning[]>();
  const [poetry, setPoetry] = useState<string>();
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

  const handleGenerate = () => {
    const words = generateConstrainedHaiku();
    let results = "";
    words.forEach((word) => {
      results += word.kanji ? word.kanji : word.kana;
    });
    setPoem(words);
    setPoetry(results);
  };

  return (
    <>
      <div className="center">
        {!isDone ? (
          <>
            <div>
              <div
                style={{
                  writingMode: "vertical-lr",
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "30px",
                }}
              >
                {poetry?.split("").map((char, i) => {
                  const randomRotation = Math.random() * 360;
                  return (
                    <h2
                      key={`${poetry}-${i}`}
                      style={{
                        opacity: 0,
                        transform: `${i % 2 == 0 ? `translateX(1rem) translateY(-1rem) rotate(-360deg)` : `translateX(-1rem) translateY(-1rem) rotate(360deg)`}`,
                        animation:
                          i % 2 == 0
                            ? `eastSide 0.3s ease-in 0s forwards`
                            : `westSide 0.3s ease-in ${0}s forwards`,
                      }}
                    >
                      {char}
                    </h2>
                  );
                })}
              </div>
              {/*<div>{hash}</div>*/}
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0 }}>
              <button onClick={handleGenerate}>generate</button>
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
            <div>
              <Link href={`/`}>home</Link>
              <Link href={`/visit`}>詩を確認する</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
