import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Tentang from '@/pages/Tentang';
import Anggota from '@/pages/Anggota';
import MemberPortfolio from '@/pages/MemberPortfolio';
import Galeri from '@/pages/Galeri';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const queryClient = new QueryClient();

// Scroll to top on route change
function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tentang" component={Tentang} />
        <Route path="/anggota" component={Anggota} />
        <Route path="/anggota/:id" component={MemberPortfolio} />
        <Route path="/galeri" component={Galeri} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <ScrollToTop />
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
