export const dynamic = "force-static";

export async function GET() {
  return new Response("e82fa9163b494191a34b22c74d812f90", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
