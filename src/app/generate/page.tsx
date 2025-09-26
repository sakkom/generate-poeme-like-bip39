"use client";
import { getPoetryHash } from "@/utils/util";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyIcon } from "@radix-ui/react-icons";
import { CircleButton } from "@/comps/CircleButton";
import { whiteOYC } from "@/comps/color";
import { generatePoetry } from "@/utils/generate";
import { savePrivatePoetry, savePublicPoetry } from "@/utils/database";

export default function Page() {
  const [poetry, setPoetry] = useState<string>();
  const [hash, setHash] = useState<string>();
  const [isDone, setIsDone] = useState<boolean>(false);
  const [poetryLoading, setPoetryLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (poetry) {
        setHash(await getPoetryHash(poetry));
      }
    })();
  }, [poetry]);

  const handleAddPrivatePoetry = async () => {
    if (!poetry || !hash) return;

    try {
      const createdHash = await savePrivatePoetry(hash);
      if (createdHash) {
        setIsDone(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPublicPoetry = async () => {
    if (!poetry || !hash) return;

    try {
      const createdHash = await savePublicPoetry(hash, poetry);
      if (createdHash) {
        setIsDone(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGeneratePoetry = async () => {
    setPoetryLoading(true);
    try {
      const poetry = await generatePoetry();
      if (!poetry || poetry.length === 0) return;

      setPoetry(poetry);
    } catch (error) {
      console.error(error);
    } finally {
      setPoetryLoading(false);
    }
  };

  return (
    <>
      <div className="center">
        {!isDone ? (
          <GeneratePage
            poetry={poetry}
            hash={hash}
            handleGeneratePoetry={handleGeneratePoetry}
            handleAddPrivatePoetry={handleAddPrivatePoetry}
            handleAddPublicPoetry={handleAddPublicPoetry}
            poetryLoading={poetryLoading}
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
  hash?: string;
  handleGeneratePoetry: () => Promise<void>;
  handleAddPrivatePoetry: () => Promise<void>;
  handleAddPublicPoetry: () => Promise<void>;
  poetryLoading: boolean;
}

const GeneratePage = ({
  poetry,
  hash,
  handleGeneratePoetry,
  handleAddPrivatePoetry,
  handleAddPublicPoetry,
  poetryLoading, // 追加
}: GeneratePageProps) => {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  const handleCopyPoetry = async () => {
    if (!poetry) return;

    try {
      await navigator.clipboard.writeText(poetry);
      setIsCopy(true);
      setTimeout(() => setIsCopy(false), 800);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  return (
    <>
      <div style={{ width: "80%", height: "90dvh" }} className="center">
        <div
          style={{
            writingMode: "vertical-rl",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {poetry?.split("").map((char, i) => {
            return (
              <h1
                className="poetry"
                key={`${poetry}-${i}`}
                style={{
                  opacity: 0,
                  transform: `${i % 2 == 0 ? `translateX(1rem) translateY(-1rem) rotate(-360deg)` : `translateX(-1rem) translateY(-1rem) rotate(360deg)`}`,
                  animation:
                    i % 2 == 0
                      ? `eastSide 0.5s ease-in ${i * 0.05}s forwards`
                      : `westSide 0.5s ease-in ${i * 0.05}s forwards`,
                  textShadow: "0 0 10px rgba(255, 255, 255, 1.0)",
                }}
              >
                {char}
              </h1>
            );
          })}
        </div>
      </div>
      <div>
        <CircleButton
          onClick={handleGeneratePoetry}
          disabled={poetryLoading}
          background={whiteOYC.yellow}
          style={{
            bottom: "5vmin",
            left: "5vmin",
            opacity: poetryLoading ? 0.5 : 1,
            transform: "scale(0%)",
            animation: "ScaleButton 1s ease-in-out forwards",
          }}
        >
          {poetryLoading ? "生成中..." : "生成"}
        </CircleButton>

        {poetry && !poetryLoading && (
          <>
            <CircleButton
              onClick={() => setRegisterDialogOpen(true)}
              background={whiteOYC.orange}
              style={{
                bottom: "calc(8vmin + 16vmin * sin(45deg) - 8vmin + 5vmin)",
                left: "calc(8vmin + 16vmin * cos(45deg) - 8vmin + 5vmin)",
                opacity: registerDialogOpen ? 0.5 : 1,
                // animation: "fadeIn 1s ease-in  forwards",
                // transition: "opacity 0.3s ease-in-out",
                transform: "scale(0%)",
                animation: "ScaleButton 0.5s ease-in-out forwards",
              }}
            >
              プライベートで登録
            </CircleButton>

            {registerDialogOpen && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                  background: "rgba(0, 0, 0, 0.5)",
                }}
                onClick={() => setRegisterDialogOpen(false)}
              >
                <div
                  className="dialog-circle"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    transform: "scale(90%)",
                    animation: "ScaleButton 0.5s ease-in-out forwards",
                  }}
                >
                  <div
                    className="dialog"
                    style={{
                      width: "90vmin",
                      position: "relative",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <h2
                        style={{
                          textAlign: "center",
                          textShadow: "0 0 10px rgba(255, 255, 255, 1.0)",
                        }}
                      >
                        Privateで登録
                      </h2>
                      <div
                        style={{ marginBottom: "3vmin", marginTop: "3vmin" }}
                      >
                        <div
                          style={{
                            fontWeight: "bold",
                            padding: "1vmin 0",
                          }}
                        >
                          Poetry(暗号鍵)
                        </div>
                        <div>
                          {isCopy && (
                            <div style={{ textAlign: "end" }}>Copy</div>
                          )}
                          <div
                            style={{
                              // backgroundColor: "#ffff00",

                              background:
                                "repeating-radial-gradient(circle, #ffff00 0%, #fff 50%, #ffff00 100%)",
                              // background:
                              //   "radial-gradient(circle,  #ff6600 0%, #ffff00 50%, #00ffff 100%)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderRadius: "3px",
                              padding: " 0 1vmin",
                              wordBreak: "break-all",
                              color: "black",
                              // filter:
                              //   "drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))",
                              boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
                            }}
                          >
                            <div className="dialog-poetry">{poetry}</div>
                            <CopyIcon
                              style={{ cursor: "pointer" }}
                              onClick={handleCopyPoetry}
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "5vmin",
                          padding: "1vmin 0",
                        }}
                      >
                        <p style={{ fontSize: "0.8rem" }}>
                          ※Poetryはデータベースに保存されません.
                          以下のリンクにて復元されます。
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: "1vmin",
                            opacity: 0.6,
                          }}
                        >
                          <div>Loggin:</div>
                          <div>www.poetry-loggin.net/loggin</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "1vmin",
                            opacity: 0.6,
                          }}
                        >
                          <div>Poetry:</div>
                          <div>
                            www.poetry-loggin.net/
                            <span style={{ wordBreak: "break-all" }}>
                              {hash}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "5vmin",
                        }}
                      >
                        <button
                          onClick={handleAddPrivatePoetry}
                          style={{
                            // alignItems: "center",
                            // backgroundColor: "#00ffff",
                            background:
                              "repeating-radial-gradient(circle, #00ffff 0%, #fff 50%, #00ffff 100%)",
                            border: "none",
                            borderRadius: "3px",
                            padding: "1vmin",
                            width: "30vmin",
                            color: "black",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          作成
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {poetry && !poetryLoading && (
          <CircleButton
            onClick={handleAddPublicPoetry}
            background={whiteOYC.cyan}
            style={{
              bottom:
                "calc((8vmin + 16vmin * sin(45deg)) + 16vmin * sin(120deg) - 8vmin + 5vmin)",
              left: "calc((8vmin + 16vmin * cos(45deg)) + 16vmin * cos(120deg) - 8vmin + 5vmin)",
              // opcity: isdialog ? 0.5 : 1,
              transform: "scale(0%)",
              animation: "ScaleButton 0.5s ease-in-out forwards",
            }}
          >
            オープンで公開
          </CircleButton>
        )}
      </div>
    </>
  );
};

interface AfterGeneratedPageProps {
  hash?: string;
  poetry?: string;
}

const AfterGeneratedPage = ({ hash, poetry }: AfterGeneratedPageProps) => {
  const [isCopy, setIsCopy] = useState(false);

  const handleCopyPoetry = async () => {
    if (!poetry) return;

    try {
      await navigator.clipboard.writeText(poetry);
      setIsCopy(true);
      setTimeout(() => setIsCopy(false), 800);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle,  #ff6600 0%, #ffff00 50%, #00ffff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <div
            className="dialog"
            style={{
              background: "transparent",
              width: "90vmin",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                fontSize: "5vmin",
                cursor: "pointer",
                width: "5vmin",
                height: "5vmin",
                textAlign: "center",
              }}
            ></button>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "black",
                }}
              >
                <Link
                  href={"/visit"}
                  style={{
                    background:
                      "radial-gradient(circle,  #ff6600 0%, #ffff00 50%, #00ffff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    width: "18vmin",
                    height: "18vmin",
                    borderRadius: "50%",
                    margin: "0 1vmin",
                    fontWeight: "bold",
                  }}
                >
                  ログイン
                </Link>
                または
                <Link
                  href={"/"}
                  style={{
                    background:
                      "radial-gradient(circle,  #ff6600 0%, #ffff00 50%, #00ffff 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    width: "20vmin",
                    height: "20vmin",
                    borderRadius: "50%",
                    margin: "0 1vmin",
                    fontWeight: "bold",
                  }}
                >
                  ホーム
                </Link>
                に戻る
              </div>
              <div style={{ marginTop: "5vmin" }}>
                {isCopy && (
                  <div style={{ color: "black", textAlign: "end" }}>copy</div>
                )}
                <div>
                  <div
                    style={{
                      // backgroundColor: "#ffff00",
                      background:
                        "radial-gradient(circle,  #ff6600 0%, #ffff00 50%, #00ffff 100%)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: " 0 1vmin",
                      wordBreak: "break-all",
                      color: "black",
                    }}
                  >
                    <div className="dialog-poetry">{poetry}</div>
                    <CopyIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleCopyPoetry}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  // borderTop: "1vmin dotted #ff6600",
                  // borderBottom: "1vmin dotted #ff6600",
                  padding: "1vmin 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "1vmin",
                  }}
                >
                  <div>
                    <span style={{ wordBreak: "break-all" }}>
                      {hash?.split("").map((char, index) => {
                        const colors = ["#00ffff", "#ffff00", "#ff6600"];
                        return (
                          <span
                            key={index}
                            style={{ color: colors[index % 3] }}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {/*<div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20vmin",
                }}
              >
                <button
                  style={{
                    // alignItems: "center",
                    backgroundColor: "black",
                    border: "none",
                    borderRadius: "3px",
                    padding: "1vmin",
                    width: "30vmin",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  作成
                </button>
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// interface DialogProps {
//   isOpen: boolean;
//   hash: string;
//   poetry: string;
// }

// const DialogDemo = ({ isOpen, hash, poetry }: DialogProps) => {
//   return (

//   );
// };
