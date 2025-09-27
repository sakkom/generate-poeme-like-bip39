"use server";
import crypto from "crypto";

export async function countMora(kana: string): Promise<number> {
  return kana.replace(/[ゃゅょっャュョッ]/g, "").length;
}

export async function getPoetryHash(key: string) {
  const sha256 = crypto.createHash("sha256");
  sha256.update(key);
  const digest = sha256.digest("hex");
  return digest;
}
