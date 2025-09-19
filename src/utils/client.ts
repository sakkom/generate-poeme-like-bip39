export async function getPoetry(): Promise<string> {
  try {
    const response = await fetch("/api/generate");

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const poetry = await response.text();
    return poetry;
  } catch (error) {
    console.error("API呼び出しエラー:", error);
    throw new Error("API呼び出しエラー");
  }
}
