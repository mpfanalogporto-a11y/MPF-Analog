import { useEffect, useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading, login, loginError, isLoggingIn } = useAuth();
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/admin');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(password);
      navigate('/admin');
    } catch {
      // error surfaced via loginError
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center px-4 pt-16 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-card border border-foreground/10 rounded-2xl p-8 shadow-lg"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full border border-foreground/20 flex items-center justify-center mb-4">
            <Lock size={22} />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">ADMIN MPF ANALOG</h1>
          <p className="text-sm text-foreground/60 mt-2">Masuk untuk mengelola konten website.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Kata sandi admin"
            className="w-full px-4 py-3 rounded-lg border border-foreground/20 bg-background focus:outline-none focus:border-foreground/60 transition-colors"
          />
          {loginError && (
            <p className="text-sm text-red-500 text-center">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={isLoggingIn || password.length === 0}
            className="w-full bg-foreground text-background py-3 rounded-lg font-medium tracking-widest text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? 'MEMPROSES...' : 'MASUK'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
