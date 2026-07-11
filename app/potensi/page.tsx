import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import SectionHeader from '@/app/components/SectionHeader';

const potensiItems = [
  { id: '1', title: 'Pertanian Ramah Lingkungan', description: 'Pengembangan tanaman padi dan sayuran organik dengan irigasi sederhana.', category: 'Pertanian' },
  { id: '2', title: 'UMKM Olahan Kedelai', description: 'Produk tahu tempe, keripik, dan minuman tradisional untuk pasar lokal.', category: 'UMKM' },
  { id: '3', title: 'Wisata Edukasi Desa', description: 'Rute edukasi pertanian dan kerajinan tangan untuk kunjungan keluarga.', category: 'Wisata' },
  { id: '4', title: 'Komunitas Tenun Tradisional', description: 'Pelatihan dan pemasaran kain tenun khas Desa Jadimulya.', category: 'Lainnya' },
];

const categoryStyles: Record<string, string> = {
  UMKM: 'bg-amber-100 text-amber-700',
  Pertanian: 'bg-emerald-100 text-emerald-700',
  Wisata: 'bg-sky-100 text-sky-700',
  Lainnya: 'bg-violet-100 text-violet-700',
};

export default function PotensiPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader title="Potensi Desa" subtitle="Intisari potensi ekonomi, wisata, dan pemberdayaan masyarakat Desa Jadimulya." />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Fokus Pengembangan</h3>
            <p className="mt-4 text-slate-600 leading-7">
              Desa Jadimulya fokus pada penguatan sektor pertanian berkelanjutan, dukungan UMKM lokal, serta pengembangan wisata desa yang mempertahankan kekayaan budaya dan lingkungan.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {potensiItems.map((item) => (
                <div key={item.id} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] shadow-sm shadow-slate-200 ${categoryStyles[item.category]}`}>
                    {item.category}
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-3 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Program Prioritas</h3>
            <ul className="mt-6 space-y-4 text-slate-600">
              <li className="rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Pelatihan UMKM digital</p>
                <p className="mt-2 text-sm">Memberikan pendampingan pemasaran online bagi kelompok usaha warga.</p>
              </li>
              <li className="rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Pendampingan pertanian organik</p>
                <p className="mt-2 text-sm">Optimalisasi hasil panen melalui teknik ramah lingkungan.</p>
              </li>
              <li className="rounded-3xl bg-slate-50 p-5">
                <p className="font-semibold text-slate-900">Rute wisata budaya</p>
                <p className="mt-2 text-sm">Menonjolkan desa sebagai tujuan edukasi dengan pengalaman lokal.</p>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
