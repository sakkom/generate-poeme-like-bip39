"use server";

import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { hashsTable } from "../db/schema";

export async function createPoem(hash: string) {
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
