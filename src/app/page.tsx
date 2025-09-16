import Link from "next/link";

export default function Home() {
  return (
    <div className="center">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link href={"/about"}>about</Link>
        <Link href={"/generate"}>JMDICT 17音自由詩生成機</Link>
        <Link href={"/visit"}>インターネット上の詩に訪れる</Link>
        <Link href={"/open"}>生成公開された詩たち</Link>
        <Link href={"/create"}>オリジナル辞書作成中</Link>
      </div>
    </div>
  );
}
