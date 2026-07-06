import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { useListMembers } from '@workspace/api-client-react';

const BIDANG_LIST = [
  { label: 'Semua', value: 'semua' },
  { label: 'Pengurus Inti', value: 'inti' },
  { label: 'PPO', value: 'PPO' },
  { label: 'Pendidikan', value: 'Pendidikan' },
  { label: 'Multimedia', value: 'Multimedia' },
  { label: 'Pameran Foto', value: 'Pameran Foto' },
  { label: 'Inventaris', value: 'Inventaris' },
  { label: 'Humas', value: 'Humas' },
];

function getBidang(role: string): string {
  if (role.includes('PPO')) return 'PPO';
  if (role.includes('Pendidikan')) return 'Pendidikan';
  if (role.includes('Multimedia')) return 'Multimedia';
  if (role.includes('Pameran Foto')) return 'Pameran Foto';
  if (role.includes('Inventaris')) return 'Inventaris';
  if (role.includes('Humas')) return 'Humas';
  return 'inti';
}

export default function Anggota() {
  const { data: members = [] } = useListMembers();
  const [active, setActive] = useState('semua');

  const filtered = useMemo(() => {
    if (active === 'semua') return members;
    return members.filter(m => getBidang(m.role) === active);
  }, [members, active]);

  return (
    <div className="w-full pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            ANGGOTA
          </h1>
          <p className="text-foreground/70 max-w-xl mx-auto text-lg">
            Klik salah satu anggota untuk melihat galeri hasil karyanya.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {BIDANG_LIST.map(b => (
            <button
              key={b.value}
              onClick={() => setActive(b.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-200 border ${
                active === b.value
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground/50 hover:text-foreground'
              }`}
            >
              {b.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={active}
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto"
          >
            {filtered.map((member, idx) => (
              <Link key={member.id} href={`/anggota/${member.slug}`}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="group cursor-pointer bg-card rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(44,24,16,0.1)] transition-all duration-500 border border-foreground/5 hover:border-foreground/20 hover:-translate-y-2"
                >
                  <div className="aspect-[4/5] overflow-hidden relative bg-foreground/5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                      <p className="text-sm tracking-widest text-foreground/80 uppercase font-medium">{member.role}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-foreground/40 mt-16 text-lg"
          >
            Tidak ada anggota ditemukan.
          </motion.p>
        )}
      </div>
    </div>
  );
}
