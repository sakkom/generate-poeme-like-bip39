"use server";

import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { hashsTable } from "../db/schema";
import { exportTraceState } from "next/dist/trace";
import { generatePoetry } from "./generate";
import { getPoetryHash } from "./util";

/*このときに辞書に組み込む機能をつける */
export async function createPrivatePoetry(hash: string) {
  if (!(await isNewPoem(hash))) throw new Error("この詩はすでにあります");

  try {
    const [result] = await db
      .insert(hashsTable)
      .values({
        hash,
      })
      .returning();
    return result.hash;
  } catch (error) {
    throw new Error(`データベースインサート失敗: ${error}`);
  }
}

export async function createPublicPoetry(hash: string, poetry: string) {
  if (!(await isNewPoem(hash))) throw new Error("この詩はすでにあります");

  try {
    const [result] = await db
      .insert(hashsTable)
      .values({
        hash,
        poetry,
        opened: true,
      })
      .returning();
    return result.hash;
  } catch (error) {
    throw new Error(`(Public)データベースインサート失敗: ${error}`);
  }
}

export async function isNewPoem(hash: string) {
  try {
    const results = await db
      .select()
      .from(hashsTable)
      .where(eq(hashsTable.hash, hash));
    return results.length === 0;
  } catch (error) {
    throw new Error(`データベース検索失敗: ${error}`);
  }
}

export async function matchHash(hash: string) {
  try {
    const results = await db
      .select()
      .from(hashsTable)
      .where(eq(hashsTable.hash, hash));
    return results.length > 0;
  } catch (error) {
    throw new Error(`データベース検索失敗: ${error}`);
  }
}

// export async function createBulkPoetries() {
//   let successCount = 0;
//   let errorCount = 0;
//   for (let i = 0; i < 5000; i++) {
//     try {
//       const poetry = await generatePoetry(); // 直接関数を呼び出し
//       const hash = await getPoetryHash(poetry);

//       if (await isNewPoem(hash)) {
//         await createPublicPoetry(hash, poetry);
//         successCount++;
//         console.log(`${i + 1}/5000: 作成成功 - ${successCount}件`);
//       } else {
//         console.log(`${i + 1}/5000: スキップ（重複）`);
//       }
//     } catch (error) {
//       errorCount++;
//       console.error(`${i + 1}/5000: エラー`, error);
//     }

//     if ((i + 1) % 100 === 0) {
//       console.log(
//         `進捗: ${i + 1}/5000 (成功: ${successCount}, エラー: ${errorCount})`,
//       );
//     }
//   }
//   return { successCount, errorCount };
// }

// createBulkPoetries();
