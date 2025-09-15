import { generateMnemonic } from "../../utils/mnemonic";

export default async function Page() {
  const { words, binaryString, digest } = await generateMnemonic();
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ width: "20%", textAlign: "left" }}>
          <div>{words.join(" ")}</div>
          <br />
          <div>{binaryString}</div>
          <br />
          <div style={{ wordBreak: "break-all" }}>{digest}</div>
        </div>
      </div>
    </>
  );
}
