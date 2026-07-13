import AdminModuleShell from '@/app/components/AdminModuleShell';

export default function AdminKependudukanPage() {
  return (
    <AdminModuleShell
      eyebrow="Modul Kependudukan"
      title="Kelola Kependudukan"
      description="Modul ini menampung data KK, RT/RW, sebaran dusun, dan kategori umur penduduk. Strukturnya disiapkan sebagai pusat data inti yang nanti menyuplai statistik dan layanan administrasi."
      features={[
        { title: 'Data KK', description: 'Perbarui jumlah kepala keluarga dan distribusinya per dusun.' },
        { title: 'RT / RW', description: 'Kelola struktur wilayah administratif terkecil untuk kebutuhan layanan.' },
        { title: 'Sebaran Dusun', description: 'Pastikan total penduduk per dusun selalu sinkron dengan laporan statistik.' },
      ]}
    />
  );
}
