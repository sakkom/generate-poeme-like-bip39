interface PoetryCharProps {
  char: string;
  index: number;
}

export const PoetryChar = ({ char, index }: PoetryCharProps) => {
  return (
    <h1
      className="poetry"
      style={{
        opacity: 0,
        transform: `${index % 2 == 0 ? `translateX(1rem) translateY(-1rem) rotate(-360deg)` : `translateX(-1rem) translateY(-1rem) rotate(360deg)`}`,
        animation:
          index % 2 == 0
            ? `eastSide 0.5s ease-in ${index * 0.05}s forwards`
            : `westSide 0.5s ease-in ${index * 0.05}s forwards`,
        textShadow: "0 0 10px rgba(255, 255, 255, 1.0)",
        // zIndex: 100,
      }}
    >
      {char}
    </h1>
  );
};
