import { motion } from 'framer-motion';

export default function Tentang() {
  return (
    <div className="w-full min-h-[80vh] flex items-center pt-24 pb-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tighter mb-12">
              TENTANG KAMI
            </h1>
            
            <div className="prose prose-lg md:prose-xl mx-auto text-foreground/80 leading-relaxed">
              <p className="font-serif text-2xl md:text-3xl text-foreground font-medium italic mb-10 leading-snug">
                "MPF Analog (Mikamones Photography Film) adalah organisasi fotografi dan film di Universitas Muhammadiyah Jakarta yang berfokus pada dokumentasi kegiatan, pengembangan kreativitas, serta kolaborasi dalam karya visual."
              </p>
              
              <div className="h-px w-32 bg-foreground/20 mx-auto my-12" />
              
              <p className="mb-6">
                Kami percaya bahwa setiap jepretan kamera bukan hanya sekadar merekam cahaya, melainkan membekukan waktu, emosi, dan cerita. Melalui wadah ini, kami belajar melihat dunia dengan lebih peka dan merangkainya menjadi memori yang abadi.
              </p>
              <p>
                Berakar dari kecintaan pada estetika analog dan sinematik, kami terus mengeksplorasi batas-batas medium visual, saling mendukung satu sama lain, dan berkontribusi mendokumentasikan perjalanan komunitas di sekitar kami.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}