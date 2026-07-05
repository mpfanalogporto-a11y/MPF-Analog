import { eq } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";

const ORDER_MAP: Record<string, number> = {
  "ketua umum": 0,
  "sekretaris umum": 1,
  "bendahara": 2,
  "ppo": 3,
  "pendidikan": 4,
  "multimedia": 5,
  "pameran foto": 6,
  "inventaris": 7,
  "humas": 8,
};

function getDivisionOrder(role: string): number {
  const r = role.toLowerCase();
  if (r.includes("ketua umum")) return 0;
  if (r.includes("sekretaris umum")) return 10;
  if (r.includes("bendahara umum")) return 20;
  if (r.includes("ppo")) return 30;
  if (r.includes("pendidikan")) return 40;
  if (r.includes("multimedia")) return 50;
  if (r.includes("pameran foto")) return 60;
  if (r.includes("inventaris")) return 70;
  if (r.includes("humas")) return 80;
  return 90;
}

function isHead(role: string): number {
  const r = role.toLowerCase();
  if (r.includes("ketua") || r.includes("kepala")) return 0;
  return 1;
}

async function main() {
  const members = await db.select().from(membersTable);
  console.log("Current members:");
  members.forEach(m => console.log(`  ${m.name} | ${m.role}`));

  const sorted = [...members].sort((a, b) => {
    const divA = getDivisionOrder(a.role);
    const divB = getDivisionOrder(b.role);
    if (divA !== divB) return divA - divB;
    return isHead(a.role) - isHead(b.role);
  });

  console.log("\nNew order:");
  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    console.log(`  ${i}: ${m.name} | ${m.role}`);
    await db.update(membersTable).set({ sortOrder: i }).where(eq(membersTable.id, m.id));
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
