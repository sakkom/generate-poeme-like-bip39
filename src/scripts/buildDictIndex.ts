import fs from "fs";
// import path from "path";
// import { parse } from "csv-parse/sync";
import { JMdictEntry, JMdicWord } from "@/scripts/jmdic";

const jmdictFile = JSON.parse(
  fs.readFileSync("./src/app/dict/jmdict-all-3.6.1.json", "utf-8"),
);
//"words": [ {"id":という構造のため
const jmdictData: JMdictEntry[] = jmdictFile.words || jmdictFile;

const joyoKanjiData = JSON.parse(
  fs.readFileSync("./src/app/dict/regular_use_utf8.json", "utf-8"),
);
const JOYO_KANJI = new Set(joyoKanjiData);

function countMora(kana: string): number {
  return kana.replace(/[ゃゅょっャュョッ]/g, "").length;
}

function isCommonKanji(kanjiText: string | null): boolean {
  if (!kanjiText) return true;
  for (const char of kanjiText) {
    // 漢字の場合のみ常用漢字チェック
    if (/[\u4e00-\u9faf]/.test(char)) {
      if (!JOYO_KANJI.has(char)) {
        return false;
      }
    }
  }
  return true;
}

function isValidForPoetry(kana: string, meaning: string): boolean {
  if (kana.length === 1 && /[ヽヾゝゞ]/.test(kana)) return false;
  if (meaning.includes("(") && meaning.includes(")")) return false;
  return true;
}

function createSyllableIndex(
  allData: JMdicWord[],
): Record<number, JMdicWord[]> {
  const index: Record<number, JMdicWord[]> = {};
  allData.forEach((word) => {
    //初期化
    if (!index[word.syllables]) {
      index[word.syllables] = [];
    }
    index[word.syllables].push(word);
  });
  return index;
}

// extractKanjiTexts関数も追加する必要があります
function extractAll(jmdict: JMdictEntry[]): JMdicWord[] {
  const results: JMdicWord[] = [];

  jmdict.forEach((entry) => {
    const meanings =
      entry.sense
        ?.find((s) => s.gloss?.some((g) => g.lang === "eng"))
        ?.gloss?.filter((g) => g.lang === "eng")
        ?.map((g) => g.text) || [];

    if (entry.kanji?.length > 0) {
      entry.kanji.forEach((k) => {
        if (!isCommonKanji(k.text)) {
          return;
        }

        entry.kana.forEach((ka) => {
          meanings.forEach((m) => {
            if (isValidForPoetry(ka.text, m)) {
              results.push({
                kanji: k.text,
                kana: ka.text,
                meaning: m,
                syllables: countMora(ka.text),
              });
            }
          });
        });
      });
    } else {
      // ひらがな・カタカナのみのエントリ
      entry.kana.forEach((ka) => {
        meanings.forEach((m) => {
          if (isValidForPoetry(ka.text, m)) {
            results.push({
              kanji: null,
              kana: ka.text,
              meaning: m,
              syllables: countMora(ka.text),
            });
          }
        });
      });
    }
  });

  return results;
}

// function main() {
//   const allData = extractAll(jmdictData);
//   const syllableIndex = createSyllableIndex(allData);
//   const outputPath = "./src/app/dict/jmdict-syllable-index.json";
//   fs.writeFileSync(outputPath, JSON.stringify(syllableIndex, null, 2), "utf-8");

//   console.log(`総データ数: ${allData.length}個`);
//   // 統計表示
//   Object.keys(syllableIndex)
//     .sort((a, b) => Number(a) - Number(b))
//     .forEach((syllables) => {
//       console.log(
//         `${syllables}音: ${syllableIndex[Number(syllables)].length}個`,
//       );
//     });
// }

/*常用漢字csv -> 常用漢字jsonの変換*/
// function convertJoyoKanjiCsvToJson() {
//   try {
//     // CSVファイルを読み込み
//     const csvFilePath = "./src/app/dict/regular_use_utf8.csv";
//     const csvData = fs.readFileSync(csvFilePath, "utf-8");

//     const records = parse(csvData, {
//       columns: false,
//       delimiter: ",",
//       quote: '"',
//       skip_empty_lines: true,
//     });

//     // 2列目から
//     const kanjiList: string[] = records.map((row) => row[1]);

//     console.log(`csvから${kanjiList.length} 字の常用漢字`);

//     // JSONファイルとして保存
//     const outputPath = "./src/app/dict/regular_use_utf8.json";
//     fs.writeFileSync(outputPath, JSON.stringify(kanjiList, null, 2), "utf-8");

//     console.log(`Done:常用漢字csv -> json: ${outputPath}`);

//     return kanjiList;
//   } catch (error) {
//     console.error("CSV変換エラー:", error);
//     return [];
//   }
// }
// const joyoKanjiList = convertJoyoKanjiCsvToJson();
// console.log(joyoKanjiList);
