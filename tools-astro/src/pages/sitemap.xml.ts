const routes = [
  "/tools/",
  "/tools/base64-converter/",
  "/tools/hash-generator/",
  "/tools/json-formatter/",
  "/tools/calculators/",
  "/tools/markdown-editor/",
  "/tools/validators/",
  "/tools/estimators/",
  "/tools/online-linters/",
  "/tools/pipeline-simulator/",
  "/tools/log-viewer/",
];

export async function GET() {
  const lastmod = new Date().toISOString().split("T")[0];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `<url>
  <loc>https://huntermussel.com${route}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>${route === "/tools/" ? "1.0" : "0.8"}</priority>
</url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
