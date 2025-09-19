"use server";
import crypto from "crypto";
// import { JMdicWord } from "@/interface/jmdic";

export async function getPoetryHash(key: string) {
  const sha256 = crypto.createHash("sha256");
  sha256.update(key);
  const digest = sha256.digest("hex");
  return digest;
}
