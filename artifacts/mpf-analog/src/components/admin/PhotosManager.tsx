import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  useListPhotos,
  useListMembers,
  useCreatePhoto,
  useUpdatePhoto,
  useDeletePhoto,
  useRequestUploadUrl,
  type Photo,
  type PhotoInput,
} from '@workspace/api-client-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toStorageUrl } from '@/lib/storage-url';

const CATEGORIES = ['STREET', 'EVENT', 'PORTRAIT', 'LANDSCAPE', 'DOKUMENTASI'];

const EMPTY_FORM: PhotoInput = {
  memberId: null,
  category: 'STREET',
  src: '',
  title: '',
  sortOrder: 0,
};

export default function PhotosManager() {
  const { data: photos = [], isLoading } = useListPhotos();
  const { data: members = [] } = useListMembers();
  const createPhoto = useCreatePhoto();
  const updatePhoto = useUpdatePhoto();
  const deletePhoto = useDeletePhoto();
  const uploadUrl = useRequestUploadUrl();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PhotoInput>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const memberName = (id?: number | null) => members.find((m) => m.id === id)?.name ?? '—';

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview('');
    setDialogOpen(true);
  };

  const openEdit = (photo: Photo) => {
    setEditingId(photo.id);
    setForm({
      memberId: photo.memberId ?? null,
      category: photo.category,
      src: photo.src,
      title: photo.title,
      sortOrder: photo.sortOrder,
    });
    setPhotoFile(null);
    setPhotoPreview(photo.src);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoFile && !form.src) {
      toast.error('Pilih foto untuk diunggah');
      return;
    }
    setIsSaving(true);
    try {
      let srcPath = form.src;

      if (photoFile) {
        const res = await uploadUrl.mutateAsync({
          data: {
            name: photoFile.name,
            size: photoFile.size,
            contentType: photoFile.type || 'application/octet-stream',
          },
        });
        await fetch(res.uploadURL, {
          method: 'PUT',
          body: photoFile,
          headers: { 'Content-Type': photoFile.type || 'application/octet-stream' },
        });
        srcPath = toStorageUrl(res.objectPath);
      }

      const payload: PhotoInput = { ...form, src: srcPath };

      if (editingId != null) {
        await updatePhoto.mutateAsync({ id: String(editingId), data: payload });
        toast.success('Foto berhasil diperbarui');
      } else {
        await createPhoto.mutateAsync({ data: payload });
        toast.success('Foto berhasil ditambahkan');
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan foto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await deletePhoto.mutateAsync({ id: String(id) });
      toast.success('Foto dihapus');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus foto');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Tambah Foto
        </Button>
      </div>

      {isLoading && <p className="text-foreground/50 text-center py-8">Memuat...</p>}
      {!isLoading && photos.length === 0 && (
        <p className="text-foreground/50 text-center py-8">Belum ada foto.</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative rounded-lg overflow-hidden border border-foreground/10 bg-foreground/5">
            <img src={photo.src} alt={photo.title} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
              <p className="text-xs font-medium">{photo.title}</p>
              <p className="text-[10px] text-foreground/60 uppercase tracking-widest">{photo.category} · {memberName(photo.memberId)}</p>
              <div className="flex gap-2 mt-1">
                <Button size="icon" variant="secondary" onClick={() => openEdit(photo)}>
                  <Pencil size={14} />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(photo.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId != null ? 'Edit Foto' : 'Tambah Foto'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={photoPreview || 'https://placehold.co/80x80?text=Foto'}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover bg-foreground/5"
              />
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div>
              <Label>Judul</Label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Kategori</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Anggota</Label>
                <Select
                  value={form.memberId != null ? String(form.memberId) : 'none'}
                  onValueChange={(value) =>
                    setForm({ ...form, memberId: value === 'none' ? null : Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa anggota</SelectItem>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Urutan</Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
