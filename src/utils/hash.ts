"use server";
import { KanjiKanaMeaning } from "@/interface/dictInterface";
import crypto from "crypto";

/*new poem作成同期 */
export async function getPoemHash(poem: KanjiKanaMeaning[]) {
  let hashKey = "";
  poem.forEach((item) => {
    hashKey += item.kanji || item.kana;
  });
  return await getHash(hashKey);
}

export async function getHash(key: string) {
  const sha256 = crypto.createHash("sha256");
  sha256.update(key);
  const digest = sha256.digest("hex");
  return digest;
}
// 暗唱;
// 単焦点レンズ;
// 勘の良い;
// d1303133e31417b7e5c70e79e1d08c8635363ab0d6b6917e1ba9608129561a2e;
