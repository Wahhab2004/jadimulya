"use client";

import { useMemo, useState } from 'react';
import { ageGroups, dataDusun, educationStats, genderDistribution, statistikSummary } from '@/lib/statistics-data';

export default function AdminStatistikPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPadatOnly, setShowPadatOnly] = useState(false);
  const maleValue = genderDistribution.male;
  const femaleValue = genderDistribution.female;

  const filteredDusun = useMemo(() => {
    return dataDusun.filter((item) => {
      const matchedName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchedDensity = showPadatOnly ? item.total >= 1100 : true;
      return matchedName && matchedDensity;
    });
  }, [searchTerm, showPadatOnly]);

  const maxAgeValue = Math.max(...ageGroups.map((item) => item.value));
  const maxDusunTotal = Math.max(...dataDusun.map((item) => item.total));

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Modul Statistik</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Visualisasi Data Kependudukan</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Modul ini cocok berada di admin panel, karena berisi data operasional, pemantauan internal, dan kontrol
              pembaruan dataset untuk kebutuhan pengambilan keputusan pemerintah desa.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Unduh PDF
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Perbarui Data
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {statistikSummary.map((item) => (
          <article key={item.label} className="rounded-[1.5rem] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.4)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold leading-none text-slate-900">{item.value}</p>
            <p className={`mt-2 text-xs font-medium ${item.noteClass}`}>{item.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 2xl:grid-cols-[0.95fr_1.7fr]">
        <article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
          <h3 className="text-2xl font-semibold text-slate-900">Distribusi Gender</h3>
          <div className="mx-auto mt-6 h-48 w-48 rounded-full bg-[conic-gradient(#047857_0deg_177.84deg,#60a5fa_177.84deg_360deg)] p-4 shadow-[0_24px_40px_-28px_rgba(15,23,42,0.5)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
              <div>
                <p className="text-4xl font-semibold text-slate-900">100%</p>
                <p className="mt-1 text-sm text-slate-500">Data gender</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-emerald-50 px-4 py-3">
              <p className="font-semibold text-slate-900">Laki-laki</p>
              <p className="text-emerald-700">{maleValue}%</p>
            </div>
            <div className="rounded-2xl bg-sky-50 px-4 py-3">
              <p className="font-semibold text-slate-900">Perempuan</p>
              <p className="text-sky-700">{femaleValue}%</p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Kelompok Usia</h3>
              <p className="mt-1 text-sm text-slate-500">Komposisi populasi per rentang umur</p>
            </div>
            <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
              <span className="rounded-full bg-white px-3 py-1 text-slate-700">Semua</span>
              <span className="px-3 py-1 text-slate-500">Produktif</span>
            </div>
          </div>
          <div className="mt-8 grid h-[250px] grid-cols-8 items-end gap-3">
            {ageGroups.map((item) => (
              <div key={item.label} className="flex h-full flex-col items-center justify-end gap-2">
                <div
                  className="w-full rounded-md bg-emerald-700/95"
                  style={{ height: `${Math.max(20, (item.value / maxAgeValue) * 200)}px` }}
                  title={`${item.label}: ${item.value}`}
                />
                <span className="text-[10px] text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Tingkat Pendidikan Terakhir</h3>
            <p className="mt-1 text-sm text-slate-500">Data berdasarkan penduduk usia di atas 7 tahun</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {educationStats.map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-50 px-3 py-3">
              <div className="h-1.5 rounded-full bg-slate-200">
                <div className="h-1.5 rounded-full bg-emerald-600" style={{ width: `${Math.round(item.value * 100)}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{Math.round(item.value * 100)}%</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/85 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-5">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Rincian Data Penduduk per Dusun</h3>
            <p className="mt-1 text-sm text-slate-500">Pencarian cepat dan kepadatan tiap dusun</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cari dusun..."
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300"
            />
            <button
              type="button"
              onClick={() => setShowPadatOnly((value) => !value)}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition ${
                showPadatOnly ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold sm:px-5">Nama Dusun</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Jumlah KK</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Laki-laki</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Perempuan</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Total Jiwa</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Kepadatan</th>
                <th className="px-4 py-3 font-semibold sm:px-5">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDusun.map((dusun) => (
                <tr key={dusun.name} className="border-t border-slate-200 bg-white text-slate-700">
                  <td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">{dusun.name}</td>
                  <td className="px-4 py-3 sm:px-5">{dusun.kk}</td>
                  <td className="px-4 py-3 sm:px-5">{dusun.male}</td>
                  <td className="px-4 py-3 sm:px-5">{dusun.female}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">{dusun.total.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-3 sm:px-5">
                    <div className="h-1.5 w-20 rounded-full bg-slate-200">
                      <div className="h-1.5 rounded-full bg-emerald-700" style={{ width: `${Math.round((dusun.total / maxDusunTotal) * 100)}%` }} />
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <button type="button" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          <p>Menampilkan {filteredDusun.length} dari {dataDusun.length} dusun</p>
          <div className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
            1
          </div>
        </div>
      </section>
    </div>
  );
}