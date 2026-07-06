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
  if (!res.ok) throw new Error(`Upload failed for ${filename}: ${res.status}`);
  return `/api/storage/objects/${objectPath.slice("/objects/".length)}`;
}

async function main() {
  console.log("Uploading 13 photos in parallel...");

  // Photo order matches name order in the list
  const [
    syifa,       // Syifa Ananditha            – Staf Pameran Foto
    rafi,        // M. Rafi Islami Nugraha      – Staf Pameran Foto
    bintang,     // M. Bintang Dimas            – Staf PPO
    alivia,      // Alivia Aldisa               – Staf Humas
    anandaZafira,// Ananda Zafira Maulida       – Sekretaris Umum II
    farah,       // Farah Ghaitsah Azzahira     – Bendahara Umum II
    akbarRey,    // Akbar Reyhansyah Firdaus    – Staf Inventaris
    gibran,      // M. Gibran Adira             – Staf Pendidikan
    anandaRakha, // Ananda Rakha Ramadhanry     – Staf Multimedia
    rafa,        // Rafa Athallah Azhar         – Staf Humas
    fras,        // M. Fras Syahdan             – Staf PPO
    riefqi,      // Riefqi Achmad Hambali       – Staf Pendidikan
    frans,       // Frans Caldio                – Staf Inventaris
  ] = await Promise.all([
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.01_1783326382499.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.02_(1)_1783326382500.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.02_1783326382501.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.03_(1)_1783326382501.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.03_1783326382502.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.04_(1)_1783326382502.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.04_1783326382503.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.05_(1)_1783326382503.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.05_1783326382504.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.06_1783326382504.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.07_(1)_1783326382505.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.07_(2)_1783326382505.jpeg"),
    uploadPhoto("WhatsApp_Image_2026-07-06_at_15.24.07_1783326382506.jpeg"),
  ]);
  console.log("All 13 photos uploaded.");

  // --- Update sortOrders for all 19 existing members ---
  // New total order (32 members, 0-31):
  //  0  adjie-syarofil    Ketua Umum
  //  1  frisca-agustiya   Sekretaris Umum I
  //  2  ananda-zafira     Sekretaris Umum II   ← NEW
  //  3  sasia-zulfa       Bendahara Umum I
  //  4  farah-ghaitsah    Bendahara Umum II    ← NEW
  //  5  indriati-kusuma   Kabid PPO
  //  6  akbar-ramadhan    Sekbid PPO
  //  7  ghina-halwa       Staf PPO
  //  8  m-bintang         Staf PPO             ← NEW
  //  9  m-fras            Staf PPO             ← NEW
  // 10  ikhwan-a          Kabid Pendidikan
  // 11  febby-amanda      Sekbid Pendidikan
  // 12  m-gibran          Staf Pendidikan      ← NEW
  // 13  riefqi-achmad     Staf Pendidikan      ← NEW
  // 14  muhammad-riva     Kabid Multimedia
  // 15  anisa-susi        Sekbid Multimedia
  // 16  indah-fimanni     Staf Multimedia
  // 17  ananda-rakha      Staf Multimedia      ← NEW
  // 18  nindya-tahira     Kabid Pameran Foto
  // 19  syalwa-nida       Sekbid Pameran Foto
  // 20  putri-dian        Staf Pameran Foto
  // 21  syifa-ananditha   Staf Pameran Foto    ← NEW
  // 22  m-rafi            Staf Pameran Foto    ← NEW
  // 23  tsabitha-naura    Kabid Inventaris
  // 24  novita-adelia     Sekbid Inventaris
  // 25  inasa-afiani      Staf Inventaris
  // 26  akbar-reyhansyah  Staf Inventaris      ← NEW
  // 27  frans-caldio      Staf Inventaris      ← NEW
  // 28  achmad-hafiz      Kabid Humas
  // 29  reviana-fitrianisa Sekbid Humas
  // 30  alivia-aldisa     Staf Humas           ← NEW
  // 31  rafa-athallah     Staf Humas           ← NEW

  const existingUpdates: { slug: string; sortOrder: number }[] = [
    { slug: "adjie-syarofil",     sortOrder: 0  },
    { slug: "frisca-agustiya",    sortOrder: 1  },
    { slug: "sasia-zulfa",        sortOrder: 3  },
    { slug: "indriati-kusuma",    sortOrder: 5  },
    { slug: "akbar-ramadhan",     sortOrder: 6  },
    { slug: "ghina-halwa",        sortOrder: 7  },
    { slug: "ikhwan-a",           sortOrder: 10 },
    { slug: "febby-amanda",       sortOrder: 11 },
    { slug: "muhammad-riva",      sortOrder: 14 },
    { slug: "anisa-susi",         sortOrder: 15 },
    { slug: "indah-fimanni",      sortOrder: 16 },
    { slug: "nindya-tahira",      sortOrder: 18 },
    { slug: "syalwa-nida",        sortOrder: 19 },
    { slug: "putri-dian",         sortOrder: 20 },
    { slug: "tsabitha-naura",     sortOrder: 23 },
    { slug: "novita-adelia",      sortOrder: 24 },
    { slug: "inasa-afiani",       sortOrder: 25 },
    { slug: "achmad-hafiz",       sortOrder: 28 },
    { slug: "reviana-fitrianisa", sortOrder: 29 },
  ];

  console.log("Updating sortOrders for existing 19 members...");
  for (const entry of existingUpdates) {
    await db.update(membersTable).set({ sortOrder: entry.sortOrder }).where(eq(membersTable.slug, entry.slug));
    console.log(`  ✓ ${entry.slug} → sortOrder ${entry.sortOrder}`);
  }

  // --- Insert 13 new members ---
  const newMembers = [
    { slug: "ananda-zafira",    name: "Ananda Zafira Maulida",    role: "Sekretaris Umum II",      shortRole: "Sekretaris Umum II",      sortOrder: 2,  avatar: anandaZafira },
    { slug: "farah-ghaitsah",   name: "Farah Ghaitsah Azzahira",  role: "Bendahara Umum II",       shortRole: "Bendahara Umum II",       sortOrder: 4,  avatar: farah },
    { slug: "m-bintang",        name: "M. Bintang Dimas",         role: "Staf PPO",                shortRole: "Staf PPO",                sortOrder: 8,  avatar: bintang },
    { slug: "m-fras",           name: "M. Fras Syahdan",          role: "Staf PPO",                shortRole: "Staf PPO",                sortOrder: 9,  avatar: fras },
    { slug: "m-gibran",         name: "M. Gibran Adira",          role: "Staf Pendidikan",         shortRole: "Staf Pendidikan",         sortOrder: 12, avatar: gibran },
    { slug: "riefqi-achmad",    name: "Riefqi Achmad Hambali",    role: "Staf Pendidikan",         shortRole: "Staf Pendidikan",         sortOrder: 13, avatar: riefqi },
    { slug: "ananda-rakha",     name: "Ananda Rakha Ramadhanry",  role: "Staf Multimedia",         shortRole: "Staf Multimedia",         sortOrder: 17, avatar: anandaRakha },
    { slug: "syifa-ananditha",  name: "Syifa Ananditha",          role: "Staf Pameran Foto",       shortRole: "Staf Pameran Foto",       sortOrder: 21, avatar: syifa },
    { slug: "m-rafi",           name: "M. Rafi Islami Nugraha",   role: "Staf Pameran Foto",       shortRole: "Staf Pameran Foto",       sortOrder: 22, avatar: rafi },
    { slug: "akbar-reyhansyah", name: "Akbar Reyhansyah Firdaus", role: "Staf Inventaris",         shortRole: "Staf Inventaris",         sortOrder: 26, avatar: akbarRey },
    { slug: "frans-caldio",     name: "Frans Caldio",             role: "Staf Inventaris",         shortRole: "Staf Inventaris",         sortOrder: 27, avatar: frans },
    { slug: "alivia-aldisa",    name: "Alivia Aldisa",            role: "Staf Humas",              shortRole: "Staf Humas",              sortOrder: 30, avatar: alivia },
    { slug: "rafa-athallah",    name: "Rafa Athallah Azhar",      role: "Staf Humas",              shortRole: "Staf Humas",              sortOrder: 31, avatar: rafa },
  ];

  console.log("\nInserting 13 new members...");
  for (const m of newMembers) {
    await db.insert(membersTable).values({ ...m, bio: "", instagram: "" });
    console.log(`  ✓ ${m.name} (${m.role}, sortOrder ${m.sortOrder})`);
  }

  console.log("\nDone! 13 anggota berhasil ditambahkan. Total anggota: 32.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
