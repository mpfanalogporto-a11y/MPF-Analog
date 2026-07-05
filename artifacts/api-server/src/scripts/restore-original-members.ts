import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";
import { ObjectStorageService } from "../lib/objectStorage";

const objectStorageService = new ObjectStorageService();
const ASSETS_DIR = path.resolve(import.meta.dirname, "../../../mpf-analog/src/assets");

async function uploadAsset(relativePath: string): Promise<string> {
  const filePath = path.join(ASSETS_DIR, relativePath);
  const buffer = await readFile(filePath);
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
  const res = await fetch(uploadURL, { method: "PUT", body: buffer, headers: { "Content-Type": "image/jpeg" } });
  if (!res.ok) throw new Error(`Failed to upload ${relativePath}: ${res.status}`);
  return `/api/storage/objects/${objectPath.slice("/objects/".length)}`;
}

const ORIGINALS = [
  { slug: "rizki-harya", name: "Rizki Harya", role: "Ketua MPF Analog", shortRole: "Ketua", bio: "Fotografi bagiku adalah cara melihat dunia dari sudut pandang yang berbeda. Setiap momen memiliki cerita yang patut diabadikan.", instagram: "@rizkiharya_", avatar: "members/rizki-harya.jpg", sortOrder: 0 },
  { slug: "nabila-putri", name: "Nabila Putri", role: "Wakil Ketua", shortRole: "Wakil Ketua", bio: "Setiap gambar adalah jendela ke dunia yang lebih luas. Saya percaya fotografi bisa menginspirasi dan mengubah perspektif.", instagram: "@nabilaputri", avatar: "members/nabila-putri.jpg", sortOrder: 1 },
  { slug: "fajar-ramdani", name: "Fajar Ramdani", role: "Sekretaris", shortRole: "Sekretaris", bio: "Kamera adalah alat, kreativitas adalah kunci. Saya mendokumentasikan setiap momen dengan penuh makna.", instagram: "@fajarramdani", avatar: "members/fajar-ramdani.jpg", sortOrder: 2 },
  { slug: "raihan-fariz", name: "Raihan Fariz", role: "Bendahara", shortRole: "Bendahara", bio: "Lewat lensa kamera, saya menemukan keindahan di setiap sudut kehidupan yang sering terlewatkan.", instagram: "@raihanfariz", avatar: "members/raihan-fariz.jpg", sortOrder: 3 },
  { slug: "salsabila-a", name: "Salsabila A.", role: "Koord. Dokumentasi", shortRole: "Koord. Dokumentasi", bio: "Dokumentasi bukan sekadar memotret, tapi merekam jiwa dari setiap kegiatan dan kebersamaan.", instagram: "@salsabilaa", avatar: "members/salsabila-a.jpg", sortOrder: 4 },
  { slug: "ikhwan-a", name: "Ikhwan A.", role: "Divisi Pendidikan", shortRole: "Divisi Pendidikan", bio: "Pendidikan fotografi adalah investasi terbaik untuk menghasilkan karya yang bermakna dan berdampak.", instagram: "@wanmar__", avatar: "members/fahri.jpg", sortOrder: 5 },
];

async function main() {
  for (const m of ORIGINALS) {
    const existing = await db.select({ id: membersTable.id }).from(membersTable).where(eq(membersTable.slug, m.slug)).limit(1);
    if (existing.length > 0) { console.log(`  already exists: ${m.name}`); continue; }
    console.log(`  Uploading ${m.name}...`);
    const avatarUrl = await uploadAsset(m.avatar);
    await db.insert(membersTable).values({ slug: m.slug, name: m.name, role: m.role, shortRole: m.shortRole, bio: m.bio, instagram: m.instagram, avatar: avatarUrl, sortOrder: m.sortOrder });
    console.log(`  + ${m.name}`);
  }
  console.log("Done.");
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
