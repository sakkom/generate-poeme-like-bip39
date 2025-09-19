"use client";
import { createPoem } from "@/utils/addPoetry";
import { getPoetryHash } from "@/utils/util";
import { getPoetry } from "@/utils/client";
import { useEffect, useState } from "react";
import Link from "next/link";
// import { convertJMdicWordsToPoetry } from "@/utils/convert";

export default function Page() {
  const [poetry, setPoetry] = useState<string>();
  const [hash, setHash] = useState<string>();
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (poetry) {
        setHash(await getPoetryHash(poetry));
      }
    })();
  }, [poetry]);

  const handleRegisterPoetry = async () => {
    if (!poetry || !hash) return;

    try {
      const createdHash = await createPoem(hash);
      if (createdHash) {
        setIsDone(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGeneratePoetry = async () => {
    try {
      const poetry = await getPoetry();
      if (!poetry || poetry.length === 0) return;

      setPoetry(poetry);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="center">
        {!isDone ? (
          <GeneratePage
            poetry={poetry}
            handleGeneratePoetry={handleGeneratePoetry}
            handleRegisterPoetry={handleRegisterPoetry}
          />
        ) : (
          <AfterGeneratedPage hash={hash} poetry={poetry} />
        )}
      </div>
    </>
  );
}

interface GeneratePageProps {
  poetry?: string;
  handleGeneratePoetry: () => Promise<void>;
  handleRegisterPoetry: () => Promise<void>;
}

const GeneratePage = ({
  poetry,
  handleGeneratePoetry,
  handleRegisterPoetry,
}: GeneratePageProps) => {
  return (
    <>
      {" "}
      <div style={{ width: "80%" }} className="center">
        <div
          style={{
            writingMode: "vertical-lr",
            display: "flex",
            flexDirection: "row",
            marginBottom: "30px",
          }}
        >
          {poetry?.split("").map((char, i) => {
            return (
              <h1
                key={`${poetry}-${i}`}
                style={{
                  opacity: 0,
                  transform: `${i % 2 == 0 ? `translateX(1rem) translateY(-1rem) rotate(-360deg)` : `translateX(-1rem) translateY(-1rem) rotate(360deg)`}`,
                  animation:
                    i % 2 == 0
                      ? `eastSide 0.25s ease-in ${i * 0.05}s forwards`
                      : `westSide 0.25s ease-in ${i * 0.05}s forwards`,
                }}
              >
                {char}
              </h1>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "60%",
          left: "30%",
          transform: "translate(0%, -100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={handleGeneratePoetry}
          style={{
            borderRadius: "50%",
            width: "5vw",
            height: "4vw",
          }}
        >
          生成
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: "100%",
          right: "30%",
          transform: "translate(0%, -100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {poetry ? (
          <button
            onClick={handleRegisterPoetry}
            style={{
              borderRadius: "50%",
              width: "5vw",
              height: "4vw",
            }}
          >
            privateで公開 publicで公開　
          </button>
        ) : null}
      </div>
    </>
  );
};

interface AfterGeneratedPageProps {
  hash?: string;
  poetry?: string;
}

const AfterGeneratedPage = ({ hash, poetry }: AfterGeneratedPageProps) => {
  return (
    <>
      <div>the key is this here</div>
      <div>
        http://localhost:3000/{hash}
        <br />
        {poetry}
      </div>
      <div>
        この詩を記憶することでこの詩にアクセスできます。
        パスフレーズの詩を記憶しない場合はハックされない限りアクセスされません。
      </div>
      <div>
        <Link href={`/`}>home</Link>
        <Link href={`/visit`}>詩を確認する</Link>
      </div>
    </>
  );
};
