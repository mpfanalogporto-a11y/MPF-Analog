import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryPhotos } from '@/lib/data';
import PhotoGrid from '@/components/PhotoGrid';

const CATEGORIES = ['SEMUA', 'STREET', 'EVENT', 'PORTRAIT', 'LANDSCAPE', 'DOKUMENTASI'];

export default function Galeri() {
  const [activeTab, setActiveTab] = useState('SEMUA');
  const [visibleCount, setVisibleCount] = useState(15);

  const filteredPhotos = useMemo(() => {
    // Shuffle photos slightly for the "SEMUA" tab so it's not strictly grouped by member
    const photos = activeTab === 'SEMUA' 
      ? [...galleryPhotos].sort(() => Math.random() - 0.5)
      : galleryPhotos.filter(p => p.category === activeTab);
    return photos;
  }, [activeTab]);

  const displayedPhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPhotos.length;

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
            GALERI FOTO
          </h1>
          <p className="text-foreground/70 max-w-xl mx-auto text-lg">
            Kumpulan karya visual dari seluruh anggota MPF Analog.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveTab(category);
                setVisibleCount(15); // Reset count on tab change
              }}
              className={`relative px-6 py-2.5 text-sm font-medium tracking-widest transition-colors rounded-full ${
                activeTab === category ? 'text-background' : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              {activeTab === category && (
                <motion.div 
                  layoutId="gallery-active-tab"
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
            className="min-h-[500px]"
          >
            {displayedPhotos.length > 0 ? (
              <PhotoGrid photos={displayedPhotos} />
            ) : (
              <div className="text-center py-32 text-foreground/50 font-medium tracking-widest">
                BELUM ADA FOTO DI KATEGORI INI
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Load More */}
        {hasMore && (
          <div className="mt-20 flex justify-center">
            <button 
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="border border-foreground/30 px-10 py-4 rounded-full font-medium tracking-widest text-sm hover:border-foreground hover:bg-foreground/5 transition-all active:scale-95"
            >
              LOAD MORE
            </button>
          </div>
        )}

      </div>
    </div>
  );
}