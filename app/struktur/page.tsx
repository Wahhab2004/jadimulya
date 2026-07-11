import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import SectionHeader from '@/app/components/SectionHeader';
import type { OrganisasiItem } from '@/lib/types';

const organisasiData: OrganisasiItem[] = [
  { id: '1', name: 'H. Karsidi, S.Pd, M.Pd.', position: 'Kepala Desa', photoUrl: '/images/kepala-desa.jpg' },
  { id: '2', name: 'Sudrajat', position: 'Sekretaris Desa', photoUrl: '/images/sekdes.jpg' },
  { id: '3', name: 'Ahroli Hendriana', position: 'Kasi Pelayanan' },
  { id: '4', name: 'Anen', position: 'Kasi Kesejahteraan' },
  { id: '5', name: 'Karsid', position: 'Kasi Pemerintahan' },
  { id: '6', name: 'Hendaryat, S.IP.', position: 'Kaur Perencanaan' },
  { id: '7', name: 'Lia Mulyani, S.E.', position: 'Kaur Umum' },
  { id: '8', name: 'Sri Wulansari, S.Pust.', position: 'Kaur Keuangan' },
  { id: '9', name: 'Didin', position: 'Kepala Dusun Ciranto' },
  { id: '10', name: 'Aman Kostaman, A.Md.', position: 'Kepala Dusun Cisagu' },
  { id: '11', name: 'Ahya', position: 'Kepala Dusun Mulyasari' },
  { id: '12', name: 'Mira Sumirah', position: 'Kepala Dusun Sidamulya' },
  { id: '13', name: 'Otih Rohainah', position: 'Kepala Dusun Parinenggang' },
  { id: '14', name: 'Irawan, S.T.', position: 'Staff Keuangan' },
];

export default function StrukturPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader title="Struktur Organisasi & Tata Kerja" subtitle="Mewujudkan tata kelola desa yang transparan, akuntabel, dan profesional melalui sinergi perangkat desa Jadimulya." />
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center">
              <img src="/images/kepala-desa.jpg" alt="Kepala Desa" className="mx-auto h-64 w-64 rounded-[2rem] object-cover" />
              <p className="mt-6 text-xl font-semibold text-slate-900">H. Karsidi, S.Pd, M.Pd.</p>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Kepala Desa</p>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {organisasiData.slice(1, 5).map((person) => (
                  <div key={person.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-base font-semibold text-slate-900">{person.name}</p>
                    <p className="mt-2 text-sm text-slate-600">{person.position}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {organisasiData.slice(5, 11).map((person) => (
                  <div key={person.id} className="rounded-[2rem] border border-slate-200 bg-white p-5 text-center shadow-sm">
                    <p className="text-sm font-semibold text-slate-900">{person.name}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{person.position}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Komitmen Pelayanan Publik</h3>
                <p className="mt-4 text-slate-600">Sesuai dengan Peraturan Desa No. 04 Tahun 2023 tentang Tata Kerja Pemerintah Desa, seluruh perangkat desa berkomitmen untuk memberikan pelayanan yang ramah, cepat, dan tanpa biaya tambahan kepada seluruh warga Jadimulya.</p>
                <a href="#" className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">Lihat Tupoksi Lengkap</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
