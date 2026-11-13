import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public", "llms.txt");
    const content = fs.readFileSync(filePath, "utf8");
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
      }
    });
  } catch (error) {
    return new Response("# Benefisto AI — Intelligent Shopping Assistant\nhttps://www.benefisto.com", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }
}
