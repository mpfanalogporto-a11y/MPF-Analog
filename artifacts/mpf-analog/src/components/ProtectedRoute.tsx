import { type ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/lib/auth-context';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center text-foreground/50 tracking-widest text-sm">
        MEMUAT...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}
