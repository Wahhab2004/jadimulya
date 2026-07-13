import AdminModuleShell from '@/app/components/AdminModuleShell';

export default function AdminOrganisasiPage() {
  return (
    <AdminModuleShell
      eyebrow="Modul Organisasi"
      title="Kelola Struktur Organisasi"
      description="Tambahkan, ubah, atau hapus data perangkat desa, jabatan, foto profil, dan informasi kontak. Modul ini menjadi sumber utama untuk halaman struktur organisasi publik."
      features={[
        { title: 'Data Aparatur', description: 'Kelola nama, jabatan, dan kontak perangkat desa dalam satu alur.' },
        { title: 'Urutan Jabatan', description: 'Atur hirarki tampilan organisasi agar sesuai struktur pemerintahan desa.' },
        { title: 'Media Profil', description: 'Siapkan ruang untuk foto aparatur dan detail informasi pendukung.' },
      ]}
    />
  );
}
