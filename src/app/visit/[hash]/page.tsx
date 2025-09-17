"use client";
import { useEffect, useState, use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  /*
  ここで認証基盤を作る必要がある。なければuseRouter, routerで返す
  ここはvisit専用。
  */
  const [poem, setPoem] = useState<string | null>(null);
  const hash = use(params).hash;
  // const router = useRouter();

  useEffect(() => {
    const poem = sessionStorage.getItem(hash);
    if (poem) {
      setPoem(poem);
    }
  }, [hash]);

  return (
    <div className="center">
      <div>
        {hash}: {poem}
      </div>
    </div>
  );
}
