// Génère les types de la base dans src/lib/supabase/database.types.ts.
// Usage : npm run db:types (lit DATABASE_URL dans .env.local ou .env).
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const OUTPUT = "src/lib/supabase/database.types.ts";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL est manquant dans .env.local ou .env.");
  process.exit(1);
}

const result = spawnSync(
  "npx",
  [
    "supabase",
    "gen",
    "types",
    "typescript",
    "--db-url",
    process.env.DATABASE_URL,
    "--schema",
    "public",
  ],
  { encoding: "utf8", shell: process.platform === "win32" },
);

if (result.status !== 0) {
  console.error(result.stderr);
  process.exit(result.status ?? 1);
}

writeFileSync(
  OUTPUT,
  `// Fichier généré par \`npm run db:types\` : ne pas modifier à la main.\n${result.stdout}`,
);
spawnSync("npx", ["prettier", "--write", OUTPUT], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
console.log(`Types écrits dans ${OUTPUT}`);
