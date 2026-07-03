import { useState } from 'react';
import { motion } from 'framer-motion';
import { Photo } from '@/lib/data';

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {photos.map((photo, idx) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ duration: 0.5, delay: (idx % 6) * 0.1 }}
          className="relative break-inside-avoid group cursor-pointer"
        >
          <div className={`overflow-hidden rounded-md bg-foreground/5 ${!loaded[photo.id] ? 'animate-pulse min-h-[300px]' : ''}`}>
            <img
              src={photo.src}
              alt={photo.title}
              loading="lazy"
              onLoad={() => setLoaded(prev => ({ ...prev, [photo.id]: true }))}
              className={`w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 ${loaded[photo.id] ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
          
          <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex flex-col justify-end p-6">
            <p className="text-background font-medium tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {photo.title}
            </p>
            <p className="text-background/70 text-xs tracking-widest uppercase mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              {photo.category}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}