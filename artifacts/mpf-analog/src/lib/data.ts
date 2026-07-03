import rizkiAvatar from '@/assets/members/rizki-harya.jpg';
import nabilaAvatar from '@/assets/members/nabila-putri.jpg';
import fajarAvatar from '@/assets/members/fajar-ramdani.jpg';
import raihanAvatar from '@/assets/members/raihan-fariz.jpg';
import salsabilaAvatar from '@/assets/members/salsabila-a.jpg';
import fahriAvatar from '@/assets/members/fahri.jpg';

// Ikhwan A. — real photos
import ikhwanStreet1 from '@/assets/members/ikhwan/street-1.jpg';
import ikhwanStreet2 from '@/assets/members/ikhwan/street-2.jpg';
import ikhwanLandscape1 from '@/assets/members/ikhwan/landscape-1.jpg';
import ikhwanLandscape2 from '@/assets/members/ikhwan/landscape-2.jpg';
import ikhwanDok1 from '@/assets/members/ikhwan/dokumentasi-1.jpg';
import ikhwanEvent1 from '@/assets/members/ikhwan/event-1.jpg';
import ikhwanEvent2 from '@/assets/members/ikhwan/event-2.jpg';
import ikhwanEvent3 from '@/assets/members/ikhwan/event-3.jpg';
import ikhwanEvent4 from '@/assets/members/ikhwan/event-4.jpg';

// Street
import street1 from '@/assets/gallery/street-1.jpg';
import street2 from '@/assets/gallery/street-2.jpg';
import street3 from '@/assets/gallery/street-3.jpg';
import street4 from '@/assets/gallery/street-4.jpg';

// Event
import event1 from '@/assets/gallery/event-1.jpg';
import event2 from '@/assets/gallery/event-2.jpg';
import event3 from '@/assets/gallery/event-3.jpg';
import event4 from '@/assets/gallery/event-4.jpg';

// Portrait
import portrait1 from '@/assets/gallery/portrait-1.jpg';
import portrait2 from '@/assets/gallery/portrait-2.jpg';
import portrait3 from '@/assets/gallery/portrait-3.jpg';
import portrait4 from '@/assets/gallery/portrait-4.jpg';

// Landscape
import landscape1 from '@/assets/gallery/landscape-1.jpg';
import landscape2 from '@/assets/gallery/landscape-2.jpg';
import landscape3 from '@/assets/gallery/landscape-3.jpg';
import landscape4 from '@/assets/gallery/landscape-4.jpg';

// Dokumentasi
import dok1 from '@/assets/gallery/dokumentasi-1.jpg';
import dok2 from '@/assets/gallery/dokumentasi-2.jpg';
import dok3 from '@/assets/gallery/dokumentasi-3.jpg';
import dok4 from '@/assets/gallery/dokumentasi-4.jpg';

export interface Member {
  id: string;
  name: string;
  role: string;
  shortRole: string;
  bio: string;
  instagram: string;
  avatar: string;
}

export interface Photo {
  id: string;
  memberId: string;
  category: 'STREET' | 'EVENT' | 'PORTRAIT' | 'LANDSCAPE' | 'DOKUMENTASI';
  src: string;
  title: string;
}

