// import { SyllableIndexData } from "@/dict/jmdict-syllable-index";
// import { KanjiKanaMeaning } from "../interface/dictInterface";

// function matchDictionary(poem: string) {
//   const wordMap = new Map<string, KanjiKanaMeaning>();

//   // 辞書作成 - 生成側と同じ型を使用
//   Object.values(
//     SyllableIndexData as Record<string, KanjiKanaMeaning[]>,
//   ).forEach((wordArray) => {
//     wordArray.forEach((wordData) => {
//       const word = wordData.kanji || wordData.kana;
//       wordMap.set(word, wordData);
//     });
//   });

//   const allWords = Array.from(wordMap.keys());
//   const results = [];

//   // 2語での分割
//   for (const word1 of allWords) {
//     if (poem.startsWith(word1)) {
//       const word2 = poem.slice(word1.length);
//       if (wordMap.has(word2)) {
//         const word1Data = wordMap.get(word1)!;
//         const word2Data = wordMap.get(word2)!;
//         const totalSyllables = word1Data.syllables + word2Data.syllables;

//         if (totalSyllables === 17) {
//           results.push({
//             type: "2words",
//             words: [word1, word2],
//             data: [word1Data, word2Data],
//             syllables: [word1Data.syllables, word2Data.syllables],
//             totalSyllables: totalSyllables,
//           });
//         }
//       }
//     }
//   }

//   // 3語での分割
//   for (const word1 of allWords) {
//     if (poem.startsWith(word1)) {
//       const afterWord1 = poem.slice(word1.length);
//       for (const word2 of allWords) {
//         if (afterWord1.startsWith(word2)) {
//           const word3 = afterWord1.slice(word2.length);
//           if (wordMap.has(word3)) {
//             const word1Data = wordMap.get(word1)!;
//             const word2Data = wordMap.get(word2)!;
//             const word3Data = wordMap.get(word3)!;
//             const totalSyllables =
//               word1Data.syllables + word2Data.syllables + word3Data.syllables;

//             if (totalSyllables === 17) {
//               results.push({
//                 type: "3words",
//                 words: [word1, word2, word3],
//                 data: [word1Data, word2Data, word3Data],
//                 syllables: [
//                   word1Data.syllables,
//                   word2Data.syllables,
//                   word3Data.syllables,
//                 ],
//                 totalSyllables: totalSyllables,
//               });
//             }
//           }
//         }
//       }
//     }
//   }

//   return results;
// }

// console.log(matchDictionary("射精コピー・プロテクト刺し通す"));
