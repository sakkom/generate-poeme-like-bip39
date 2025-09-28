"use client";
import GridInput from "@/comps/GridInput";
import { useState, useEffect } from "react";
import { convertToKana, isValidKana, isValidKanji } from "@/utils/kuromojin";

export default function Page() {
  const [mainContent, setMainContent] = useState<string>("");
  const [kanaCorrection, setKanaCorrection] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //ルビの確認はdialogでもいいかも。
  useEffect(() => {
    if (!mainContent) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const result = await convertToKana(mainContent);
        setKanaCorrection(result);
      } finally {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [mainContent]);

  const handleSubmit = async () => {
    if (!mainContent || !kanaCorrection) return;
    if (!(await isValidKana(kanaCorrection))) return;
    if (!(await isValidKanji(mainContent))) return;
  };

  return (
    <div>
      <h1>詩を入力してください (17文字まで)</h1>

      <GridInput
        maxChars={17}
        lineLength={5}
        columnCount={4}
        cellSize={50}
        onUpdateContent={setMainContent}
      />

      <p>{mainContent.length}/17文字</p>

      {mainContent && (
        <div>
          <label>読み仮名:</label>
          <input
            type="text"
            value={kanaCorrection}
            onChange={(e) => setKanaCorrection(e.target.value)}
            disabled={isLoading}
          />
          <p>音数: {kanaCorrection.length}音</p>
          {isLoading && <p>解析中...</p>}
        </div>
      )}

      <button onClick={handleSubmit} disabled={!mainContent || isLoading}>
        詩を生成
      </button>
    </div>
  );
}
