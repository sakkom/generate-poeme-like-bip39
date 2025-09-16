export default function Page({ params }: { params: { hash: string } }) {
  /*
  ここで認証基盤を作る必要がある。なければuseRouter, routerで返す
  ここはvisit専用。
  */
  const hash = params.hash;

  return <div>{hash}</div>;
}
