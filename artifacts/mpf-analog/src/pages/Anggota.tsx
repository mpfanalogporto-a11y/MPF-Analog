import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useListMembers } from '@workspace/api-client-react';

export default function Anggota() {
  const { data: members = [] } = useListMembers();

  return (
    <div className="w-full pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            ANGGOTA
          </h1>
          <p className="text-foreground/70 max-w-xl mx-auto text-lg">
            Klik salah satu anggota untuk melihat galeri hasil karyanya.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
          {members.map((member, idx) => (
            <Link key={member.id} href={`/anggota/${member.slug}`}>
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group cursor-pointer bg-card rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(44,24,16,0.1)] transition-all duration-500 border border-foreground/5 hover:border-foreground/20 hover:-translate-y-2"
              >
                <div className="aspect-[4/5] overflow-hidden relative bg-foreground/5">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm tracking-widest text-foreground/80 uppercase font-medium">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
