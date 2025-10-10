"use client";
import { whiteOYC } from "@/comps/color";
import { useRef, useState } from "react";

interface GridInputProps {
  maxChars?: number;
  lineLength?: number;
  columnCount?: number;
  cellSize?: number;
  onUpdateContent?: (text: string) => void;
  isDictionary: boolean;
}

interface CursorPos {
  xPos: number;
  yPos: number;
}

export default function GridInput({
  maxChars = 20,
  lineLength = 5,
  columnCount = 4,
  cellSize = 50,
  onUpdateContent,
  isDictionary = false,
}: GridInputProps) {
  const [content, setContent] = useState<string[]>(Array(maxChars).fill(""));
  const [cursor, setCursor] = useState<CursorPos>({ xPos: 0, yPos: 0 });
  const [isIme, setIsIme] = useState(false);
  const [imeText, setImeText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // const actualCharCount = content.filter((char) => char !== "").length;
  const positionToIndex = (xPos: number, yPos: number) =>
    xPos * lineLength + yPos;
  const indexToPosition = (index: number) => ({
    xPos: Math.floor(index / lineLength),
    yPos: index % lineLength,
  });
  const getCurrentIndex = () => positionToIndex(cursor.xPos, cursor.yPos);

  const updateContent = (newContent: string[]) => {
    setContent(newContent);
    onUpdateContent?.(newContent.filter((char) => char !== "").join(""));
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ""; // ← 修正
    }
  };

  const handleBackSpace = () => {
    const currentIndex = getCurrentIndex();
    // 現在のカーソル位置に文字がある場合はそれを削除
    if (content[currentIndex] !== "") {
      const newContent = [...content];
      newContent[currentIndex] = "";
      updateContent(newContent);
      clearInput();
      return;
    }
    // 前の位置に移動して削除
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newContent = [...content];
      newContent[newIndex] = "";
      updateContent(newContent);
      setCursor(indexToPosition(newIndex));
      clearInput();
    }
  };

  const addCharacter = (char: string) => {
    const currentIndex = getCurrentIndex();
    if (currentIndex >= maxChars) return;

    const newContent = [...content];
    newContent[currentIndex] = char;
    updateContent(newContent);

    const nextIndex = currentIndex + 1;
    if (nextIndex < maxChars) {
      setCursor(indexToPosition(nextIndex));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (isIme) {
      setImeText(value);
    } else {
      if (getCurrentIndex() >= maxChars) {
        clearInput();
        return;
      }
      const lastChar = value[value.length - 1];

      // isDictionaryがtrueの場合のみ漢字・ひらがな・カタカナに制限
      if (lastChar) {
        const isValidChar = isDictionary
          ? /[\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]/.test(lastChar)
          : true; // isDictionary=falseなら全文字許可

        if (isValidChar) {
          addCharacter(lastChar);
        }
      }
      clearInput();
    }
  };

  const handleCompositionStart = () => setIsIme(true);

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>,
  ) => {
    const value = e.currentTarget.value;

    if (value) {
      const currentIndex = getCurrentIndex();
      const newContent = [...content];
      let nextIndex = currentIndex;

      for (const char of value) {
        if (nextIndex >= maxChars) break;

        // isDictionaryがtrueの場合のみ漢字・ひらがな・カタカナに制限
        const isValidChar = isDictionary
          ? /[\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]/.test(char)
          : true; // isDictionary=falseなら全文字許可

        if (isValidChar) {
          newContent[nextIndex] = char;
          nextIndex++;
        }
      }

      updateContent(newContent);
      setCursor(indexToPosition(Math.min(nextIndex, maxChars - 1)));
    }

    setIsIme(false);
    setImeText("");
    clearInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isIme) return;
    if (e.code === "Backspace") {
      e.preventDefault();
      handleBackSpace();
      clearInput();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\s/g, "");

    const currentIndex = getCurrentIndex();
    const newContent = [...content];
    let nextIndex = currentIndex;

    for (const char of text) {
      if (nextIndex >= maxChars) break;

      // isDictionaryがtrueの場合のみ漢字・ひらがな・カタカナに制限
      const isValidChar = isDictionary
        ? /[\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]/.test(char)
        : true; // isDictionary=falseなら全文字許可

      if (isValidChar) {
        newContent[nextIndex] = char;
        nextIndex++;
      }
    }

    updateContent(newContent);
    setCursor(indexToPosition(Math.min(nextIndex, maxChars)));
    clearInput();
  };

  const displayContent = [...content];
  if (isIme && imeText) {
    const currentIndex = getCurrentIndex();
    for (let i = 0; i < imeText.length && currentIndex + i < maxChars; i++) {
      displayContent[currentIndex + i] = imeText[i];
    }
  }

  return (
    <div
      style={{
        padding: "3vmin",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${cellSize * columnCount}px`,
          height: `${cellSize * lineLength}px`,
          backgroundColor: "transparent",
        }}
      >
        {Array.from({ length: lineLength * columnCount }).map((_, index) => {
          const yPos = index % lineLength;
          const xPos = Math.floor(index / lineLength);
          const cellIndex = positionToIndex(xPos, yPos);
          const hasChar = content[cellIndex] !== "";
          const isImeChar =
            isIme &&
            cellIndex >= getCurrentIndex() &&
            cellIndex < getCurrentIndex() + imeText.length;
          const whiteOYCarray = [
            whiteOYC.orange,
            whiteOYC.yellow,
            whiteOYC.cyan,
          ];
          const dynamicColor = hasChar
            ? "transparent"
            : isImeChar
              ? "rgba(255,255,255, 0.2)"
              : isDictionary
                ? "transparent"
                : whiteOYCarray[index % 3];
          const customBorder = hasChar
            ? "none"
            : isDictionary
              ? "1px solid black"
              : "none";
          return (
            <div
              key={index}
              className={cellIndex === 0 && !hasChar ? "cell-bounce" : ""}
              style={{
                position: "absolute",
                top: `${yPos * cellSize}px`,
                right: `${xPos * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                borderRadius: hasChar ? "0px" : "50%",
                background: hasChar
                  ? "transparent"
                  : `radial-gradient(circle, ${dynamicColor} 0%, #fff 90%)`,
                boxShadow: hasChar
                  ? "none"
                  : "0px 0px 20px rgba(255, 255, 255, 0.8)",
                border: customBorder,
              }}
            />
          );
        })}

        {displayContent.map((char, index) => {
          if (!char) return null;
          const pos = indexToPosition(index);
          const isConfirmedChar = content[index] !== "";

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                top: `${pos.yPos * cellSize}px`,
                right: `${pos.xPos * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                fontSize: `${cellSize * 0.6}px`,
                writingMode: "vertical-rl",
                zIndex: 10,
                color: "black",
                fontWeight: "bold",
                background: "transparent",
                textShadow: "0px 0px 10px rgba(255, 255, 255, 1.0)",
              }}
            >
              {char}
            </div>
          );
        })}

        <input
          ref={inputRef}
          style={{
            position: "absolute",
            top: `${cursor.yPos * cellSize}px`,
            right: `${cursor.xPos * cellSize}px`,
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            fontSize: `${cellSize * 0.6}px`,
            textAlign: "center",
            border: "none",
            borderRadius: "50%",
            backgroundColor: "transparent",
            writingMode: "vertical-rl",
            transform: "scale(1.05)",
            transformOrigin: "center",
            zIndex: 20,
            outline: "none",
            color: "transparent",
            caretColor: "transparent",
            opacity: getCurrentIndex() >= maxChars ? 0.5 : 1,
            // boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.8)",
          }}
          onPaste={handlePaste}
          onChange={handleChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          type="text"
          autoFocus
        />
      </div>
    </div>
  );
}
