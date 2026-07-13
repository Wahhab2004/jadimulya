import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { ageGroups, dataDusun, educationStats, genderDistribution, statistikSummary } from '@/lib/statistics-data';

export default function StatistikPage() {
  const maxAgeValue = Math.max(...ageGroups.map((item) => item.value));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Data Publik Desa</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Statistik Ringkas Desa Jadimulya</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Ringkasan statistik ini ditampilkan untuk memberi gambaran umum kondisi kependudukan Desa Jadimulya. Detail
            operasional dan pengelolaan data lengkap dikelola melalui panel admin internal.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistikSummary.map((item) => (
            <article key={item.label} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-4xl font-semibold leading-none text-slate-900">{item.value}</p>
              <p className={`mt-2 text-xs font-medium ${item.noteClass}`}>{item.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.2fr]">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Distribusi Gender</h2>
            <div className="mx-auto mt-6 h-48 w-48 rounded-full bg-[conic-gradient(#047857_0deg_177.84deg,#60a5fa_177.84deg_360deg)] p-5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                <div>
                  <p className="text-sm text-slate-500">Komposisi</p>
                  <p className="text-2xl font-semibold text-slate-900">50:50</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="font-semibold text-slate-900">Laki-laki</p>
                <p className="mt-1 text-emerald-700">{genderDistribution.male}%</p>
              </div>
              <div className="rounded-2xl bg-sky-50 px-4 py-3">
                <p className="font-semibold text-slate-900">Perempuan</p>
                <p className="mt-1 text-sky-700">{genderDistribution.female}%</p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Kelompok Usia</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Data 2024</span>
            </div>
            <div className="mt-6 grid h-[240px] grid-cols-8 items-end gap-3">
              {ageGroups.map((item) => (
                <div key={item.label} className="flex h-full flex-col items-center justify-end gap-2">
                  <div className="w-full rounded-md bg-emerald-700" style={{ height: `${Math.max(20, (item.value / maxAgeValue) * 190)}px` }} />
                  <span className="text-[10px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Sebaran Penduduk per Dusun</h2>
            <div className="mt-5 space-y-4">
              {dataDusun.map((item) => (
                <div key={item.name} className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.kk} KK</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{item.total.toLocaleString('id-ID')} jiwa</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Tingkat Pendidikan</h2>
            <p className="mt-1 text-sm text-slate-500">Persentase penduduk usia di atas 7 tahun</p>
            <div className="mt-5 space-y-4">
              {educationStats.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="font-medium text-slate-900">{Math.round(item.value * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.round(item.value * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
