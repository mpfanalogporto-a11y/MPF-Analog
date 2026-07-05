import { eq } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";

const EXPLICIT_ORDER: { slug: string; sortOrder: number; role?: string }[] = [
  { slug: "adjie-syarofil-anam",      sortOrder: 0 },
  { slug: "frisca-agustiya",           sortOrder: 1 },
  { slug: "sasia-zulfa-choirunisa",    sortOrder: 2 },
  { slug: "indriati-kusuma-dewi",      sortOrder: 3 },
  { slug: "akbar-ramadhan",            sortOrder: 4 },
  { slug: "ikhwan-a",                  sortOrder: 5 },
  { slug: "febby-amanda",              sortOrder: 6 },
  { slug: "muhammad-riva-alfaridzi",   sortOrder: 7 },
  { slug: "anisa-susi-rahmawati",      sortOrder: 8, role: "Sekretaris Bidang Multimedia" },
  { slug: "nindya-tahira-ramadhine",   sortOrder: 9 },
  { slug: "tsabitha-naura-kamila",     sortOrder: 10 },
  { slug: "novita-adelia-ristanti",    sortOrder: 11 },
  { slug: "achmad-hafiz-al-gifari",    sortOrder: 12 },
  { slug: "reviana-fitrianisa",        sortOrder: 13 },
];

async function main() {
  for (const entry of EXPLICIT_ORDER) {
    const update: { sortOrder: number; role?: string } = { sortOrder: entry.sortOrder };
    if (entry.role) update.role = entry.role;
    await db.update(membersTable).set(update).where(eq(membersTable.slug, entry.slug));
    console.log(`  ${entry.sortOrder}: ${entry.slug}${entry.role ? ` → role: ${entry.role}` : ""}`);
  }
  console.log("Done.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
