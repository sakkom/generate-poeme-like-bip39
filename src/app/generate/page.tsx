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
  handleGeneratePoetry: () => Promise<void>;
  handleRegisterPoetry: () => Promise<void>;
  poetryLoading: boolean;
}

// const GeneratePage = ({
//   poetry,
//   handleGeneratePoetry,
//   handleRegisterPoetry,
//   poetryLoading,
// }: GeneratePageProps) => {
//   return (
//     <>
//       <div style={{ width: "80%", height: "90dvh" }} className="center">
//         <div
//           style={{
//             writingMode: "vertical-rl",
//             display: "flex",
//             flexDirection: "row",
//             flexWrap: "wrap",
//           }}
//         >
//           {poetry?.split("").map((char, i) => {
//             return (
//               <div
//                 className="poetry"
//                 key={`${poetry}-${i}`}
//                 style={{
//                   opacity: 0,
//                   transform: `${i % 2 == 0 ? `translateX(1rem) translateY(-1rem) rotate(-360deg)` : `translateX(-1rem) translateY(-1rem) rotate(360deg)`}`,
//                   animation:
//                     i % 2 == 0
//                       ? `eastSide 0.25s ease-in ${i * 0.05}s forwards`
//                       : `westSide 0.25s ease-in ${i * 0.05}s forwards`,
//                 }}
//               >
//                 {char}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <div
//         style={{
//           position: "absolute",
//           top: "60%",
//           left: "30%",
//           transform: "translate(0%, -100%)",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       ></div>
//       <div
//         style={{
//           position: "absolute",
//           top: "100%",
//           right: "30%",
//           transform: "translate(0%, -100%)",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       ></div>
//       <div>
//         <button
//           onClick={handleGeneratePoetry}
//           className="button"
//           style={{
//             position: "absolute",
//             bottom: "0vmin",
//             left: "0vmin",
//             width: "16vmin",
//             height: "16vmin",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "50%",
//             backgroundColor: "white",
//             textDecoration: "none",
//             color: "black",
//           }}
//         >
//           生成
//         </button>

//         {poetry && (
//           <button
//             className="button"
//             style={{
//               position: "absolute",
//               bottom: "calc(8vmin + 16vmin * sin(45deg) - 8vmin)",
//               left: "calc(8vmin + 16vmin * cos(45deg) - 8vmin)",
//               width: "16vmin",
//               height: "16vmin",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               borderRadius: "50%",
//               backgroundColor: "white",
//               textDecoration: "none",
//               color: "black",
//             }}
//           >
//             オープンで公開
//           </button>
//         )}
//         <button
//           className="button"
//           style={{
//             position: "absolute",
//             bottom: "calc(8vmin + 16vmin * sin(45deg) - 8vmin)",
//             left: "calc(8vmin + 16vmin * cos(45deg) - 8vmin)",
//             width: "16vmin",
//             height: "16vmin",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "50%",
//             backgroundColor: "white",
//             textDecoration: "none",
//             color: "black",
//           }}
//         >
//           プライベートで登録
//         </button>

//         <button
//           className="button"
//           style={{
//             position: "absolute",
//             // 2個目の位置 + 2個目からの120度方向移動
//             bottom:
//               "calc((8vmin + 16vmin * sin(45deg)) + 16vmin * sin(120deg) - 8vmin)",
//             left: "calc((8vmin + 16vmin * cos(45deg)) + 16vmin * cos(120deg) - 8vmin)",
//             width: "16vmin",
//             height: "16vmin",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: "50%",
//             backgroundColor: "white",
//             textDecoration: "none",
//             color: "black",
//           }}
//         >
//           オープンで公開
//         </button>
//       </div>
//     </>
//   );
// };
const GeneratePage = ({
  poetry,
  handleGeneratePoetry,
  handleRegisterPoetry,
  poetryLoading, // 追加
}: GeneratePageProps) => {
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
                      ? `eastSide 0.25s ease-in ${i * 0.05}s forwards`
                      : `westSide 0.25s ease-in ${i * 0.05}s forwards`,
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
            bottom: "0vmin",
            left: "0vmin",
            width: "16vmin",
            height: "16vmin",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            //
            backgroundColor: poetryLoading ? "black" : "white",
            textDecoration: "none",
            color: poetryLoading ? "white" : "black",
            opacity: poetryLoading ? 0.6 : 1,
          }}
        >
          {poetryLoading ? "生成中..." : "生成"}
        </button>

        {poetry && !poetryLoading && (
          <>
            <button
              onClick={handleRegisterPoetry}
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
                backgroundColor: "black",
                textDecoration: "none",
                color: "white",
                border: "1px dotted white",
              }}
            >
              プライベートで登録
            </button>

            <button
              className="button"
              style={{
                position: "absolute",
                bottom:
                  "calc((8vmin + 16vmin * sin(45deg)) + 16vmin * sin(120deg) - 8vmin)",
                left: "calc((8vmin + 16vmin * cos(45deg)) + 16vmin * cos(120deg) - 8vmin)",
                width: "16vmin",
                height: "16vmin",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                backgroundColor: "black",
                textDecoration: "none",
                color: "white",
                border: "1px dotted white",
              }}
            >
              オープンで公開
            </button>
          </>
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
  return (
    <>
      <div style={{ width: "80%", height: "90vh" }} className="center">
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
      </div>
    </>
  );
};
