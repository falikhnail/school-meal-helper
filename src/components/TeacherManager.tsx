import { useState } from 'react';
import { Plus, Trash2, UserCircle, GraduationCap, Stethoscope, Users2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Teacher, TeacherRole, ROLE_LABELS } from '@/types/meal';
import { toast } from 'sonner';

interface TeacherManagerProps {
  teachers: Teacher[];
  addTeacher: (name: string, role: TeacherRole) => Promise<Teacher | null>;
  removeTeacher: (id: string) => Promise<void>;
}

const getRoleIcon = (role: TeacherRole) => {
  switch (role) {
    case 'kepala_sekolah':
      return <GraduationCap className="w-4 h-4 text-accent-foreground" />;
    case 'guru':
      return <UserCircle className="w-4 h-4 text-primary" />;
    case 'tendik':
      return <Users2 className="w-4 h-4 text-blue-500" />;
    case 'nakes':
      return <Stethoscope className="w-4 h-4 text-red-500" />;
    case 'kepala_komite':
      return <Crown className="w-4 h-4 text-amber-500" />;
  }
};

const getRoleBgColor = (role: TeacherRole) => {
  switch (role) {
    case 'kepala_sekolah':
      return 'bg-accent/20';
    case 'guru':
      return 'bg-primary/10';
    case 'tendik':
      return 'bg-blue-500/10';
    case 'nakes':
      return 'bg-red-500/10';
    case 'kepala_komite':
      return 'bg-amber-500/10';
  }
};

export function TeacherManager({ teachers, addTeacher, removeTeacher }: TeacherManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<TeacherRole>('guru');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama guru tidak boleh kosong');
      return;
    }
    const result = await addTeacher(name.trim(), role);
    if (result) {
      toast.success(`${name} berhasil ditambahkan`);
      setName('');
      setRole('guru');
      setIsOpen(false);
    }
  };

  const handleRemove = async (teacher: Teacher) => {
    await removeTeacher(teacher.id);
    toast.success(`${teacher.name} berhasil dihapus`);
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Daftar Guru
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" />
                Tambah Guru
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Tambah Guru Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Nama</label>
                  <Input
                    placeholder="Masukkan nama guru"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Keterangan</label>
                  <Select value={role} onValueChange={(v) => setRole(v as TeacherRole)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="kepala_sekolah">
                        <span className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          Kepala Sekolah
                        </span>
                      </SelectItem>
                      <SelectItem value="guru">
                        <span className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4" />
                          Guru
                        </span>
                      </SelectItem>
                      <SelectItem value="tendik">
                        <span className="flex items-center gap-2">
                          <Users2 className="w-4 h-4" />
                          Tendik
                        </span>
                      </SelectItem>
                      <SelectItem value="nakes">
                        <span className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          Nakes
                        </span>
                      </SelectItem>
                      <SelectItem value="kepala_komite">
                        <span className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          Kepala Komite
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                  Simpan
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {teachers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <UserCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Belum ada data guru</p>
            <p className="text-sm">Klik tombol "Tambah Guru" untuk menambahkan</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {teachers.map((teacher, index) => (
              <div
                key={teacher.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getRoleBgColor(teacher.role)}`}>
                    {getRoleIcon(teacher.role)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ROLE_LABELS[teacher.role]}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(teacher)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
