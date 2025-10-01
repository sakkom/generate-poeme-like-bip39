export const CircularButtons = ({
  items,
  poetry,
  poetryLoading,
  isDrawerOpen,
}: {
  items: { text: string; onClick: () => void; showCondition?: boolean }[];
  poetry?: string;
  poetryLoading: boolean;
  isDrawerOpen: boolean;
}) => {
  const fontSize = 6; // 文字サイズも小さく
  const radius = 1; // 30 → 15に変更（半分のサイズ）
  const gap = 2;

  // 表示する項目のみフィルタリング
  const visibleItems = items.filter(
    (item) => item.showCondition === undefined || item.showCondition,
  );

  const totalChars = visibleItems.reduce(
    (sum, item) => sum + item.text.length,
    0,
  );
  const totalWithGaps = totalChars + visibleItems.length * gap;
  let currentPosition = 0;

  return (
    <div
      style={{
        position: "relative",
        width: `${radius * 2}vmin`,
        height: `${radius * 2}vmin`,
        animation: "rotate 60s linear infinite",
      }}
    >
      {visibleItems.map((item, itemIndex) => {
        return (
          <div key={item.text}>
            {item.text.split("").map((char, charIndex) => {
              const angle = (currentPosition / totalWithGaps) * 2 * Math.PI;
              const x = radius + Math.cos(angle - Math.PI / 2) * radius;
              const y = radius + Math.sin(angle - Math.PI / 2) * radius;
              currentPosition++;

              const wordDelay = itemIndex * 0.2;
              const charDelay = charIndex * 0.03;
              const totalDelay = wordDelay + charDelay;

              return (
                <button
                  key={`${item.text}-${charIndex}`}
                  onClick={item.onClick}
                  style={{
                    position: "absolute",
                    left: `${x}vmin`,
                    top: `${y}vmin`,
                    fontSize: `${fontSize}vmin`,
                    color: "black",
                    transform: `translate(-50%, -50%) rotate(${angle}rad)`,
                    cursor: "pointer",
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    font: "inherit",
                    opacity: 0,
                    animation: `fadeIn 1s ease-in forwards`,
                    animationDelay: `${totalDelay}s`,
                  }}
                >
                  {char}
                </button>
              );
            })}
            {itemIndex < visibleItems.length - 1 &&
              (() => {
                currentPosition += gap;
                return null;
              })()}
          </div>
        );
      })}
    </div>
  );
};
