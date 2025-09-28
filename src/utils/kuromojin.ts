"use server";
import * as kuromoji from "@patdx/kuromoji";

interface Token {
  word_id: number;
  word_type: string;
  word_position: number;
  surface_form: string;
  pos: string;
  pos_detail_1: string;
  pos_detail_2: string;
  pos_detail_3: string;
  conjugated_type: string;
  conjugated_form: string;
  basic_form: string;
  reading?: string;
  pronunciation?: string;
}

//readingがカタカナのため
export async function katakanaToHiragana(katakana: string): Promise<string> {
  return katakana.replace(/[\u30A1-\u30F6]/g, function (char) {
    const kanakanaCode = char.charCodeAt(0);
    const hiraganaCode = kanakanaCode - 0x60;
    return String.fromCharCode(hiraganaCode);
  });
}

async function setTokenizer() {
  const myLoader: kuromoji.LoaderConfig = {
    async loadArrayBuffer(url: string): Promise<ArrayBufferLike> {
      // strip off .gz
      url = url.replace(".gz", "");
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/@aiktb/kuromoji@1.0.2/dict/" + url,
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}, status: ${res.status}`);
      }
      return res.arrayBuffer();
    },
  };

  const tokenizer = await new kuromoji.TokenizerBuilder({
    loader: myLoader,
  }).build();

  return tokenizer;
}

export async function convertToKana(text: string): Promise<string> {
  if (!text) return "";

  try {
    const tokenizer = await setTokenizer();

    const tokens = tokenizer.tokenize(text) as Token[];
    console.log("Tokens:", tokens);

    let result = "";
    for (const token of tokens) {
      if (token.reading) {
        const hiragana = await katakanaToHiragana(token.reading);
        result += hiragana;
      } else {
        result += token.surface_form;
      }
    }

    return result;
  } catch (error) {
    throw new Error("@patdx/kuromoji error:", error);
  }
}

export async function isValidKana(str: string): Promise<boolean> {
  return /^[\u3040-\u309f\u30a0-\u30ff]*$/.test(str);
}

export async function isValidKanji(str: string): Promise<boolean> {
  return /^[\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]*$/.test(str);
}
