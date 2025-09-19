import { generatePoetry } from "@/utils/generate";

export async function GET() {
  try {
    const poetry = await generatePoetry();
    return new Response(poetry, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    return new Response("エラー", { status: 500 });
  }
}
