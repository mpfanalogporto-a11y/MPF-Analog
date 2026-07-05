import { like, sql } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";

async function main() {
  const members = await db.select().from(membersTable);
  let count = 0;
  for (const m of members) {
    const newRole = m.role.replace("Kepala Bidang", "Ketua Bidang");
    const newShortRole = m.shortRole.replace("Kepala Bidang", "Ketua Bidang");
    if (newRole !== m.role || newShortRole !== m.shortRole) {
      const { eq } = await import("drizzle-orm");
      await db.update(membersTable).set({ role: newRole, shortRole: newShortRole }).where(eq(membersTable.id, m.id));
      console.log(`  ${m.name}: "${m.shortRole}" → "${newShortRole}"`);
      count++;
    }
  }
  console.log(`\nDone. Updated ${count} members.`);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
