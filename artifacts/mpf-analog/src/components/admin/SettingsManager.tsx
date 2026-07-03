import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useGetSettings, useUpdateSettings } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const FIELDS: Array<{ key: string; label: string; multiline?: boolean; placeholder?: string }> = [
  { key: 'site_title', label: 'Judul Situs (Hero)', placeholder: 'MPF ANALOG' },
  { key: 'site_tagline', label: 'Tagline', placeholder: 'MAHASISWA PENCINTA FOTOGRAFI' },
  { key: 'hero_description', label: 'Deskripsi Hero', multiline: true },
  { key: 'about_quote', label: 'Kutipan "Tentang Kami"', multiline: true },
  { key: 'about_paragraph_1', label: 'Paragraf 1 "Tentang Kami"', multiline: true },
  { key: 'about_paragraph_2', label: 'Paragraf 2 "Tentang Kami"', multiline: true },
];

export default function SettingsManager() {
  const { data: settings = {}, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync({ data: form });
      toast.success('Teks situs berhasil diperbarui');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-foreground/50 text-center py-8">Memuat...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-6">
      {FIELDS.map((field) => (
        <div key={field.key}>
          <Label>{field.label}</Label>
          {field.multiline ? (
            <Textarea
              rows={3}
              value={form[field.key] ?? ''}
              placeholder={field.placeholder}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          ) : (
            <Input
              value={form[field.key] ?? ''}
              placeholder={field.placeholder}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          )}
        </div>
      ))}
      <div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
