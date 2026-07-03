import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  useGetAuthStatus,
  useAdminLogin,
  useAdminLogout,
} from '@workspace/api-client-react';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<void>;
  loginError: string | null;
  isLoggingIn: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, refetch } = useGetAuthStatus({
    query: { retry: false, queryKey: ['/api/auth/me'] },
  });
  const loginMutation = useAdminLogin();
  const logoutMutation = useAdminLogout();

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(data?.authenticated),
      isLoading,
      login: async (password: string) => {
        await loginMutation.mutateAsync({ data: { password } });
        await refetch();
      },
      loginError: loginMutation.error
        ? loginMutation.error instanceof Error
          ? loginMutation.error.message
          : 'Gagal masuk'
        : null,
      isLoggingIn: loginMutation.isPending,
      logout: () => {
        logoutMutation.mutate(undefined, {
          onSettled: () => refetch(),
        });
      },
    }),
    [data, isLoading, loginMutation, logoutMutation, refetch],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
