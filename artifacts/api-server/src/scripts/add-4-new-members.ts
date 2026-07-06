import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";
import { ObjectStorageService } from "../lib/objectStorage";

const objectStorageService = new ObjectStorageService();
const ASSETS = path.resolve(import.meta.dirname, "../../../../attached_assets");

async function uploadPhoto(filename: string): Promise<string> {
  const buffer = await readFile(path.join(ASSETS, filename));
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
  const res = await fetch(uploadURL, { method: "PUT", body: buffer, headers: { "Content-Type": "image/jpeg" } });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return `/api/storage/objects/${objectPath.slice("/objects/".length)}`;
}

async function main() {
  console.log("Uploading 4 photos in parallel...");
  const [ghina, putri, indah, inasa] = await Promise.all([
    uploadPhoto("WhatsApp_Image_2026-07-06_at_14.32.44_(1)_1783323212288.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_14.32.44_1783323212289.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_14.32.45_(1)_1783323212289.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_14.32.45_1783323212289.jpeg"),
  ]);
  console.log("All photos uploaded.");

  // Set final sortOrder for all existing members (correct order per bidang)
  const existingOrder: { slug: string; sortOrder: number }[] = [
    { slug: "adjie-syarofil",   sortOrder: 0 },
    { slug: "frisca-agustiya",  sortOrder: 1 },
    { slug: "sasia-zulfa",      sortOrder: 2 },
    { slug: "indriati-kusuma",  sortOrder: 3 },
    { slug: "akbar-ramadhan",   sortOrder: 4 },
    // sortOrder 5 = Ghina (new)
    { slug: "ikhwan-a",         sortOrder: 6 },
    { slug: "febby-amanda",     sortOrder: 7 },
    { slug: "muhammad-riva",    sortOrder: 8 },
    { slug: "anisa-susi",       sortOrder: 9 },
    // sortOrder 10 = Indah (new)
    { slug: "nindya-tahira",    sortOrder: 11 },
    { slug: "syalwa-nida",      sortOrder: 12 },
    // sortOrder 13 = Putri (new)
    { slug: "tsabitha-naura",   sortOrder: 14 },
    { slug: "novita-adelia",    sortOrder: 15 },
    // sortOrder 16 = Inasa (new)
    { slug: "achmad-hafiz",     sortOrder: 17 },
    { slug: "anisa-susi",       sortOrder: 9 },
    { slug: "reviana-fitrianisa", sortOrder: 18 },
  ];

  // Deduplicate
  const seen = new Set<string>();
  const uniqueOrder = existingOrder.filter(e => { if (seen.has(e.slug)) return false; seen.add(e.slug); return true; });

  console.log("Updating sort orders for existing members...");
  for (const entry of uniqueOrder) {
    await db.update(membersTable).set({ sortOrder: entry.sortOrder }).where(eq(membersTable.slug, entry.slug));
  }

  // Insert 4 new members
  const newMembers = [
    { slug: "ghina-halwa",  name: "Ghina Halwa Mufidah", role: "Staf PPO",          shortRole: "Staf PPO",          sortOrder: 5,  avatar: ghina },
    { slug: "indah-fimanni",name: "Indah Fimanni",        role: "Staf Multimedia",   shortRole: "Staf Multimedia",   sortOrder: 10, avatar: indah },
    { slug: "putri-dian",   name: "Putri Dian Mulyani",   role: "Staf Pameran Foto", shortRole: "Staf Pameran Foto", sortOrder: 13, avatar: putri },
    { slug: "inasa-afiani", name: "Inasa Afiani",          role: "Staf Inventaris",   shortRole: "Staf Inventaris",   sortOrder: 16, avatar: inasa },
  ];

  for (const m of newMembers) {
    await db.insert(membersTable).values({ ...m, bio: "", instagram: "" });
    console.log(`  ✓ ${m.name} (${m.shortRole})`);
  }

  console.log("\nDone! Total added: 4 anggota.");
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
