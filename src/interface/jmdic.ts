export interface JMdicWord {
  kanji: string | null;
  kana: string;
  meaning: string;
  syllables: number;
}

export interface JMdictEntry {
  id: string;
  kanji: Array<{
    common: boolean;
    text: string;
    tags: string[];
  }>;
  kana: Array<{
    common: boolean;
    text: string;
    tags: string[];
    appliesToKanji: string[];
  }>;
  sense: Array<{
    partOfSpeech: string[];
    appliesToKanji: string[];
    appliesToKana: string[];
    related: string[][];
    antonym: string[][];
    field: string[];
    dialect: string[];
    misc: string[];
    info: string[];
    languageSource: any[];
    gloss: Array<{
      lang: string;
      gender: string | null;
      type: string | null;
      text: string;
    }>;
  }>;
}