export const members: Member[] = [
  {
    id: "rizki-harya",
    name: "Rizki Harya",
    role: "Ketua MPF Analog",
    shortRole: "Ketua",
    bio: "Fotografi bagiku adalah cara melihat dunia dari sudut pandang yang berbeda. Setiap momen memiliki cerita yang patut diabadikan.",
    instagram: "@rizkiharya_",
    avatar: rizkiAvatar,
  },
  {
    id: "nabila-putri",
    name: "Nabila Putri",
    role: "Wakil Ketua",
    shortRole: "Wakil Ketua",
    bio: "Setiap gambar adalah jendela ke dunia yang lebih luas. Saya percaya fotografi bisa menginspirasi dan mengubah perspektif.",
    instagram: "@nabilaputri",
    avatar: nabilaAvatar,
  },
  {
    id: "fajar-ramdani",
    name: "Fajar Ramdani",
    role: "Sekretaris",
    shortRole: "Sekretaris",
    bio: "Kamera adalah alat, kreativitas adalah kunci. Saya mendokumentasikan setiap momen dengan penuh makna.",
    instagram: "@fajarramdani",
    avatar: fajarAvatar,
  },
  {
    id: "raihan-fariz",
    name: "Raihan Fariz",
    role: "Bendahara",
    shortRole: "Bendahara",
    bio: "Lewat lensa kamera, saya menemukan keindahan di setiap sudut kehidupan yang sering terlewatkan.",
    instagram: "@raihanfariz",
    avatar: raihanAvatar,
  },
  {
    id: "salsabila-a",
    name: "Salsabila A.",
    role: "Koord. Dokumentasi",
    shortRole: "Koord. Dokumentasi",
    bio: "Dokumentasi bukan sekadar memotret, tapi merekam jiwa dari setiap kegiatan dan kebersamaan.",
    instagram: "@salsabilaa",
    avatar: salsabilaAvatar,
  },
  {
    id: "ikhwan-a",
    name: "Ikhwan A.",
    role: "Divisi Pendidikan",
    shortRole: "Divisi Pendidikan",
    bio: "Pendidikan fotografi adalah investasi terbaik untuk menghasilkan karya yang bermakna dan berdampak.",
    instagram: "@wanmar__",
    avatar: fahriAvatar,
  }
];

const pool = {
  STREET: [street1, street2, street3, street4],
  EVENT: [event1, event2, event3, event4],
  PORTRAIT: [portrait1, portrait2, portrait3, portrait4],
  LANDSCAPE: [landscape1, landscape2, landscape3, landscape4],
  DOKUMENTASI: [dok1, dok2, dok3, dok4]
};

// Ikhwan's real photos with correct genres
const ikhwanPhotos: Photo[] = [
  { id: 'ikhwan-a-street-0', memberId: 'ikhwan-a', category: 'STREET', src: ikhwanStreet1, title: 'STREET by Ikhwan A.' },
  { id: 'ikhwan-a-street-1', memberId: 'ikhwan-a', category: 'STREET', src: ikhwanStreet2, title: 'STREET by Ikhwan A.' },
  { id: 'ikhwan-a-landscape-0', memberId: 'ikhwan-a', category: 'LANDSCAPE', src: ikhwanLandscape1, title: 'LANDSCAPE by Ikhwan A.' },
  { id: 'ikhwan-a-landscape-1', memberId: 'ikhwan-a', category: 'LANDSCAPE', src: ikhwanLandscape2, title: 'LANDSCAPE by Ikhwan A.' },
  { id: 'ikhwan-a-dok-0', memberId: 'ikhwan-a', category: 'DOKUMENTASI', src: ikhwanDok1, title: 'DOKUMENTASI by Ikhwan A.' },
  { id: 'ikhwan-a-event-0', memberId: 'ikhwan-a', category: 'EVENT', src: ikhwanEvent1, title: 'EVENT by Ikhwan A.' },
  { id: 'ikhwan-a-event-1', memberId: 'ikhwan-a', category: 'EVENT', src: ikhwanEvent2, title: 'EVENT by Ikhwan A.' },
  { id: 'ikhwan-a-event-2', memberId: 'ikhwan-a', category: 'EVENT', src: ikhwanEvent3, title: 'EVENT by Ikhwan A.' },
  { id: 'ikhwan-a-event-3', memberId: 'ikhwan-a', category: 'EVENT', src: ikhwanEvent4, title: 'EVENT by Ikhwan A.' },
];

// Generate deterministic photos based on pool mapping (skip Ikhwan — he has real photos)
export const galleryPhotos: Photo[] = [
  ...members
    .filter(member => member.id !== 'ikhwan-a')
    .flatMap((member, memberIdx) => {
      const categories: Array<keyof typeof pool> = ['STREET', 'EVENT', 'PORTRAIT', 'LANDSCAPE', 'DOKUMENTASI'];
      return Array.from({ length: 6 }).map((_, i) => {
        const category = categories[(memberIdx + i) % categories.length];
        const imageSrc = pool[category][(memberIdx + i) % 4];
        return {
          id: `${member.id}-${category.toLowerCase()}-${i}`,
          memberId: member.id,
          category,
          src: imageSrc,
          title: `${category} by ${member.name}`
        };
      });
    }),
  ...ikhwanPhotos,
];
