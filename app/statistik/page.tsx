import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import SectionHeader from '@/app/components/SectionHeader';
import StatGrid from '@/app/components/StatGrid';

const statistikSummary = [
  { label: 'Total Penduduk', value: '4,281' },
  { label: 'Permohonan Surat', value: '148' },
  { label: 'PAD Desa', value: 'Rp42.5jt' },
  { label: 'Aduan Warga Baru', value: '7' },
];

const ageGroups = [
  { label: '0-4', value: 320 },
  { label: '5-14', value: 540 },
  { label: '15-24', value: 740 },
  { label: '25-34', value: 820 },
  { label: '35-44', value: 690 },
  { label: '45-54', value: 520 },
  { label: '55-64', value: 340 },
  { label: '65+', value: 210 },
];

const dataDusun = [
  { name: 'Dusun Krajan', kk: 342, male: 612, female: 630, total: 1242 },
  { name: 'Dusun Mekarsari', kk: 288, male: 524, female: 541, total: 1065 },
  { name: 'Dusun Sukamaju', kk: 310, male: 568, female: 582, total: 1150 },
  { name: 'Dusun Tanjung', kk: 202, male: 410, female: 414, total: 824 },
];

function ChartPlaceholder() {
  return <div className="h-72 rounded-[2rem] border border-slate-200 bg-slate-50 text-center text-slate-500">Grafik akan ditambahkan di pengembangan berikutnya.</div>;
}

export default function StatistikPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader title="Ringkasan Statistik" subtitle="Update terakhir: 24 Mei 2024, 09:41 WIB" />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {statistikSummary.map((item) => (
            <div key={item.label} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">{item.label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.75fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Visualisasi Data Kependudukan</h3>
                <p className="mt-2 text-sm text-slate-500">Akses transparan terhadap statistik demografi Desa Jadimulya tahun 2024.</p>
              </div>
              <div className="inline-flex rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-700">Bulanan</div>
            </div>
            <ChartPlaceholder />
          </div>
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</h3>
              <ul className="mt-4 space-y-4 text-slate-600">
                <li className="rounded-3xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Bpk. Sumarno baru saja menyelesaikan pendaftaran KTP Elektronik.</p>
                  <p className="mt-2 text-sm">12 menit yang lalu</p>
                </li>
                <li className="rounded-3xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Surat Keterangan Usaha Ibu Siti ditandatangani digital oleh Kades.</p>
                  <p className="mt-2 text-sm">45 menit yang lalu</p>
                </li>
                <li className="rounded-3xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">Aduan warga: Kerusakan Lampu Jalan RT 04 masuk ke sistem.</p>
                  <p className="mt-2 text-sm">2 jam yang lalu</p>
                </li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Rincian Data Penduduk per Dusun</h3>
              <div className="mt-5 overflow-hidden rounded-[2rem] border border-slate-200">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-4">Nama Dusun</th>
                      <th className="px-4 py-4">Jumlah KK</th>
                      <th className="px-4 py-4">Laki-laki</th>
                      <th className="px-4 py-4">Perempuan</th>
                      <th className="px-4 py-4">Total Jiwa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataDusun.map((dusun) => (
                      <tr key={dusun.name} className="border-t border-slate-200 last:border-b bg-white">
                        <td className="px-4 py-4 font-semibold text-slate-900">{dusun.name}</td>
                        <td className="px-4 py-4 text-slate-700">{dusun.kk}</td>
                        <td className="px-4 py-4 text-slate-700">{dusun.male}</td>
                        <td className="px-4 py-4 text-slate-700">{dusun.female}</td>
                        <td className="px-4 py-4 font-semibold text-slate-900">{dusun.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
