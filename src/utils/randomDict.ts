// import fs from "fs";
import path from "path";
import { KanjiKanaMeaning } from "../interface/dictInterface";
import { SyllableIndexData } from "../../public/dict/jmdict-syllable-index";

// function loadDictJson() {
//   const filePath = path.join(process.cwd(), "dict", "dict.json");
//   const jsonString = fs.readFileSync(filePath, "utf8");
//   const data: DictWord[] = JSON.parse(jsonString);
//   return data;
// }

// const syllableIndexData: Record<number, KanjiKanaMeaning[]> = JSON.parse(
//   fs.readFileSync("./src/app/dict/jmdict-syllable-index.json", "utf-8"),
// );
const syllableIndexData: Record<number, KanjiKanaMeaning[]> =
  SyllableIndexData as Record<number, KanjiKanaMeaning[]>;

export function getRandomWords() {}

// console.log(getRandomWords());

// getSyllablesLevel();

/*  if (!(await isNewPoem(hash))) return console.log("Duplicate hash");をして作成したのをチェックして再起 */
export function generateConstrainedHaiku(): KanjiKanaMeaning[] {
  const results: KanjiKanaMeaning[] = [];
  const wordCounts = [2, 3];
  const targetWords = wordCounts[Math.floor(Math.random() * wordCounts.length)]; // 1、2、3のどれかをランダム選択
  let remaining = 17;

  for (
    let wordCount = 0;
    wordCount < targetWords && remaining > 0;
    wordCount++
  ) {
    let syllablesToSelect: number;

    if (targetWords === 1) {
      // 1単語で17音
      syllablesToSelect = 17;
    } else if (targetWords === 2) {
      // 2単語構成
      syllablesToSelect =
        wordCount === 0
          ? Math.floor(Math.random() * 6) + 6 // 6-11音
          : remaining; // 残り全部
    } else {
      // 3単語構成
      const remainingWords = targetWords - wordCount;
      const avgSyllables = Math.floor(remaining / remainingWords);
      const minSyllables = Math.max(3, avgSyllables - 2);
      const maxSyllables = Math.min(remaining, avgSyllables + 2);
      syllablesToSelect =
        Math.floor(Math.random() * (maxSyllables - minSyllables + 1)) +
        minSyllables;
    }

    const candidateWords = syllableIndexData[syllablesToSelect] || [];
    if (candidateWords.length === 0) {
      // 代替選択
      for (let s = 1; s <= remaining; s++) {
        if (syllableIndexData[s]?.length > 0) {
          syllablesToSelect = s;
          break;
        }
      }
    }

    const words = syllableIndexData[syllablesToSelect] || [];
    if (words.length === 0) break;

    const filteredWords = words.filter(
      (word) => !(word.kanji && word.kanji.length === 1),
    );

    const wordsToChoose = filteredWords.length > 0 ? filteredWords : words;
    const randomWord =
      wordsToChoose[Math.floor(Math.random() * wordsToChoose.length)];

    results.push(randomWord);
    remaining -= randomWord.syllables;
  }

  const wordsWithSpaces = results.map((w) => w.kanji || w.kana).join(" ");
  console.log(`${wordsWithSpaces}`);

  return results;
}
