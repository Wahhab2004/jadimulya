"use client";

import { useEffect, useMemo, useState } from 'react';
import { initialPopulationDataset, loadStoredPopulationDataset, type PopulationDataset } from '@/lib/population-store';

function formatNumber(value: number) {
  return value.toLocaleString('id-ID');
}

export default function AdminStatistikPage() {
  const [dataset, setDataset] = useState<PopulationDataset>(initialPopulationDataset);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPadatOnly, setShowPadatOnly] = useState(false);

  useEffect(() => {
    setDataset(loadStoredPopulationDataset());
  }, []);

  const filteredDusun = useMemo(() => {
    return dataset.dusun.filter((item) => {
      const matchedName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchedDensity = showPadatOnly ? item.male + item.female >= 1100 : true;
      return matchedName && matchedDensity;
    });
  }, [dataset.dusun, searchTerm, showPadatOnly]);

  const maxAgeValue = useMemo(
    () => Math.max(1, ...dataset.ageGroups.map((item) => item.value)),
    [dataset.ageGroups]
  );

  const maxDusunTotal = useMemo(
    () => Math.max(1, ...dataset.dusun.map((item) => item.male + item.female)),
    [dataset.dusun]
  );

  const maleValue = dataset.summary.totalPopulation
    ? Math.round((dataset.summary.male / dataset.summary.totalPopulation) * 1000) / 10
    : 0;
  const femaleValue = dataset.summary.totalPopulation
    ? Math.round((dataset.summary.female / dataset.summary.totalPopulation) * 1000) / 10
    : 0;

  const summaryItems = [
    {
      label: 'Total Penduduk',
      value: formatNumber(dataset.summary.totalPopulation),
      note: 'Data sinkron dari modul kependudukan',
      noteClass: 'text-emerald-700',
    },
    {
      label: 'Kepala Keluarga',
      value: formatNumber(dataset.summary.households),
      note: 'Akumulasi semua dusun',
      noteClass: 'text-sky-700',
    },
    {
      label: 'Laki-laki',
      value: formatNumber(dataset.summary.male),
      note: `${maleValue}% dari populasi`,
      noteClass: 'text-amber-700',
    },
    {
      label: 'Perempuan',
      value: formatNumber(dataset.summary.female),
      note: `${femaleValue}% dari populasi`,
      noteClass: 'text-emerald-700',
    },
  ];

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Modul Statistik</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Visualisasi Data Kependudukan</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Dashboard ini menampilkan ringkasan hasil input modul Demografi dan Kependudukan. Grafik pendidikan telah
              diganti menjadi jenis pekerjaan sesuai keputusan PRD.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {summaryItems.map((item) => (
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
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Update {dataset.updatedAt}</span>
          </div>
          {dataset.ageGroups.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              Belum ada data kelompok usia.
            </div>
          ) : (
            <div className="mt-8 grid h-[250px] grid-cols-8 items-end gap-3">
              {dataset.ageGroups.map((item) => (
                <div key={item.id} className="flex h-full flex-col items-center justify-end gap-2">
                  <div
                    className="w-full rounded-md bg-emerald-700/95"
                    style={{ height: `${Math.max(20, (item.value / maxAgeValue) * 200)}px` }}
                    title={`${item.label}: ${item.value}`}
                  />
                  <span className="text-[10px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Distribusi Jenis Pekerjaan</h3>
            <p className="mt-1 text-sm text-slate-500">Pengganti grafik tingkat pendidikan sesuai PRD</p>
          </div>
        </div>
        {dataset.occupations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            Belum ada data jenis pekerjaan.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {dataset.occupations.map((item) => (
              <div key={item.id} className="rounded-lg bg-slate-50 px-3 py-3">
                <div className="h-1.5 rounded-full bg-slate-200">
                  <div className="h-1.5 rounded-full bg-emerald-600" style={{ width: `${Math.max(4, Math.round((item.value / Math.max(...dataset.occupations.map((occupation) => occupation.value), 1)) * 100))}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{formatNumber(item.value)}</p>
              </div>
            ))}
          </div>
        )}
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
              </tr>
            </thead>
            <tbody>
              {filteredDusun.map((dusun) => {
                const total = dusun.male + dusun.female;
                return (
                  <tr key={dusun.id} className="border-t border-slate-200 bg-white text-slate-700">
                    <td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">{dusun.name}</td>
                    <td className="px-4 py-3 sm:px-5">{formatNumber(dusun.households)}</td>
                    <td className="px-4 py-3 sm:px-5">{formatNumber(dusun.male)}</td>
                    <td className="px-4 py-3 sm:px-5">{formatNumber(dusun.female)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">{formatNumber(total)}</td>
                    <td className="px-4 py-3 sm:px-5">
                      <div className="h-1.5 w-20 rounded-full bg-slate-200">
                        <div className="h-1.5 rounded-full bg-emerald-700" style={{ width: `${Math.round((total / maxDusunTotal) * 100)}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          <p>Menampilkan {filteredDusun.length} dari {dataset.dusun.length} dusun</p>
          <div className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600">
            1
          </div>
        </div>
      </section>
    </div>
  );
}
