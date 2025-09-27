"use server";
import { db } from "@/db";
import {
  hashsTable,
  dictionaryTable,
  SelectDictionary,
  InsertCustomDictionary,
  customDictionaryTable,
} from "@/db/schema";
import { sql, inArray, eq, asc } from "drizzle-orm";
import { countMora } from "./util";

/*utils------------------------------------------------------------------------------------------------------ */
export async function hasHash(hash: string) {
  try {
    const results = await db
      .select()
      .from(hashsTable)
      .where(eq(hashsTable.hash, hash));
    return results.length > 0;
  } catch (error) {
    throw new Error(`同一ハッシュセレクト中のエラー ${error}`);
  }
}

/*生成用------------------------------------------------------------------------------------------------------ */
export async function getWordsByPattern(
  pattern: number[],
): Promise<SelectDictionary[]> {
  try {
    return await db
      .select()
      .from(dictionaryTable)
      .where(inArray(dictionaryTable.syllables, pattern))
      .orderBy(sql`RANDOM()`)
      .limit(200);
  } catch (err) {
    throw new Error("ランダムワード取得エラー", err);
  }
}

export async function savePrivatePoetry(hash: string) {
  if (await hasHash(hash)) throw new Error("この詩はすでにあります");
  try {
    const [result] = await db
      .insert(hashsTable)
      .values({
        hash,
      })
      .returning();
    return result.hash;
  } catch (error) {
    throw new Error(`PrivateHashインサートエラー: ${error}`);
  }
}

export async function savePublicPoetry(hash: string, poetry: string) {
  if (await hasHash(hash)) throw new Error("この詩はすでにあります");
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
    throw new Error(`PublicPoetryインサートエラー: ${error}`);
  }
}

/*Publicな詩公開ページ-------------------------------------------------------------------------------------------- */
export async function getPoetriesWindow(
  startIndex: number = 0,
  windowSize: number = 50,
) {
  const results = await db
    .select({ poetry: hashsTable.poetry, hash: hashsTable.hash })
    .from(hashsTable)
    .where(eq(hashsTable.opened, true))
    .orderBy(asc(hashsTable.id))
    .limit(windowSize)
    .offset(startIndex);
  return { poetries: results };
}

/*みんなの辞書------------------------------------------------------------------------------------------------------ */
export async function saveCustomWord(kanji: string, kana: string) {
  const syllables = await countMora(kana);
  try {
    const [result] = await db
      .insert(customDictionaryTable)
      .values({ kanji, kana, syllables })
      .returning();
    console.log("save custom word", result);
  } catch (err) {
    throw new Error("Custom dictionary save error", err);
  }
}

saveCustomWord("kickout", "きっくあうと");
