import fs from "node:fs";
import path from "node:path";

const out = path.resolve(process.cwd(), "..", "static", "dist", "index.html");
if (!fs.existsSync(out)) {
  console.error("Missing build output:", out);
  process.exit(1);
}
console.log("OK:", out);
