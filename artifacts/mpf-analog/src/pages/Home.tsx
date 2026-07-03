import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Film, Lightbulb, Users } from 'lucide-react';
import heroImg from '@/assets/hero.jpg';
import { members, galleryPhotos } from '@/lib/data';
import PhotoGrid from '@/components/PhotoGrid';

export default function Home() {
  const previewPhotos = galleryPhotos.slice(0, 8);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="MPF Analog Team" 
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
              MPF ANALOG
            </h1>
            <div className="h-px w-24 bg-foreground/50 mx-auto mb-6" />
            <h2 className="text-lg md:text-xl tracking-widest mb-6 font-medium">
              PHOTOGRAPHY & FILM / UMJ
            </h2>
            <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              Menginspirasi, berkarya, dan berkontribusi melalui fotografi dan film. Merekam setiap momen menjadi cerita yang abadi.
            </p>
            <Link href="/galeri" className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-medium tracking-widest text-sm hover:bg-foreground/90 transition-colors group">
              LIHAT GALERI
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-24 border-b border-foreground/10 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: <Camera size={32} />, title: 'FOTOGRAFI', desc: 'Menangkap momen yang tak terulang dengan teknik dan rasa.' },
              { icon: <Film size={32} />, title: 'FILM', desc: 'Bercerita lewat gambar bergerak dan suara yang menggugah.' },
              { icon: <Lightbulb size={32} />, title: 'KREATIVITAS', desc: 'Wadah eksplorasi ide tanpa batas bagi setiap anggota.' },
              { icon: <Users size={32} />, title: 'KOLABORASI', desc: 'Bekerjasama menciptakan karya visual yang berdampak.' }
            ].map((feature, idx) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full border border-foreground flex items-center justify-center text-foreground mb-2">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-bold tracking-widest">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Preview */}
      <section className="py-24 border-b border-foreground/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="font-serif text-4xl font-bold tracking-tight mb-4">Tim Kami</h2>
              <p className="text-foreground/70 max-w-lg">Mengenal lebih dekat para penggerak di balik setiap karya MPF Analog.</p>
            </div>
            <Link href="/anggota" className="text-sm font-medium tracking-widest border-b border-foreground pb-1 hover:text-foreground/70 transition-colors uppercase">
              Lihat Semua Anggota
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {members.map((member, idx) => (
              <Link key={member.id} href={`/anggota/${member.id}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group cursor-pointer flex flex-col gap-4"
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-lg bg-foreground/5 relative">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-serif font-bold text-lg">{member.name}</h4>
                    <p className="text-xs tracking-widest text-foreground/60 uppercase">{member.shortRole}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8 mb-12 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-tight mb-4">Karya Pilihan</h2>
          <p className="text-foreground/70 max-w-lg mx-auto">Sebagian kecil dari apa yang kami lihat dari balik lensa.</p>
        </div>
        
        <div className="px-4">
          <PhotoGrid photos={previewPhotos} />
        </div>
        
        <div className="mt-16 flex justify-center">
          <Link href="/galeri" className="inline-block border border-foreground px-8 py-3 rounded-full font-medium tracking-widest text-sm hover:bg-foreground hover:text-background transition-colors">
            JELAJAHI GALERI
          </Link>
        </div>
      </section>
    </div>
  );
}