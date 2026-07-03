import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'wouter';
import { ArrowLeft, Instagram } from 'lucide-react';
import { useGetMember, useListPhotos } from '@workspace/api-client-react';
import PhotoGrid from '@/components/PhotoGrid';
import NotFound from '@/pages/not-found';

const CATEGORIES = ['SEMUA', 'STREET', 'EVENT', 'PORTRAIT', 'LANDSCAPE', 'DOKUMENTASI'];

export default function MemberPortfolio() {
  const params = useParams();
  const id = params.id ?? '';

  const { data: member, isLoading, isError } = useGetMember(id);
  const { data: allPhotos = [] } = useListPhotos();

  const [activeTab, setActiveTab] = useState('SEMUA');
  const [visibleCount, setVisibleCount] = useState(12);

  const memberPhotos = useMemo(
    () => allPhotos.filter((p) => p.memberId === member?.id),
    [allPhotos, member?.id],
  );

  const filteredPhotos = useMemo(() => {
    if (activeTab === 'SEMUA') return memberPhotos;
    return memberPhotos.filter((p) => p.category === activeTab);
  }, [activeTab, memberPhotos]);

  const displayedPhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center text-foreground/50 tracking-widest text-sm">
        MEMUAT...
      </div>
    );
  }

  if (isError || !member) {
    return <NotFound />;
  }

  return (
    <div className="w-full pt-16 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Back Button */}
        <Link href="/anggota" className="inline-flex items-center gap-2 text-sm font-medium tracking-widest text-foreground/60 hover:text-foreground mb-12 transition-colors">
          <ArrowLeft size={16} /> KEMBALI
        </Link>

        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-start mb-24"
        >
          <div className="w-48 md:w-64 aspect-[4/5] shrink-0 rounded-2xl overflow-hidden shadow-xl border border-foreground/10 bg-foreground/5">
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left pt-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-2">{member.name}</h1>
            <p className="text-lg tracking-widest text-foreground/60 uppercase font-medium mb-8">{member.role}</p>
            
            <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-foreground/90 max-w-2xl mb-8">
              "{member.bio}"
            </p>
            
            {member.instagram && (
              <a href={`https://instagram.com/${member.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-foreground/80 transition-colors">
                <Instagram size={18} /> {member.instagram}
              </a>
            )}
          </div>
        </motion.div>

        <div className="h-px w-full bg-foreground/10 mb-20" />

        {/* Gallery Section */}
        <div className="mb-32">
          <h2 className="font-serif text-3xl font-bold tracking-tight mb-10 text-center">GALERI FOTO</h2>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveTab(category);
                  setVisibleCount(12);
                }}
                className={`relative px-5 py-2 text-sm font-medium tracking-widest transition-colors rounded-full ${
                  activeTab === category ? 'text-background' : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                }`}
              >
                {activeTab === category && (
                  <motion.div 
                    layoutId="member-active-tab"
                    className="absolute inset-0 bg-foreground rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {category}
              </button>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {displayedPhotos.length > 0 ? (
                <PhotoGrid photos={displayedPhotos} />
              ) : (
                <div className="text-center py-20 text-foreground/50 font-medium tracking-widest">
                  BELUM ADA FOTO DI KATEGORI INI
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Load More */}
          {hasMore && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="border border-foreground/30 px-8 py-3 rounded-full font-medium tracking-widest text-sm hover:border-foreground hover:bg-foreground/5 transition-all active:scale-95"
              >
                LOAD MORE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
