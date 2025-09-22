"use client";
import { createPoem } from "@/utils/addPoetry";
import { getPoetryHash } from "@/utils/util";
import { getPoetry } from "@/utils/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyIcon } from "@radix-ui/react-icons";
// import { convertJMdicWordsToPoetry } from "@/utils/convert";

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
    setPoetryLoading(true);
    try {
      const poetry = await getPoetry();
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
            handleRegisterPoetry={handleRegisterPoetry}
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
  handleRegisterPoetry: () => Promise<void>;
  poetryLoading: boolean;
}

const GeneratePage = ({
  poetry,
  hash,
  handleGeneratePoetry,
  handleRegisterPoetry,
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
              <div
                className="poetry"
                key={`${poetry}-${i}`}
                style={{
                  opacity: 0,
                  transform: `${i % 2 == 0 ? `translateX(1rem) translateY(-1rem) rotate(-360deg)` : `translateX(-1rem) translateY(-1rem) rotate(360deg)`}`,
                  animation:
                    i % 2 == 0
                      ? `eastSide 0.5s ease-in ${i * 0.05}s forwards`
                      : `westSide 0.5s ease-in ${i * 0.05}s forwards`,
                }}
              >
                {char}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <button
          onClick={handleGeneratePoetry}
          disabled={poetryLoading}
          className="button"
          style={{
            position: "absolute",
            bottom: "5vmin",
            left: "5vmin",
            width: "16vmin",
            height: "16vmin",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            cursor: "pointer",
            border: "none",
            fontWeight: "bold",
            //
            background: poetryLoading ? "rgba(255, 255, 0, 0.5)" : "#ffff00",
            textDecoration: "none",
            color: poetryLoading ? "black" : "black",
          }}
        >
          {poetryLoading ? "生成中..." : "生成"}
        </button>

        {poetry && !poetryLoading && (
          <>
            <button
              onClick={() => setRegisterDialogOpen(true)}
              className="button"
              style={{
                position: "absolute",
                bottom: "calc(8vmin + 16vmin * sin(45deg) - 8vmin + 5vmin)",
                left: "calc(8vmin + 16vmin * cos(45deg) - 8vmin + 5vmin)",
                width: "16vmin",
                height: "16vmin",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "#ff6600",
                cursor: "pointer",
                // background:
                //   "radial-gradient(circle,  #ff6600 0%, #ffff00 50%, #00ffff 100%)",
                textDecoration: "none",
                color: "black",
                border: "none",
                fontWeight: "bold",
                opacity: 0,
                // transform: "translateX(-30vmin)",
                animation: "fadeIn 1s ease-in  forwards",
              }}
            >
              プライベートで登録
            </button>

            {registerDialogOpen && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  // background:
                  //   "radial-gradient(circle, rgba(255,255,255,1.0) 0%, rgba(0,0,0,1.0) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
                onClick={() => setRegisterDialogOpen(false)}
              >
                <div
                  className="dialog-circle"
                  onClick={(e) => e.stopPropagation()}
                >
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
                      onClick={() => setRegisterDialogOpen(false)}
                    ></button>
                    <div>
                      <h2 style={{ textAlign: "center" }}>Privateで登録</h2>
                      <div
                        style={{ marginBottom: "3vmin", marginTop: "3vmin" }}
                      >
                        <div style={{ fontWeight: "bold", padding: "1vmin 0" }}>
                          Poetry(暗号鍵)
                        </div>
                        <div>
                          {isCopy && (
                            <div style={{ textAlign: "end" }}>Copy</div>
                          )}
                          <div
                            style={{
                              backgroundColor: "#ffff00",
                              // background:
                              //   "radial-gradient(circle,  #ff6600 0%, #ffff00 50%, #00ffff 100%)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderRadius: "3px",
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
                          marginTop: "5vmin",
                          borderTop: "1vmin dotted #ff6600",
                          borderBottom: "1vmin dotted #ff6600",
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
                          onClick={handleRegisterPoetry}
                          style={{
                            // alignItems: "center",
                            backgroundColor: "#00ffff",
                            border: "none",
                            borderRadius: "3px",
                            padding: "1vmin",
                            width: "30vmin",
                            color: "black",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
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
          <button
            className="button"
            style={{
              position: "absolute",
              bottom:
                "calc((8vmin + 16vmin * sin(45deg)) + 16vmin * sin(120deg) - 8vmin + 5vmin)",
              left: "calc((8vmin + 16vmin * cos(45deg)) + 16vmin * cos(120deg) - 8vmin + 5vmin)",
              width: "16vmin",
              height: "16vmin",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 255, 255, 1.0)",
              textDecoration: "none",
              color: "black",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              // transform: "translateX(-30vmin)",
              opacity: 0,
              animation: "fadeIn 1s ease-in 0.5s forwards",
            }}
          >
            オープンで公開
          </button>
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
      {/*<div style={{ width: "80%", height: "90vh" }} className="center">
        <div
          style={{
            writingMode: "vertical-rl",
            display: "flex",
            // flexDirection: "column",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              // justifyContent: "space-between",
              padding: " 0.5rem",
              // border: "2px dotted gray",
              // borderRadius: "8px",
              // borderRadius: "0px 8px 8px 0px",/
              height: "100%",
            }}
          >
            <CopyIcon style={{ marginBottom: "0.5rem" }} />
            <div className="poetry" style={{ height: "auto" }}>
              {poetry}
            </div>
          </div>
          <h3
            style={{
              padding: "0.3rem ",
              // borderTop: "2px dotted gray",
              borderRight: "0px",
              // borderBottom: "2px dotted gray",
              // borderLeft: "2px dotted gray",
              // borderRadius: "8px 0 0 8px",
              height: "100%",
              wordBreak: "break-all",
              textAlign: "end",
            }}
          >
            http://localhost:3000/{hash}
          </h3>
        </div>
      </div>
      <div>
        <Link
          href="/"
          className="button"
          style={{
            position: "absolute",
            bottom: "0vmin",
            left: "0vmin",
            width: "16vmin",
            height: "16vmin",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "white",
            textDecoration: "none",
            color: "black",
          }}
        >
          ホーム
        </Link>

        <Link
          href="/visit"
          className="button"
          style={{
            position: "absolute",
            bottom: "calc(8vmin + 16vmin * sin(45deg) - 8vmin)",
            left: "calc(8vmin + 16vmin * cos(45deg) - 8vmin)",
            width: "16vmin",
            height: "16vmin",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "white",
            textDecoration: "none",
            color: "black",
            textAlign: "center",
          }}
        >
          詩にログイン
        </Link>
      </div>*/}
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
