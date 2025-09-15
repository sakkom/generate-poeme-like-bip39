import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import {JMdictEntry, KanjiKanaMeaning} from "../interface/dictInterface";

function countMora(kana: string): number {
  return kana.replace(/[ゃゅょっャュョッ]/g, "").length;
}

const jmdictFile = JSON.parse(
  fs.readFileSync("./src/app/dict/jmdict-all-3.6.1.json", "utf-8"),
);

console.log("ファイル全体の型:", typeof jmdictFile);
console.log("ファイル全体は配列か:", Array.isArray(jmdictFile));
console.log("ファイルのキー:", Object.keys(jmdictFile));

// 実際の単語データを取得
const jmdictData: JMdictEntry[] = jmdictFile.words || jmdictFile;

console.log("単語データの型:", typeof jmdictData);
console.log("単語データは配列か:", Array.isArray(jmdictData));
console.log("単語数:", jmdictData.length);

const joyoKanjiData = JSON.parse(
  fs.readFileSync("./src/app/dict/regular_use_utf8.json", "utf-8"),
);
const JOYO_KANJI = new Set(joyoKanjiData);

function isCommonKanji(kanjiText: string | null): boolean {
  if (!kanjiText) return true; // ひらがな・カタカナのみの場合はOK

  // すべての文字をチェック
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
  // 繰り返し記号を除外
  if (kana.length === 1 && /[ヽヾゝゞ]/.test(kana)) return false;

  // 説明的な意味（括弧付き）を除外
  if (meaning.includes("(") && meaning.includes(")")) return false;

  return true;
}

function createSyllableIndex(
  allData: KanjiKanaMeaning[],
): Record<number, KanjiKanaMeaning[]> {
  const index: Record<number, KanjiKanaMeaning[]> = {};

  allData.forEach((word) => {
    if (!index[word.syllables]) {
      index[word.syllables] = [];
    }
    index[word.syllables].push(word);
  });

  return index;
}

// extractKanjiTexts関数も追加する必要があります
function extractAll(jmdict: JMdictEntry[]): KanjiKanaMeaning[] {
  const results: KanjiKanaMeaning[] = [];
  let totalKanjiEntries = 0; // 漢字を持つエントリ数
  let joyoFiltered = 0; // 常用漢字外で除外された数
  let finalAdded = 0; // 最終的に追加された数

  jmdict.forEach((entry) => {
    const meanings =
      entry.sense
        ?.find((s) => s.gloss?.some((g) => g.lang === "eng"))
        ?.gloss?.filter((g) => g.lang === "eng")
        ?.map((g) => g.text) || [];

    if (entry.kanji?.length > 0) {
      entry.kanji.forEach((k) => {
        totalKanjiEntries++; // 漢字エントリをカウント

        if (!isCommonKanji(k.text)) {
          joyoFiltered++; // 常用漢字外除外をカウント
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
              finalAdded++; // 追加された数をカウント
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
            finalAdded++; // 追加された数をカウント
          }
        });
      });
    }
  });

  // ログ出力
  console.log(`=== 常用漢字フィルタリング結果 ===`);
  console.log(`漢字エントリ総数: ${totalKanjiEntries}個`);
  console.log(`常用漢字外除外: ${joyoFiltered}個`);
  console.log(`最終結果数: ${results.length}個`);
  console.log(
    `常用漢字通過率: ${(((totalKanjiEntries - joyoFiltered) / totalKanjiEntries) * 100).toFixed(1)}%`,
  );

  return results;
}

const allData = extractAll(jmdictData);
const syllableIndex = createSyllableIndex(allData);
const outputPath = "./src/app/dict/jmdict-syllable-index.json";
fs.writeFileSync(outputPath, JSON.stringify(syllableIndex, null, 2), "utf-8");

// console.log(`総データ数: ${allData.length}個`);

// ランダムで10個選択して検査
// function getRandomSample(array: any[], count: number) {
//   const shuffled = [...array].sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }

// const randomSamples = getRandomSample(allData, 10); // allDataを使用
// console.log("\nランダム検査（10個）:");
// randomSamples.forEach((item, index) => {
//   console.log(
//     `${index + 1}. 漢字:「${item.kanji}」 読み:「${item.kana}」 意味:「${item.meaning}」 音数:${item.syllables}`,
//   );
// });

// 統計表示
Object.keys(syllableIndex)
  .sort((a, b) => Number(a) - Number(b))
  .forEach((syllables) => {
    console.log(`${syllables}音: ${syllableIndex[Number(syllables)].length}個`);
  });

/*常用漢字スクレイプ */
// function convertJoyoKanjiCsvToJson() {
//   try {
//     // CSVファイルを読み込み
//     const csvFilePath = "./src/app/dict/regular_use_utf8.csv";
//     const csvData = fs.readFileSync(csvFilePath, "utf-8");

//     // CSVをパース（ヘッダーなしとして処理）
//     const records = parse(csvData, {
//       columns: false, // ヘッダーなし
//       delimiter: ",",
//       quote: '"',
//       skip_empty_lines: true,
//     });

//     // 2列目（インデックス1）から漢字を抽出
//     const kanjiList: string[] = records
//       .map((row) => row[1]) // 2列目を取得
//       .filter((kanji) => kanji && /^[\u4e00-\u9faf]$/.test(kanji)) // 単一漢字のみ
//       .sort();

//     // 重複除去
//     const uniqueKanjiList = [...new Set(kanjiList)];

//     console.log(`CSV から ${uniqueKanjiList.length} 字の常用漢字を抽出`);
//     console.log("最初の20字:", uniqueKanjiList.slice(0, 20).join(""));
//     console.log("最後の20字:", uniqueKanjiList.slice(-20).join(""));

//     // JSONファイルとして保存
//     const outputPath = "./src/app/dict/regular_use_utf8.json";
//     fs.writeFileSync(
//       outputPath,
//       JSON.stringify(uniqueKanjiList, null, 2),
//       "utf-8",
//     );

//     console.log(`常用漢字リスト保存完了: ${outputPath}`);

//     return uniqueKanjiList;
//   } catch (error) {
//     console.error("CSV変換エラー:", error);
//     return [];
//   }
// }

// // 実行
// const joyoKanjiList = convertJoyoKanjiCsvToJson();
// console.log(joyoKanjiList);
