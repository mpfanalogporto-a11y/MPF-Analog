import { useLocation } from 'wouter';
import { LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import MembersManager from '@/components/admin/MembersManager';
import PhotosManager from '@/components/admin/PhotosManager';
import SettingsManager from '@/components/admin/SettingsManager';

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="w-full pt-16 pb-32 min-h-[80vh]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight">DASHBOARD ADMIN</h1>
            <p className="text-foreground/60 mt-1">Kelola anggota, galeri foto, dan teks situs MPF Analog.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-foreground/20 px-4 py-2 rounded-full text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            <LogOut size={16} /> KELUAR
          </button>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList>
            <TabsTrigger value="members">Anggota</TabsTrigger>
            <TabsTrigger value="photos">Galeri Foto</TabsTrigger>
            <TabsTrigger value="settings">Teks Situs</TabsTrigger>
          </TabsList>
          <TabsContent value="members" className="mt-8">
            <MembersManager />
          </TabsContent>
          <TabsContent value="photos" className="mt-8">
            <PhotosManager />
          </TabsContent>
          <TabsContent value="settings" className="mt-8">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
