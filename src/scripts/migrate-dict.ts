// import { db } from "./index";
// import { dictionaryTable } from "./schema";
// import { sql } from "drizzle-orm";

// async function clearDictionary() {
//   try {
//     await db.delete(dictionaryTable);
//     // または
//     // await db.execute(sql`TRUNCATE TABLE dictionary RESTART IDENTITY`);

//     console.log("Dictionary table cleared!");
//   } catch (error) {
//     console.error("Error clearing table:", error);
//   }
//   process.exit(0);
// }

// clearDictionary();

// import { db } from "./index";
// import { dictionaryTable, type InsertDictionary } from "./schema";
// import { SyllableIndexData } from "@/dict/jmdict-syllable-index";
// import { JMdicWord } from "@/interface/jmdic";

// async function migrateDictionary() {
//   console.log("Starting batched dictionary migration...");

//   for (const [syllables, words] of Object.entries(SyllableIndexData)) {
//     const allWords = words as JMdicWord[];
//     console.log(
//       `\nProcessing ${allWords.length} words for syllables ${syllables}`,
//     );

//     // 500件ずつバッチ処理
//     const BATCH_SIZE = 500;
//     let successCount = 0;

//     for (let i = 0; i < allWords.length; i += BATCH_SIZE) {
//       const batchWords = allWords.slice(i, i + BATCH_SIZE);
//       const batch: InsertDictionary[] = batchWords.map((word: JMdicWord) => ({
//         kana: word.kana,
//         kanji: word.kanji,
//         meaning: word.meaning,
//         syllables: parseInt(syllables),
//       }));

//       try {
//         await db.insert(dictionaryTable).values(batch);
//         successCount += batch.length;
//         process.stdout.write(
//           `\r  Progress: ${successCount}/${allWords.length} words`,
//         );
//       } catch (error) {
//         console.error(
//           `\n  Error in batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
//           error,
//         );
//       }

//       // データベース負荷軽減のため100ms待機
//       await new Promise((resolve) => setTimeout(resolve, 100));
//     }

//     console.log(
//       `\n  Completed syllables ${syllables}: ${successCount}/${allWords.length} words`,
//     );
//   }

//   console.log("\nDictionary migration completed!");
//   process.exit(0);
// }

// migrateDictionary();
