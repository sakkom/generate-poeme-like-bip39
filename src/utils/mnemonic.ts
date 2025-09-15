"use server";
import { KanjiKanaMeaning } from "@/interface/dictInterface";
import crypto from "crypto";

export async function generateMnemonic() {
  const mnemonic = ["今日", "読む", "トマト", "嘘", "ture", "真っ赤"];
  const words: string[] = [];
  const mnemonicIndex: { [key: string]: number } = {};
  let binaryString = "";

  mnemonic.forEach((word: string, index) => {
    mnemonicIndex[word] = index;
  });

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * mnemonic.length);
    const word = mnemonic[randomIndex];
    words.push(word);
    const binaryWord = mnemonicIndex[word].toString(2).padStart(11, "0");
    console.log(binaryWord);
    binaryString += binaryWord;
  }

  const sha512 = crypto.createHash("sha512");
  sha512.update(binaryString);
  const digest = sha512.digest("hex");

  console.log(words);
  console.log(binaryString);
  console.log(digest);

  return { words, binaryString, digest };
}

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
