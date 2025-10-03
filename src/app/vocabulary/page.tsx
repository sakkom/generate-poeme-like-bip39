"use client";
import GridInput from "@/comps/GridInput";
import { useState, useEffect, useRef } from "react";
import { convertToKana, isValidKana, isValidKanji } from "@/utils/kuromojin";
import { countMora } from "@/utils/util";
import { saveCustomWord } from "@/utils/database";
import { useRouter } from "next/navigation";

export default function Page() {
  const [mainContent, setMainContent] = useState<string>("");
  const [kanaCorrection, setKanaCorrection] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDrawer, setIsDrawer] = useState<boolean>(false);
  const [buttonHeight, setButtonHeight] = useState(0);
  const buttonHeightRef = useRef<HTMLButtonElement>(null);
  const [moraCount, setMoraCount] = useState<number>(0);
  const router = useRouter();

  const handleRubi = () => {
    if (!mainContent) return;
    (async () => {
      try {
        setIsLoading(true);
        setIsDrawer(true);
        const result = await convertToKana(mainContent);
        setKanaCorrection(result);
        const count = await countMora(result);
        setMoraCount(count);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handleSubmit = async () => {
    if (!mainContent || !kanaCorrection) return;
    if (!(await isValidKana(kanaCorrection))) return;
    if (!(await isValidKanji(mainContent))) return;
    await saveCustomWord(mainContent, kanaCorrection, moraCount);
    router.push("/");
  };

  useEffect(() => {
    if (buttonHeightRef.current) {
      setButtonHeight(buttonHeightRef.current.getBoundingClientRect().height);
    }
  }, [isDrawer]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
        }}
      >
        <div style={{ position: "relative" }}>
          {isDrawer && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                zIndex: 99,
              }}
              onClick={() => setIsDrawer(false)}
            />
          )}

          <Drawer isOpen={isDrawer}>
            <div
              style={{
                color: "black",
                backgroundColor: "transparent",
                border: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                outline: "none",
                padding: "2vmin",
                zIndex: 101,
                // overflow: "scroll",
                // width: "100vw",
              }}
            >
              {isLoading ? "Loading..." : kanaCorrection}
            </div>
          </Drawer>

          <GridInput
            maxChars={12}
            lineLength={3}
            columnCount={4}
            cellSize={50}
            onUpdateContent={setMainContent}
            isDictionary={true}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <button
              ref={buttonHeightRef}
              style={{
                width: "200px",
                textAlign: "end",
                position: "absolute",
                bottom: `calc(-${buttonHeight}px - 1vmin)`,
                right: "0vmin",
                borderRadius: 0,
                border: "none",
                // color: moraCount > 17 ? "red" : "black",
                color: "black",
                zIndex: 100,
                paddingRight: "2vmin",
                fontWeight: isDrawer ? "bold" : "normal",
                animation:
                  isDrawer && !isLoading && moraCount < 17
                    ? "buttonFadeIn 1.5s steps(2) infinite"
                    : "none",
                // whiteSpace: "nowrap",
              }}
              onClick={isDrawer ? handleSubmit : handleRubi}
            >
              {!isDrawer
                ? `ルビ確認`
                : isLoading
                  ? "Loading..."
                  : moraCount > 17
                    ? `Error: 17音以内🙇`
                    : `${moraCount}音で確定`}
            </button>
            <div
              style={{
                height: 0,
                position: "absolute",
                borderTop: "1px solid black",
                right: "0",
                left: "50%",
                // bottom: "-5vmin",
                bottom: 0,
                width: "75%",
                zIndex: 100,
              }}
            />
            <div
              style={{
                height: "75%",
                position: "absolute",
                borderRight: "1px solid black",
                // right: "-5vmin",
                right: 0,
                top: "50%",
                bottom: "-10vmin",
                zIndex: 100,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

interface DrawerProps {
  isOpen: boolean;
  children: React.ReactNode;
}
const Drawer: React.FC<DrawerProps> = ({ isOpen, children }) => {
  const [drawerHeight, setDrawerHeight] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawerRef.current) {
      setDrawerHeight(drawerRef.current.getBoundingClientRect().height);
    }
  }, [children, isOpen]);

  return (
    <div
      ref={drawerRef}
      style={{
        height: "auto",
        width: "100%",
        position: "absolute",
        top: `-${drawerHeight}px`,
        right: 0,
        transform: isOpen ? "translateX(0)" : "translateX(calc(-100vw - 100%))",
        transition: "transform 0.1s steps(3, end)",
        // backgroundColor: "rgba(255, 255, 255, 0.5)",
        // background: `linear-gradient(to bottom,
        //   ${whiteOYC.orange} 0%,
        //   ${whiteOYC.yellow} ${middleStop}%,
        //   ${whiteOYC.cyan} 100%
        // )`,
        // borderRadius: " 0 0 5vmin 5vmin",
        color: "black",
        zIndex: 100,
        willChange: "transform",
        wordBreak: "break-all",
      }}
    >
      <div
        style={{
          position: "absolute",
          // bottom: "5vmin",
          bottom: 0,
          right: "0",
          height: 0,
          width: "125%",
          borderBottom: "1px solid #000",
        }}
      />
      <div
        style={{
          position: "absolute",
          // left: "-5vmin",
          left: 0,
          top: 0,
          bottom: `-${drawerHeight}px`,
          width: 0,
          borderLeft: "1px solid #000",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};
