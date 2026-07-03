import { readFile } from "node:fs/promises";
import path from "node:path";
import { db, membersTable, photosTable, siteSettingsTable } from "@workspace/db";
import { ObjectStorageService } from "../lib/objectStorage";

const objectStorageService = new ObjectStorageService();

const ASSETS_DIR = path.resolve(
  import.meta.dirname,
  "../../../mpf-analog/src/assets",
);

async function uploadAsset(relativePath: string): Promise<string> {
  const filePath = path.join(ASSETS_DIR, relativePath);
  const buffer = await readFile(filePath);
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

  const res = await fetch(uploadURL, {
    method: "PUT",
    body: buffer,
    headers: { "Content-Type": "image/jpeg" },
  });
  if (!res.ok) {
    throw new Error(`Failed to upload ${relativePath}: ${res.status}`);
  }

  return `/api/storage/objects/${objectPath.slice("/objects/".length)}`;
}

interface MemberSeed {
  slug: string;
  name: string;
  role: string;
  shortRole: string;
  bio: string;
  instagram: string;
  avatarAsset: string;
  sortOrder: number;
}

const MEMBERS: MemberSeed[] = [
  {
    slug: "rizki-harya",
    name: "Rizki Harya",
    role: "Ketua MPF Analog",
    shortRole: "Ketua",
    bio: "Fotografi bagiku adalah cara melihat dunia dari sudut pandang yang berbeda. Setiap momen memiliki cerita yang patut diabadikan.",
    instagram: "@rizkiharya_",
    avatarAsset: "members/rizki-harya.jpg",
    sortOrder: 0,
  },
  {
    slug: "nabila-putri",
    name: "Nabila Putri",
    role: "Wakil Ketua",
    shortRole: "Wakil Ketua",
    bio: "Setiap gambar adalah jendela ke dunia yang lebih luas. Saya percaya fotografi bisa menginspirasi dan mengubah perspektif.",
    instagram: "@nabilaputri",
    avatarAsset: "members/nabila-putri.jpg",
    sortOrder: 1,
  },
  {
    slug: "fajar-ramdani",
    name: "Fajar Ramdani",
    role: "Sekretaris",
    shortRole: "Sekretaris",
    bio: "Kamera adalah alat, kreativitas adalah kunci. Saya mendokumentasikan setiap momen dengan penuh makna.",
    instagram: "@fajarramdani",
    avatarAsset: "members/fajar-ramdani.jpg",
    sortOrder: 2,
  },
  {
    slug: "raihan-fariz",
    name: "Raihan Fariz",
    role: "Bendahara",
    shortRole: "Bendahara",
    bio: "Lewat lensa kamera, saya menemukan keindahan di setiap sudut kehidupan yang sering terlewatkan.",
    instagram: "@raihanfariz",
    avatarAsset: "members/raihan-fariz.jpg",
    sortOrder: 3,
  },
  {
    slug: "salsabila-a",
    name: "Salsabila A.",
    role: "Koord. Dokumentasi",
    shortRole: "Koord. Dokumentasi",
    bio: "Dokumentasi bukan sekadar memotret, tapi merekam jiwa dari setiap kegiatan dan kebersamaan.",
    instagram: "@salsabilaa",
    avatarAsset: "members/salsabila-a.jpg",
    sortOrder: 4,
  },
  {
    slug: "ikhwan-a",
    name: "Ikhwan A.",
    role: "Divisi Pendidikan",
    shortRole: "Divisi Pendidikan",
    bio: "Pendidikan fotografi adalah investasi terbaik untuk menghasilkan karya yang bermakna dan berdampak.",
    instagram: "@wanmar__",
    avatarAsset: "members/fahri.jpg",
    sortOrder: 5,
  },
];

const POOL: Record<string, string[]> = {
  STREET: [
    "gallery/street-1.jpg",
    "gallery/street-2.jpg",
    "gallery/street-3.jpg",
    "gallery/street-4.jpg",
  ],
  EVENT: [
    "gallery/event-1.jpg",
    "gallery/event-2.jpg",
    "gallery/event-3.jpg",
    "gallery/event-4.jpg",
  ],
  PORTRAIT: [
    "gallery/portrait-1.jpg",
    "gallery/portrait-2.jpg",
    "gallery/portrait-3.jpg",
    "gallery/portrait-4.jpg",
  ],
  LANDSCAPE: [
    "gallery/landscape-1.jpg",
    "gallery/landscape-2.jpg",
    "gallery/landscape-3.jpg",
    "gallery/landscape-4.jpg",
  ],
  DOKUMENTASI: [
    "gallery/dokumentasi-1.jpg",
    "gallery/dokumentasi-2.jpg",
    "gallery/dokumentasi-3.jpg",
    "gallery/dokumentasi-4.jpg",
  ],
};

const CATEGORIES = ["STREET", "EVENT", "PORTRAIT", "LANDSCAPE", "DOKUMENTASI"];

