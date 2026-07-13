import AdminModuleShell from '@/app/components/AdminModuleShell';

export default function AdminPengaturanPage() {
  return (
    <AdminModuleShell
      eyebrow="Pengaturan CMS"
      title="Preferensi Sistem dan Publikasi"
      description="Modul ini disiapkan untuk pengaturan umum CMS seperti identitas desa, status publikasi konten, akun admin, dan pengelolaan file pendukung."
      features={[
        { title: 'Identitas Situs', description: 'Atur nama desa, logo, kontak, dan metadata website publik.' },
        { title: 'Status Publikasi', description: 'Kontrol apakah perubahan konten langsung tampil atau menunggu review.' },
        { title: 'Akses Admin', description: 'Kelola peran admin untuk operator data, editor konten, dan super admin.' },
      ]}
    />
  );
}