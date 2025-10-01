"use client";
import { getPoetryHash } from "@/utils/util";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CopyIcon } from "@radix-ui/react-icons";
import { generatePoetry } from "@/utils/generate";
import { savePrivatePoetry, savePublicPoetry } from "@/utils/database";
import { Drawer } from "@/comps/Drawer";
import { PoetryChar } from "@/comps/PoetryChar";

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
  poetryLoading,
}: GeneratePageProps) => {
  const [isCopy, setIsCopy] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

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

  const showExtraButtons = poetry && !poetryLoading && !isDrawerOpen;

  useEffect(() => {
    if (showExtraButtons) {
      // 次のフレームでトランジションを開始
      requestAnimationFrame(() => {
        setShowButtons(true);
      });
    } else {
      setShowButtons(false);
    }
  }, [showExtraButtons]);

  return (
    <>
      {isDrawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 99,
          }}
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
      <div style={{ width: "80%", height: "80dvh" }} className="center">
        <div
          style={{
            writingMode: "vertical-rl",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {poetry?.split("").map((char, i) => (
            <PoetryChar key={`${poetry}-${i}`} char={char} index={i} />
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "20vmin",
          left: "0vmin",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* 1行目: パブリック */}
        {showExtraButtons && (
          <div
            style={{
              display: "inline-block",
              padding: "1vmin 3vmin",
              backgroundColor: "transparent",
              cursor: "pointer",
              borderRight: "1px solid black",
              transform: showButtons ? "translateX(0)" : "translateX(-100%)",
              transition:
                "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
              opacity: showButtons ? 1 : 0,
            }}
            onClick={handleAddPublicPoetry}
          >
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "black",
                whiteSpace: "nowrap",
              }}
            >
              パブリック
            </div>
          </div>
        )}
        {/* 2行目: プライベート */}
        {showExtraButtons && (
          <div
            style={{
              display: "inline-block",
              borderBottom: "1px solid black",
              borderTop: "1px solid black",
              padding: "1vmin 3vmin",
              backgroundColor: "transparent",
              cursor: "pointer",
              transform: showButtons ? "translateX(0)" : "translateX(-100%)",
              transition:
                "transform 0.3s ease-in-out 0.1s, opacity 0.3s ease-in-out 0.1s",
              opacity: showButtons ? 1 : 0,
            }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "black",
                whiteSpace: "nowrap",
              }}
            >
              プライベート
            </div>
          </div>
        )}
        {/* 3行目: 生成 (常に表示・一番下) */}
        <div
          style={{
            display: "inline-block",
            borderRight: "1px solid black",
            padding: "1vmin 3vmin",
            backgroundColor: "transparent",
            cursor: poetryLoading ? "default" : "pointer",
            opacity: poetryLoading ? 0.5 : 1,
          }}
          onClick={poetryLoading ? undefined : handleGeneratePoetry}
        >
          <div
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "black",
              whiteSpace: "nowrap",
            }}
          >
            {poetryLoading ? "生成中..." : "生成"}
          </div>
        </div>
      </div>
      <Drawer isOpen={isDrawerOpen}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "5vmin",
            height: "100%",
            padding: "5vmin 3vmin",
            position: "relative",
          }}
        >
          <p style={{ fontWeight: "bold", padding: "0" }}>private</p>
          <div
            style={{
              padding: "3vmin 3vmin",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              borderTop: "1px solid #000",
              borderBottom: "1px solid #000",
              gap: "1vmin",
            }}
          >
            {isCopy && (
              <span style={{ fontSize: "0.8rem", color: "green" }}>コピー</span>
            )}
            <CopyIcon
              onClick={handleCopyPoetry}
              style={{ color: "black", cursor: "pointer" }}
            />

            <div style={{ writingMode: "vertical-rl", color: "black" }}>
              {poetry}
            </div>
          </div>
          <button
            style={{
              width: "auto",
              color: "black",
              borderRadius: 0,
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={handleAddPrivatePoetry}
          >
            確定
          </button>
        </div>
      </Drawer>
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
