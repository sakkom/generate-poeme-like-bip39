"use server";
import { KanjiKanaMeaning } from "@/interface/dictInterface";
import crypto from "crypto";

/*new poem作成同期 */
export async function getPoemHash(poem: KanjiKanaMeaning[]) {
  let hashKey = "";
  poem.forEach((item) => {
    hashKey += item.kanji;
  });
  const sha256 = crypto.createHash("sha256");
  sha256.update(hashKey);
  const digest = sha256.digest("hex");
  return digest;
}
