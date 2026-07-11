import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import SectionHeader from '@/app/components/SectionHeader';

const sejarahMilestones = [
  { year: '1982', event: 'Pembentukan Desa Jadimulya berdasarkan SK Bupati Cirebon.' },
  { year: '1993', event: 'Pembangunan kantor desa dan balai warga pertama selesai.' },
  { year: '2010', event: 'Program Pemberdayaan UMKM lokal mulai digalakkan.' },
  { year: '2020', event: 'Peluncuran layanan digital desa untuk surat dan informasi.' },
];

export default function SejarahPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader title="Sejarah Desa" subtitle="Jejak perkembangan Desa Jadimulya dari awal terbentuk hingga hari ini." />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Asal Usul Desa</h3>
            <p className="mt-4 text-slate-600 leading-7">
              Desa Jadimulya tumbuh dari pemekaran wilayah Desa sebelumnya dengan semangat gotong royong dan kemandirian.
              Sejak berdiri, desa ini melangkah bersama warga untuk membangun infrastruktur, pendidikan, dan ekonomi lokal.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              Saat ini, desa memprioritaskan pelayanan publik yang transparan serta dukungan bagi masyarakat yang ingin berwirausaha dan mengembangkan potensi desa.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Momen Penting</h3>
            <div className="mt-6 space-y-4">
              {sejarahMilestones.map((item) => (
                <div key={item.year} className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm uppercase tracking-[0.28em] text-emerald-600">{item.year}</p>
                  <p className="mt-2 text-slate-700">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
