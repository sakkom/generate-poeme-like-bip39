"use server";
import { JMdicWord } from "../scripts/jmdic";
import { SelectDictionary } from "@/db/schema";
import { getWordsByPattern } from "./database";

function generate17Pattern(): number[] {
  // const wordCount = Math.random() < 0.6 ? 2 : 3;
  // if (wordCount === 2) {
  //   const first = 5 + Math.floor(Math.random() * 8);
  //   return [first, 17 - first];
  // } else {
  //   const first = 3 + Math.floor(Math.random() * 6);
  //   const second = 3 + Math.floor(Math.random() * 8);
  //   return [first, second, 17 - first - second];
  // }
  const patterns = [
    // 頻度順に並べる（一般的なものを優先）
    [5, 7, 5], // 基本575
    [7, 5, 5], // 755（人気）
    [5, 5, 7], // 557（人気）
    [9, 8], // 98調
    [8, 9], // 89調
    [7, 7, 3], // 773
    [3, 7, 7], // 377
    [7, 3, 7], // 737
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
}

export async function generatePoetry(): Promise<string> {
  const pattern = generate17Pattern();
  const words: SelectDictionary[] = await getWordsByPattern(pattern);

  const groups = new Map();
  words.forEach((w) => {
    if (!groups.has(w.syllables)) groups.set(w.syllables, []);
    groups.get(w.syllables).push(w);
  });

  const result = [];
  let charCount = 0;

  for (const syllables of pattern) {
    const candidates = groups.get(syllables) || [];
    const valid = candidates.filter((w) => {
      const text = w.kanji || w.kana;
      return (
        charCount + text.length <= 20 &&
        (!w.kanji || w.kanji.length > 1) &&
        !result.some((used) => used.kana === w.kana)
      );
    });

    if (valid.length > 0) {
      const selected = valid[Math.floor(Math.random() * valid.length)];
      result.push(selected);
      charCount += (selected.kanji || selected.kana).length;
    } else {
      console.log(
        `No valid words found for ${syllables} syllables, retrying...`,
      );
    }
  }
  // console.log(
  //   `Generated pattern: [${pattern.join(", ")}] (total: ${pattern.reduce((a, b) => a + b, 0)})`,
  // );
  // 文字列として返す
  return result.length === pattern.length
    ? result.map((w) => w.kanji || w.kana).join("")
    : generatePoetry();
}
