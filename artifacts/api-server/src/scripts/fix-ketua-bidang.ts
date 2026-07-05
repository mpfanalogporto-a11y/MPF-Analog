import { eq } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";

const FIXES: { slug: string; role: string; shortRole: string }[] = [
  { slug: "indriati-kusuma-dewi",    role: "Ketua Bidang PPO",          shortRole: "Ketua Bidang PPO" },
  { slug: "muhammad-riva-alfaridzi", role: "Ketua Bidang Multimedia",   shortRole: "Ketua Bidang Multimedia" },
  { slug: "nindya-tahira-ramadhine", role: "Ketua Bidang Pameran Foto", shortRole: "Ketua Bidang Pameran Foto" },
  { slug: "tsabitha-naura-kamila",   role: "Ketua Bidang Inventaris",   shortRole: "Ketua Bidang Inventaris" },
  { slug: "achmad-hafiz-al-gifari",  role: "Ketua Bidang Humas",        shortRole: "Ketua Bidang Humas" },
];

async function main() {
  for (const fix of FIXES) {
    await db.update(membersTable)
      .set({ role: fix.role, shortRole: fix.shortRole })
      .where(eq(membersTable.slug, fix.slug));
    console.log(`  ✓ ${fix.slug} → ${fix.shortRole}`);
  }
  console.log("Done.");
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
