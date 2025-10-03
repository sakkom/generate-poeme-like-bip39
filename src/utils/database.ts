"use server";
import { db } from "@/db";
import {
  hashTable,
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
      .from(hashTable)
      .where(eq(hashTable.hash, hash));
    return results.length > 0;
  } catch (error) {
    throw new Error(`同一ハッシュセレクト中のエラー ${error}`);
  }
}

/*生成用------------------------------------------------------------------------------------------------------ */

type WordResult = {
  id: number;
  createdAt: Date;
  kana: string;
  kanji: string;
  syllables: number;
  meaning?: string;
};
export async function getWordsByPattern(
  dictMode: number,
  pattern: number[],
): Promise<WordResult[]> {
  try {
    if (dictMode === 0) {
      return await db
        .select()
        .from(dictionaryTable)
        .where(inArray(dictionaryTable.syllables, pattern))
        .orderBy(sql`RANDOM()`)
        .limit(200);
    } else {
      return await db
        .select()
        .from(customDictionaryTable)
        .where(inArray(customDictionaryTable.syllables, pattern))
        .orderBy(sql`RANDOM()`)
        .limit(200);
    }
  } catch (err) {
    throw new Error("ランダムワード取得エラー", err);
  }
}

export async function savePrivatePoetry(hash: string) {
  if (await hasHash(hash)) throw new Error("この詩はすでにあります");
  try {
    const [result] = await db
      .insert(hashTable)
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
      .insert(hashTable)
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
    .select({ poetry: hashTable.poetry, hash: hashTable.hash })
    .from(hashTable)
    .where(eq(hashTable.opened, true))
    .orderBy(asc(hashTable.id))
    .limit(windowSize)
    .offset(startIndex);
  return { poetries: results };
}

/*みんなの辞書------------------------------------------------------------------------------------------------------ */
export async function hasCustomWord(kanji: string) {
  try {
    const results = await db
      .select()
      .from(customDictionaryTable)
      .where(eq(customDictionaryTable.kanji, kanji));
    return results.length > 0;
  } catch (error) {
    throw new Error(`同一ハッシュセレクト中のエラー ${error}`);
  }
}
export async function saveCustomWord(
  kanji: string,
  kana: string,
  syllables: number,
) {
  try {
    const exsits = await hasCustomWord(kanji);
    if (!exsits) {
      await db
        .insert(customDictionaryTable)
        .values({ kanji, kana, syllables })
        .returning();
    }
  } catch (err) {
    throw new Error("Custom dictionary save error", err);
  }
}

// saveCustomWord("kickout", "きっくあうと");