const IKHWAN_PHOTOS: Array<{ category: string; asset: string; title: string }> = [
  { category: "STREET", asset: "members/ikhwan/street-1.jpg", title: "STREET by Ikhwan A." },
  { category: "STREET", asset: "members/ikhwan/street-2.jpg", title: "STREET by Ikhwan A." },
  { category: "LANDSCAPE", asset: "members/ikhwan/landscape-1.jpg", title: "LANDSCAPE by Ikhwan A." },
  { category: "LANDSCAPE", asset: "members/ikhwan/landscape-2.jpg", title: "LANDSCAPE by Ikhwan A." },
  { category: "DOKUMENTASI", asset: "members/ikhwan/dokumentasi-1.jpg", title: "DOKUMENTASI by Ikhwan A." },
  { category: "EVENT", asset: "members/ikhwan/event-1.jpg", title: "EVENT by Ikhwan A." },
  { category: "EVENT", asset: "members/ikhwan/event-2.jpg", title: "EVENT by Ikhwan A." },
  { category: "EVENT", asset: "members/ikhwan/event-3.jpg", title: "EVENT by Ikhwan A." },
  { category: "EVENT", asset: "members/ikhwan/event-4.jpg", title: "EVENT by Ikhwan A." },
];

async function main() {
  const existingMembers = await db.select().from(membersTable).limit(1);
  if (existingMembers.length > 0) {
    console.log("Members table already has data — skipping seed.");
    return;
  }

  console.log("Uploading and inserting members...");
  const assetUrlCache = new Map<string, string>();
  const getUrl = async (asset: string) => {
    if (!assetUrlCache.has(asset)) {
      assetUrlCache.set(asset, await uploadAsset(asset));
    }
    return assetUrlCache.get(asset)!;
  };

  const memberIdBySlug = new Map<string, number>();

  for (const m of MEMBERS) {
    const avatarUrl = await getUrl(m.avatarAsset);
    const [inserted] = await db
      .insert(membersTable)
      .values({
        slug: m.slug,
        name: m.name,
        role: m.role,
        shortRole: m.shortRole,
        bio: m.bio,
        instagram: m.instagram,
        avatar: avatarUrl,
        sortOrder: m.sortOrder,
      })
      .returning();
    memberIdBySlug.set(m.slug, inserted.id);
    console.log(`  + member ${m.name}`);
  }

  console.log("Uploading and inserting photos...");
  let photoSort = 0;
  const nonIkhwanMembers = MEMBERS.filter((m) => m.slug !== "ikhwan-a");
  for (let memberIdx = 0; memberIdx < nonIkhwanMembers.length; memberIdx++) {
    const member = nonIkhwanMembers[memberIdx];
    const memberId = memberIdBySlug.get(member.slug)!;
    for (let i = 0; i < 6; i++) {
      const category = CATEGORIES[(memberIdx + i) % CATEGORIES.length];
      const asset = POOL[category][(memberIdx + i) % 4];
      const src = await getUrl(asset);
      await db.insert(photosTable).values({
        memberId,
        category,
        src,
        title: `${category} by ${member.name}`,
        sortOrder: photoSort++,
      });
    }
  }

  const ikhwanId = memberIdBySlug.get("ikhwan-a")!;
  for (const photo of IKHWAN_PHOTOS) {
    const src = await getUrl(photo.asset);
    await db.insert(photosTable).values({
      memberId: ikhwanId,
      category: photo.category,
      src,
      title: photo.title,
      sortOrder: photoSort++,
    });
  }

  console.log("Seeding site settings...");
  const settings: Record<string, string> = {
    site_title: "MPF ANALOG",
    site_tagline: "MAHASISWA PENCINTA FOTOGRAFI",
    hero_description:
      "Menginspirasi, berkarya, dan berkontribusi melalui fotografi. Merekam setiap momen menjadi cerita yang abadi.",
    about_quote:
      '"MPF Analog (Mikamones Photography) adalah organisasi fotografi di Universitas Muhammadiyah Jakarta yang berfokus pada dokumentasi kegiatan, pengembangan kreativitas, serta kolaborasi dalam karya visual."',
    about_paragraph_1:
      "Kami percaya bahwa setiap jepretan kamera bukan hanya sekadar merekam cahaya, melainkan membekukan waktu, emosi, dan cerita. Melalui wadah ini, kami belajar melihat dunia dengan lebih peka dan merangkainya menjadi memori yang abadi.",
    about_paragraph_2:
      "Berakar dari kecintaan pada estetika analog, kami terus mengeksplorasi batas-batas medium visual, saling mendukung satu sama lain, dan berkontribusi mendokumentasikan perjalanan komunitas di sekitar kami.",
  };

  for (const [key, value] of Object.entries(settings)) {
    await db
      .insert(siteSettingsTable)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value } });
  }

  console.log("Seed complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
