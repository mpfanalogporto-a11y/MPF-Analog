import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Instagram, Youtube, Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '@/assets/logo.jpg';

export default function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'TENTANG', href: '/tentang' },
    { name: 'ANGGOTA', href: '/anggota' },
    { name: 'GALERI', href: '/galeri' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src={logoImg} alt="MPF Analog Logo" className="w-10 h-10 rounded-full object-cover transition-transform group-hover:rotate-12" />
            <span className="font-serif font-bold text-xl tracking-wider">MPF ANALOG</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link key={link.name} href={link.href} className="relative group text-sm font-medium tracking-widest text-foreground/80 hover:text-foreground transition-colors">
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-foreground"
                    />
                  )}
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-50" />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Nav Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-6 right-6 p-2 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-3xl font-medium tracking-widest text-foreground hover:opacity-70 transition-opacity"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10 py-16 mt-20">
        <div className="container mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center">
          <img src={logoImg} alt="MPF Analog Logo" className="w-16 h-16 rounded-full object-cover mb-6" />
          <h2 className="font-serif text-2xl font-bold tracking-widest mb-2">MPF ANALOG</h2>
          <p className="text-sm text-foreground/70 mb-8 max-w-md mx-auto leading-relaxed">
            Organisasi Fotografi<br/>
            Universitas Muhammadiyah Jakarta
          </p>
          
          <div className="flex items-center gap-6 mb-12">
            <a href="#" className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors">
              <Youtube size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors">
              <Mail size={18} />
            </a>
          </div>
          
          <p className="text-xs text-foreground/50 tracking-wider">
            &copy; {new Date().getFullYear()} MPF ANALOG. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}