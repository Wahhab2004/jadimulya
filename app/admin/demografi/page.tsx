import AdminModuleShell from '@/app/components/AdminModuleShell';

export default function AdminDemografiPage() {
  return (
    <AdminModuleShell
      eyebrow="Modul Demografi"
      title="Kelola Demografi"
      description="Update ringkasan data demografi, komposisi umur, gender, dan indikator pendidikan masyarakat. Modul ini menjadi sumber penting untuk insight publik dan analisis internal desa."
      features={[
        { title: 'Komposisi Usia', description: 'Atur distribusi kelompok umur agar visualisasi statistik selalu relevan.' },
        { title: 'Rasio Gender', description: 'Kelola data perbandingan laki-laki dan perempuan untuk pelaporan desa.' },
        { title: 'Indikator Pendidikan', description: 'Perbarui capaian pendidikan terakhir warga untuk evaluasi program.' },
      ]}
    />
  );
}
