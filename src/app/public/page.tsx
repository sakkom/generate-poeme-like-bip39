"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Background } from "@/comps/Background";
import { getPoetriesWindow } from "@/utils/database";

export default function Page() {
  const parentRef = useRef<HTMLDivElement>(null);
  const ITEM_WIDTH = 150;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["poetries-infinite"],
      queryFn: ({ pageParam = 0 }) => {
        console.log("取得開始位置:", pageParam);
        return getPoetriesWindow(pageParam, 30);
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (lastPage.poetries.length < 30) return undefined;
        return lastPageParam + 30;
      },
    });

  const allItems = data?.pages.flatMap((page) => page.poetries) ?? [];

  // TanStack Virtualを使用して水平仮想化
  const virtualizer = useVirtualizer({
    count: hasNextPage ? allItems.length + 1 : allItems.length, // ローディングアイテムのために+1
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_WIDTH,
    horizontal: true, // 水平スクロール
    overscan: 0, // 可視範囲外の前後5アイテムもレンダリング
  });

  // ESLint警告を修正：複雑な式を変数に抽出
  const virtualItems = virtualizer.getVirtualItems();

  // 無限スクロールのロジック
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allItems.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allItems.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  if (status === "pending") return <div>読み込み中...</div>;
  if (status === "error") return <div>エラーが発生しました</div>;

  return (
    <div className="center">
      <div
        ref={parentRef}
        style={{
          position: "relative",
          height: "80dvh",
          width: "90%",
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarColor: "black",
        }}
      >
        <div
          style={{
            width: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualItems.map((virtualItem) => {
            const isLoaderItem = virtualItem.index > allItems.length - 1;
            const poetry = allItems[virtualItem.index];

            if (isLoaderItem) {
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${virtualItem.start}px`,
                    width: `${virtualItem.size}px`,
                    height: "90dvh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    writingMode: "vertical-rl",
                    color: "#ffaa99",
                    fontSize: "1rem",
                  }}
                >
                  {hasNextPage ? "Loading..." : ""}
                </div>
              );
            }

            // 90s スタイルのチェックを削除
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${virtualItem.start}px`,
                  width: `${virtualItem.size}px`,
                  height: "100dvh",
                  writingMode: "vertical-rl",
                  // padding: "20px",
                  background: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  whiteSpace: "nowrap",
                  fontSize: "1.2rem",
                  // paddingTop: "20px",
                }}
              >
                <div
                  style={{
                    writingMode: "vertical-rl",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {poetry.poetry}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
