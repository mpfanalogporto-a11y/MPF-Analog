import { eq } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";

const FIXES: { slug: string; shortRole: string }[] = [
  { slug: "indriati-kusuma-dewi",    shortRole: "Kepala Bidang PPO" },
  { slug: "muhammad-riva-alfaridzi", shortRole: "Kepala Bidang Multimedia" },
  { slug: "nindya-tahira-ramadhine", shortRole: "Kepala Bidang Pameran Foto" },
  { slug: "tsabitha-naura-kamila",   shortRole: "Kepala Bidang Inventaris" },
  { slug: "achmad-hafiz-al-gifari",  shortRole: "Kepala Bidang Humas" },
  { slug: "anisa-susi-rahmawati",    shortRole: "Sekretaris Bidang Multimedia" },
];

async function main() {
  for (const fix of FIXES) {
    await db.update(membersTable).set({ shortRole: fix.shortRole }).where(eq(membersTable.slug, fix.slug));
    console.log(`  updated: ${fix.slug} → ${fix.shortRole}`);
  }
  console.log("Done.");
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
