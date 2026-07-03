import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  useListMembers,
  useCreateMember,
  useUpdateMember,
  useDeleteMember,
  useRequestUploadUrl,
  type Member,
  type MemberInput,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toStorageUrl } from '@/lib/storage-url';

const EMPTY_FORM: MemberInput = {
  slug: '',
  name: '',
  role: '',
  shortRole: '',
  bio: '',
  instagram: '',
  avatar: '',
  sortOrder: 0,
};

export default function MembersManager() {
  const { data: members = [], isLoading } = useListMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const uploadUrl = useRequestUploadUrl();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MemberInput>(EMPTY_FORM);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setAvatarFile(null);
    setAvatarPreview('');
    setDialogOpen(true);
  };

  const openEdit = (member: Member) => {
    setEditingId(member.id);
    setForm({
      slug: member.slug,
      name: member.name,
      role: member.role,
      shortRole: member.shortRole,
      bio: member.bio,
      instagram: member.instagram,
      avatar: member.avatar,
      sortOrder: member.sortOrder,
    });
    setAvatarFile(null);
    setAvatarPreview(member.avatar);
    setDialogOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let avatarPath = form.avatar;

      if (avatarFile) {
        const res = await uploadUrl.mutateAsync({
          data: {
            name: avatarFile.name,
            size: avatarFile.size,
            contentType: avatarFile.type || 'application/octet-stream',
          },
        });
        await fetch(res.uploadURL, {
          method: 'PUT',
          body: avatarFile,
          headers: { 'Content-Type': avatarFile.type || 'application/octet-stream' },
        });
        avatarPath = toStorageUrl(res.objectPath);
      }

      const payload: MemberInput = { ...form, avatar: avatarPath };

      if (editingId != null) {
        await updateMember.mutateAsync({ id: String(editingId), data: payload });
        toast.success('Anggota berhasil diperbarui');
      } else {
        await createMember.mutateAsync({ data: payload });
        toast.success('Anggota berhasil ditambahkan');
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan anggota');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus anggota ini? Foto miliknya akan tetap ada tapi tidak terhubung.')) return;
    try {
      await deleteMember.mutateAsync({ id: String(id) });
      toast.success('Anggota dihapus');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus anggota');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Tambah Anggota
        </Button>
      </div>

      <div className="border border-foreground/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Instagram</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-foreground/50 py-8">
                  Memuat...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && members.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-foreground/50 py-8">
                  Belum ada anggota.
                </TableCell>
              </TableRow>
            )}
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover bg-foreground/5"
                  />
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>{member.instagram}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(member)}>
                      <Pencil size={16} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(member.id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId != null ? 'Edit Anggota' : 'Tambah Anggota'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img
                src={avatarPreview || 'https://placehold.co/80x80?text=Foto'}
                alt="Preview"
                className="w-16 h-16 rounded-full object-cover bg-foreground/5"
              />
              <Input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nama</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="nama-anggota"
                />
              </div>
              <div>
                <Label>Jabatan Lengkap</Label>
                <Input
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </div>
              <div>
                <Label>Jabatan Singkat</Label>
                <Input
                  required
                  value={form.shortRole}
                  onChange={(e) => setForm({ ...form, shortRole: e.target.value })}
                />
              </div>
              <div>
                <Label>Instagram</Label>
                <Input
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label>Urutan</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                required
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
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
