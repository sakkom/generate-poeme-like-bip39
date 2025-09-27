"use client";
import GridInput from "@/comps/GridInput";
import { useState, useEffect } from "react";
import { convertToKana, isValidKana, isValidKanji } from "@/utils/kuromojin";

export default function Page() {
  const [mainContent, setMainContent] = useState<string>("");
  const [kanaCorrection, setKanaCorrection] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [predictedKana, setPredictedKana] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const predictKana = async (text: string): Promise<string> => {
    setIsLoading(true);
    try {
      const result = await convertToKana(text);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const analyzeMorphology = async () => {
      if (mainContent) {
        const predicted = await predictKana(mainContent);
        setPredictedKana(predicted);
        setKanaCorrection(predicted);
      } else {
        setPredictedKana("");
        setKanaCorrection("");
      }
    };

    const timeoutId = setTimeout(() => {
      analyzeMorphology();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [mainContent]);

  const handleMainContentUpdate = async (text: string) => {
    setMainContent(text);
    if (text && !(await isValidKanji(text))) {
      setValidationError("漢字・ひらがな・カタカナのみ入力してください");
    } else {
      setValidationError("");
    }
  };

  const handleKanaCorrectionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setKanaCorrection(e.target.value);
  };

  const handleSubmit = async () => {
    if (!mainContent) {
      alert("詩を入力してください");
      return;
    }
    if (validationError) {
      alert("入力内容を修正してください");
      return;
    }
    if (kanaCorrection && !(await isValidKana(kanaCorrection))) {
      alert("読み仮名にはひらがな・カタカナのみ使用してください");
      return;
    }
    console.log("詩:", mainContent);
    console.log("読み仮名:", kanaCorrection);
    console.log("音数:", kanaCorrection.length);
  };

  // 残りのJSXは同じ...
  return (
    <div
      className="center"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <label
          style={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}
        >
          詩を入力してください (17文字まで)
        </label>
        <GridInput
          maxChars={17}
          lineLength={5}
          columnCount={4}
          cellSize={50}
          onUpdateContent={handleMainContentUpdate}
        />
        <div style={{ color: "red", fontSize: "0.9rem", minHeight: "1.2rem" }}>
          {validationError}
        </div>
        <div style={{ fontSize: "0.9rem", color: "gray" }}>
          入力済み: {mainContent.length}/17文字
        </div>
      </div>

      {mainContent && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <label style={{ fontSize: "1rem", color: "gray" }}>
            読み仮名 (音数カウント用) {isLoading && "🔄 解析中..."}{" "}
            {!isLoading && predictedKana !== kanaCorrection && "← 修正済み"}
          </label>
          <input
            type="text"
            value={kanaCorrection}
            onChange={handleKanaCorrectionChange}
            placeholder="ひらがな・カタカナで入力"
            disabled={isLoading}
            style={{
              padding: "8px 12px",
              fontSize: "1rem",
              border: "2px solid #ddd",
              borderRadius: "5px",
              width: "300px",
              textAlign: "center",
              backgroundColor: isLoading ? "#f5f5f5" : "transparent",
              color: kanaCorrection !== predictedKana ? "#ff6b35" : "#4a5568",
              opacity: isLoading ? 0.7 : 1,
            }}
          />
          <div style={{ fontSize: "0.8rem", color: "gray" }}>
            {predictedKana && predictedKana !== kanaCorrection && (
              <div style={{ color: "black" }}>予測: {predictedKana}</div>
            )}
            音数: {kanaCorrection.length}音
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!mainContent || isLoading}
        style={{
          padding: "12px 24px",
          fontSize: "1.1rem",
          backgroundColor: mainContent && !isLoading ? "#4CAF50" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: mainContent && !isLoading ? "pointer" : "not-allowed",
          marginTop: "20px",
        }}
      >
        {isLoading ? "処理中..." : "詩を生成"}
      </button>

      <div style={{ fontSize: "0.9rem", color: "gray", textAlign: "center" }}>
        kuromojin形態素解析（サーバーサイド実行）
        <br />
        制限なし・高精度
      </div>
    </div>
  );
}
