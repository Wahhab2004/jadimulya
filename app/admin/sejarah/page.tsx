import AdminModuleShell from '@/app/components/AdminModuleShell';

export default function AdminSejarahPage() {
  return (
    <AdminModuleShell
      eyebrow="Modul Sejarah"
      title="Kelola Sejarah Desa"
      description="Edit narasi sejarah, judul hero, milestone perkembangan wilayah, dan data kepala desa dari masa ke masa. Modul ini menjaga agar halaman sejarah publik tetap akurat dan mudah diperbarui."
      features={[
        { title: 'Narasi Utama', description: 'Atur headline dan ringkasan sejarah agar tetap kuat dan informatif.' },
        { title: 'Milestone Wilayah', description: 'Perbarui fase pembentukan, pemekaran, dan perkembangan desa.' },
        { title: 'Arsip Kepemimpinan', description: 'Kelola daftar kepala desa dan keterangan masa jabatan secara rapi.' },
      ]}
    />
  );
}
