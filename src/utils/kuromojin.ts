"use server";

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

export async function katakanaToHiragana(katakana: string): Promise<string> {
  return katakana.replace(/[\u30A1-\u30F6]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
}

export async function convertToKana(text: string): Promise<string> {
  if (!text) return "";

  try {
    console.log("Using @patdx/kuromoji:", text);

    const kuromoji = await import("@patdx/kuromoji");

    // CDNから辞書を読み込むカスタムローダー
    const myLoader = {
      async loadArrayBuffer(url: string): Promise<ArrayBufferLike> {
        // .gzを削除
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
    console.error("@patdx/kuromoji error:", error);
    return await simpleKanaConversion(text);
  }
}

export async function simpleKanaConversion(text: string): Promise<string> {
  let result = "";
  for (const char of text) {
    if (/[\u3040-\u309f]/.test(char)) {
      result += char;
    } else if (/[\u30a0-\u30ff]/.test(char)) {
      result += await katakanaToHiragana(char);
    } else {
      result += char;
    }
  }
  return result;
}

export async function isValidKana(str: string): Promise<boolean> {
  return /^[\u3040-\u309f\u30a0-\u30ff]*$/.test(str);
}

export async function isValidKanji(str: string): Promise<boolean> {
  return /^[\u4e00-\u9faf\u3040-\u309f\u30a0-\u30ff]*$/.test(str);
}
