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
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string>("");

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
        setIsPublic(false); // privateに設定
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
        setIsPublic(true); // publicに設定
        setIsDone(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGeneratePoetry = async (dictMode: number) => {
    setPoetryLoading(true);
    setGenerateError("");

    try {
      const result = await generatePoetry(dictMode);

      if (result.success === false) {
        setGenerateError(result.error);
        return;
      }

      setPoetry(result.poetry);
    } catch (error) {
      setGenerateError("予期しないエラーが発生しました");
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
            generateError={generateError}
          />
        ) : (
          <AfterGeneratedPage hash={hash} poetry={poetry} isPublic={isPublic} />
        )}
      </div>
    </>
  );
}

interface GeneratePageProps {
  poetry?: string;
  hash?: string;
  handleGeneratePoetry: (dictMode: number) => Promise<void>;
  handleAddPrivatePoetry: () => Promise<void>;
  handleAddPublicPoetry: () => Promise<void>;
  poetryLoading: boolean;
  generateError: string;
}
const GeneratePage = ({
  poetry,
  hash,
  handleGeneratePoetry,
  handleAddPrivatePoetry,
  handleAddPublicPoetry,
  poetryLoading,
  generateError,
}: GeneratePageProps) => {
  const [isCopy, setIsCopy] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPublicDrawerOpen, setIsPublicDrawerOpen] = useState(false); // 追加
  const [showButtons, setShowButtons] = useState(false);
  const [dictMode, setDictMode] = useState<number>(0);

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

  const showExtraButtons =
    poetry && !poetryLoading && !isDrawerOpen && !isPublicDrawerOpen;

  useEffect(() => {
    if (showExtraButtons) {
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
      {isPublicDrawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 99,
          }}
          onClick={() => setIsPublicDrawerOpen(false)}
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
          {generateError ? (
            <div style={{ color: "black", fontWeight: "bold" }}>
              {generateError}
            </div>
          ) : (
            poetry
              ?.split("")
              .map((char, i) => (
                <PoetryChar key={`${poetry}-${i}`} char={char} index={i} />
              ))
          )}
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
            onClick={() => setIsPublicDrawerOpen(true)} // 変更
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
          onClick={
            poetryLoading ? undefined : () => handleGeneratePoetry(dictMode)
          }
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
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "inline-block",
              borderTop: "1px solid black",
              borderRight: "1px solid black",
              padding: "1vmin 3vmin",
              backgroundColor:
                dictMode == 0 ? "rgba(255,255,255,0.5)" : "transparent",
              cursor: poetryLoading ? "default" : "pointer",
              opacity: poetryLoading ? 0.5 : 1,
            }}
            onClick={() => setDictMode(0)}
          >
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "black",
                whiteSpace: "nowrap",
              }}
            >
              JMdict
            </div>
          </div>
          <div
            style={{
              display: "inline-block",
              borderTop: "1px solid black",
              padding: "1vmin 3vmin",
              backgroundColor:
                dictMode == 1 ? "rgba(255,255,255,0.5)" : "transparent",
              cursor: poetryLoading ? "default" : "pointer",
              opacity: poetryLoading ? 0.5 : 1,
            }}
            onClick={() => setDictMode(1)}
          >
            <div
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
                color: "black",
                whiteSpace: "nowrap",
              }}
            >
              Custom
            </div>
          </div>
        </div>
      </div>

      {/* Private Drawer */}
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

      {/* Public Drawer */}
      <Drawer isOpen={isPublicDrawerOpen}>
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
          <p style={{ fontWeight: "bold", padding: "0" }}>public</p>
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
            onClick={handleAddPublicPoetry}
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
  isPublic?: boolean; // 追加
}

const AfterGeneratedPage = ({
  hash,
  poetry,
  isPublic,
}: AfterGeneratedPageProps) => {
  const [isCopy, setIsCopy] = useState(false);
  const [showCenterNav, setShowCenterNav] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCenterNav(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
    <div>
      <div
        style={{
          color: "black",
          fontSize: "1.2rem",
          lineHeight: "1.6",
          flex: 1,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2vmin",
        }}
      >
        <span>{poetry}</span>
        <CopyIcon
          onClick={handleCopyPoetry}
          style={{ color: "black", cursor: "pointer" }}
        />
        {isCopy && (
          <span style={{ fontSize: "0.8rem", color: "green" }}>コピー</span>
        )}
      </div>
    </div>
  );
};
