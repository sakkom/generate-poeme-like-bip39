import { JMdicWord } from "../interface/jmdic";
import { db } from "@/db";
import { dictionaryTable } from "@/db/schema";
import { sql, inArray } from "drizzle-orm";

function generate17Pattern(): number[] {
  const wordCount = Math.random() < 0.6 ? 2 : 3;
  if (wordCount === 2) {
    const first = 5 + Math.floor(Math.random() * 8);
    return [first, 17 - first];
  } else {
    const first = 3 + Math.floor(Math.random() * 6);
    const second = 3 + Math.floor(Math.random() * 8);
    return [first, second, 17 - first - second];
  }
}

export async function generatePoetry(): Promise<string> {
  const pattern = generate17Pattern();
  const words = await db
    .select()
    .from(dictionaryTable)
    .where(inArray(dictionaryTable.syllables, pattern))
    .orderBy(sql`RANDOM()`)
    .limit(100);

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
    }
  }

  // 文字列として返す
  return result.length === pattern.length
    ? result.map((w) => w.kanji || w.kana).join("")
    : generatePoetry();
}
