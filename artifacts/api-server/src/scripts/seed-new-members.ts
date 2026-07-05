import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";
import { ObjectStorageService } from "../lib/objectStorage";

const objectStorageService = new ObjectStorageService();

const ATTACHED_ASSETS_DIR = path.resolve(
  import.meta.dirname,
  "../../../../attached_assets",
);

async function uploadAsset(filename: string): Promise<string> {
  const filePath = path.join(ATTACHED_ASSETS_DIR, filename);
  const buffer = await readFile(filePath);
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

  const res = await fetch(uploadURL, {
    method: "PUT",
    body: buffer,
    headers: { "Content-Type": "image/jpeg" },
  });
  if (!res.ok) {
    throw new Error(`Failed to upload ${filename}: ${res.status}`);
  }

  return `/api/storage/objects/${objectPath.slice("/objects/".length)}`;
}

const NEW_MEMBERS = [
  {
    slug: "achmad-hafiz",
    name: "Achmad Hafiz Al-Gifari",
    role: "Kepala Bidang Humas",
    shortRole: "Kabid Humas",
    bio: "Membangun komunikasi dan hubungan yang baik antara MPF Analog dengan komunitas sekitar.",
    photo: "WhatsApp_Image_2026-07-05_at_01.50.08_(1)_1783210419572.jpeg",
    sortOrder: 7,
  },
  {
    slug: "muhammad-riva",
    name: "Muhammad Riva Alfaridzi",
    role: "Kepala Bidang Multimedia",
    shortRole: "Kabid Multimedia",
    bio: "Mengembangkan konten multimedia untuk memperluas jangkauan karya MPF Analog.",
    photo: "WhatsApp_Image_2026-07-05_at_01.50.08_1783210419573.jpeg",
    sortOrder: 8,
  },
  {
    slug: "frisca-agustiya",
    name: "Frisca Agustiya",
    role: "Sekretaris Umum I",
    shortRole: "Sekretaris Umum I",
    bio: "Mengelola administrasi dan dokumentasi organisasi agar berjalan dengan tertib dan teratur.",
    photo: "WhatsApp_Image_2026-07-03_at_22.21.11_(1)_1783210539437.jpeg",
    sortOrder: 9,
  },
  {
    slug: "sasia-zulfa",
    name: "Sasia Zulfa Choirunisa",
    role: "Bendahara Umum I",
    shortRole: "Bendahara Umum I",
    bio: "Mengelola keuangan organisasi dengan transparan dan bertanggung jawab.",
    photo: "WhatsApp_Image_2026-07-03_at_22.21.11_1783210539438.jpeg",
    sortOrder: 10,
  },
  {
    slug: "adjie-syarofil",
    name: "Adjie Syarofil Anam",
    role: "Ketua Umum",
    shortRole: "Ketua Umum",
    bio: "Memimpin dan menggerakkan seluruh kegiatan MPF Analog menuju visi bersama.",
    photo: "WhatsApp_Image_2026-07-03_at_22.20.57_1783210539438.jpeg",
    sortOrder: 11,
  },
  {
    slug: "nindya-tahira",
    name: "Nindya Tahira Ramadhine",
    role: "Kepala Bidang Pameran Foto",
    shortRole: "Kabid Pameran",
    bio: "Mengorkestrasi pameran fotografi yang menampilkan karya terbaik anggota MPF Analog.",
    photo: "WhatsApp_Image_2026-07-03_at_22.20.58_(1)_1783210539440.jpeg",
    sortOrder: 12,
  },
  {
    slug: "akbar-ramadhan",
    name: "Akbar Ramadhan",
    role: "Sekretaris Bidang PPO",
    shortRole: "Sekretaris PPO",
    bio: "Mendokumentasikan dan mengelola administrasi bidang pendidikan dan pelatihan organisasi.",
    photo: "WhatsApp_Image_2026-07-03_at_22.20.58_1783210539441.jpeg",
    sortOrder: 13,
  },
  {
    slug: "anisa-susi",
    name: "Anisa Susi Rahmawati",
    role: "Sekretaris Bidang",
    shortRole: "Sekretaris Bidang",
    bio: "Mendukung kelancaran administrasi bidang dengan penuh dedikasi.",
    photo: "WhatsApp_Image_2026-07-03_at_22.20.59_(1)_1783210539442.jpeg",
    sortOrder: 14,
  },
  {
    slug: "reviana-fitrianisa",
    name: "Reviana Fitrianisa",
    role: "Sekretaris Bidang Humas",
    shortRole: "Sekretaris Humas",
    bio: "Membantu pengelolaan administrasi dan komunikasi bidang humas MPF Analog.",
    photo: "WhatsApp_Image_2026-07-03_at_22.20.59_1783210539443.jpeg",
    sortOrder: 15,
  },
  {
    slug: "tsabitha-naura",
    name: "Tsabitha Naura Kamila",
    role: "Kepala Bidang Inventaris",
    shortRole: "Kabid Inventaris",
    bio: "Mengelola dan merawat seluruh peralatan fotografi MPF Analog.",
    photo: "WhatsApp_Image_2026-07-03_at_22.21.01_1783210539443.jpeg",
    sortOrder: 16,
  },
  {
    slug: "febby-amanda",
    name: "Febby Amanda",
    role: "Sekretaris Bidang Pendidikan",
    shortRole: "Sekretaris Pendidikan",
    bio: "Mendukung program pendidikan fotografi bagi seluruh anggota MPF Analog.",
    photo: "WhatsApp_Image_2026-07-03_at_22.21.02_1783210539444.jpeg",
    sortOrder: 17,
  },
  {
    slug: "novita-adelia",
    name: "Novita Adelia Ristanti",
    role: "Sekretaris Bidang Inventaris",
    shortRole: "Sekretaris Inventaris",
    bio: "Membantu pengelolaan dan pencatatan inventaris peralatan organisasi.",
    photo: "WhatsApp_Image_2026-07-03_at_22.21.10_(1)_1783210539445.jpeg",
    sortOrder: 18,
  },
  {
    slug: "indriati-kusuma",
    name: "Indriati Kusuma Dewi",
    role: "Kepala Bidang PPO",
    shortRole: "Kabid PPO",
    bio: "Memimpin program pendidikan dan pelatihan fotografi untuk mengembangkan kemampuan anggota.",
    photo: "WhatsApp_Image_2026-07-03_at_22.21.10_(2)_1783210539445.jpeg",
    sortOrder: 19,
  },
];

async function main() {
  console.log("Adding new members...");

  for (const m of NEW_MEMBERS) {
    const existing = await db
      .select({ id: membersTable.id })
      .from(membersTable)
      .where(eq(membersTable.slug, m.slug))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  ⟳ ${m.name} already exists, skipping`);
      continue;
    }

    console.log(`  Uploading photo for ${m.name}...`);
    const avatarUrl = await uploadAsset(m.photo);

    await db.insert(membersTable).values({
      slug: m.slug,
      name: m.name,
      role: m.role,
      shortRole: m.shortRole,
      bio: m.bio,
      instagram: "",
      avatar: avatarUrl,
      sortOrder: m.sortOrder,
    });

    console.log(`  + ${m.name} (${m.role})`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
