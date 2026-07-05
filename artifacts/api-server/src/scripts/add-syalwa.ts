import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq, gte } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";
import { ObjectStorageService } from "../lib/objectStorage";

const objectStorageService = new ObjectStorageService();

async function uploadPhoto(filePath: string): Promise<string> {
  const buffer = await readFile(filePath);
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
  const res = await fetch(uploadURL, { method: "PUT", body: buffer, headers: { "Content-Type": "image/jpeg" } });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return `/api/storage/objects/${objectPath.slice("/objects/".length)}`;
}

async function main() {
  // Shift sortOrder of members with sortOrder >= 9 up by 1, in descending order to avoid conflicts
  const toShift = await db.select({ id: membersTable.id, sortOrder: membersTable.sortOrder, name: membersTable.name })
    .from(membersTable)
    .where(gte(membersTable.sortOrder, 9));

  toShift.sort((a, b) => b.sortOrder - a.sortOrder);
  for (const m of toShift) {
    await db.update(membersTable).set({ sortOrder: m.sortOrder + 1 }).where(eq(membersTable.id, m.id));
    console.log(`  shifted ${m.name}: ${m.sortOrder} → ${m.sortOrder + 1}`);
  }

  const photoPath = path.resolve(
    import.meta.dirname,
    "../../../../attached_assets/WhatsApp_Image_2026-07-03_at_22.20.58_(2)_1783251826900.jpeg"
  );
  console.log("Uploading photo...");
  const avatarUrl = await uploadPhoto(photoPath);
  console.log("Uploaded:", avatarUrl);

  await db.insert(membersTable).values({
    slug: "syalwa-nida",
    name: "Syalwa Nida Tazkiya",
    role: "Sekretaris Bidang Pameran Foto",
    shortRole: "Sekretaris Bidang Pameran Foto",
    bio: "Mendokumentasikan setiap pameran foto dengan penuh dedikasi dan semangat untuk memajukan MPF Analog.",
    instagram: "",
    avatar: avatarUrl,
    sortOrder: 9,
  });

  console.log("✓ Syalwa Nida Tazkiya ditambahkan (sortOrder 9, setelah Nindya)");
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
