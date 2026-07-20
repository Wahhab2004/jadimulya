"use client";

import { useEffect, useMemo, useState } from 'react';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { initialPopulationDataset, loadStoredPopulationDataset, type PopulationDataset } from '@/lib/population-store';
import { getDemografiPerDusun, getDemografiRingkasan } from '@/lib/api';

function numberFormat(value: number) {
  return value.toLocaleString('id-ID');
}

function toSafeNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.round(parsed));
    }
  }

  return 0;
}

function getStringField(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

export default function StatistikPage() {
  const [dataset, setDataset] = useState<PopulationDataset>(initialPopulationDataset);

  useEffect(() => {
    const localDataset = loadStoredPopulationDataset();
    setDataset(localDataset);

    void (async () => {
      const nextDataset: PopulationDataset = {
        ...localDataset,
        dusun: localDataset.dusun,
        occupations: localDataset.occupations,
        summary: { ...localDataset.summary },
      };

      try {
        const ringkasan = await getDemografiRingkasan();
        nextDataset.summary = {
          totalPopulation: toSafeNumber(ringkasan.totalPopulation ?? nextDataset.summary.totalPopulation),
          households: toSafeNumber(ringkasan.households ?? nextDataset.summary.households),
          male: toSafeNumber(ringkasan.male ?? nextDataset.summary.male),
          female: toSafeNumber(ringkasan.female ?? nextDataset.summary.female),
        };

        const occupationSource =
          Array.isArray(ringkasan.occupations) && ringkasan.occupations.length > 0
            ? ringkasan.occupations
            : Array.isArray(ringkasan.mainOccupations)
              ? ringkasan.mainOccupations
              : [];

        const mappedOccupations = occupationSource
          .map((item, index) => {
            const label = typeof item?.label === 'string' ? item.label.trim() : '';
            if (!label) {
              return null;
            }

            return {
              id: `job-api-${index + 1}`,
              label,
              value: toSafeNumber(item?.value),
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        if (mappedOccupations.length > 0) {
          nextDataset.occupations = mappedOccupations;
        }
      } catch {
        // Some deployments have not exposed /demografi/ringkasan yet.
      }

      try {
        const perDusun = await getDemografiPerDusun();
        const mappedDusun = perDusun
          .map((item, index) => {
            const asRecord = item as Record<string, unknown>;
            const name = getStringField(asRecord, ['name', 'dusunName', 'dusun', 'villageName']);
            if (!name) {
              return null;
            }

            const male = toSafeNumber(asRecord.male ?? asRecord.lakiLaki ?? asRecord.totalMale);
            const female = toSafeNumber(asRecord.female ?? asRecord.perempuan ?? asRecord.totalFemale);
            const households = toSafeNumber(asRecord.households ?? asRecord.kk ?? asRecord.totalHouseholds);

            return {
              id: typeof asRecord.id === 'string' && asRecord.id.trim() ? asRecord.id : `dusun-api-${index + 1}`,
              name,
              households,
              male,
              female,
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        if (mappedDusun.length > 0) {
          nextDataset.dusun = mappedDusun;

          const totalFromDusun = mappedDusun.reduce(
            (acc, item) => {
              acc.households += item.households;
              acc.male += item.male;
              acc.female += item.female;
              acc.totalPopulation += item.male + item.female;
              return acc;
            },
            { totalPopulation: 0, households: 0, male: 0, female: 0 }
          );

          if (nextDataset.summary.totalPopulation === 0) {
            nextDataset.summary.totalPopulation = totalFromDusun.totalPopulation;
          }
          if (nextDataset.summary.households === 0) {
            nextDataset.summary.households = totalFromDusun.households;
          }
          if (nextDataset.summary.male === 0) {
            nextDataset.summary.male = totalFromDusun.male;
          }
          if (nextDataset.summary.female === 0) {
            nextDataset.summary.female = totalFromDusun.female;
          }
        }
      } catch {
        // Keep local fallback content when API request fails.
      }

      setDataset(nextDataset);
    })();
  }, []);

  const maxDusunTotal = useMemo(
    () => Math.max(1, ...dataset.dusun.map((item) => item.male + item.female)),
    [dataset.dusun]
  );

  const maxOccupation = useMemo(
    () => Math.max(1, ...dataset.occupations.map((item) => item.value)),
    [dataset.occupations]
  );

  const malePercent = dataset.summary.totalPopulation
    ? Math.round((dataset.summary.male / dataset.summary.totalPopulation) * 1000) / 10
    : 0;
  const femalePercent = dataset.summary.totalPopulation
    ? Math.round((dataset.summary.female / dataset.summary.totalPopulation) * 1000) / 10
    : 0;

  const summaryItems = [
    {
      label: 'Total Penduduk',
      value: numberFormat(dataset.summary.totalPopulation),
      note: 'Ringkasan data terbaru',
      noteClass: 'text-emerald-700',
    },
    {
      label: 'Kepala Keluarga',
      value: numberFormat(dataset.summary.households),
      note: 'Akumulasi seluruh dusun',
      noteClass: 'text-sky-700',
    },
    {
      label: 'Laki-laki',
      value: numberFormat(dataset.summary.male),
      note: `${malePercent}% dari total`,
      noteClass: 'text-amber-700',
    },
    {
      label: 'Perempuan',
      value: numberFormat(dataset.summary.female),
      note: `${femalePercent}% dari total`,
      noteClass: 'text-emerald-700',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Data Publik Desa</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Statistik Ringkas Desa Jadimulya</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Ringkasan statistik ini menampilkan total penduduk, distribusi gender, jenis pekerjaan,
            dan sebaran data per dusun berdasarkan input terbaru dari admin desa.
          </p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryItems.map((item) => (
            <article key={item.label} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-4xl font-semibold leading-none text-slate-900">{item.value}</p>
              <p className={`mt-2 text-xs font-medium ${item.noteClass}`}>{item.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-6">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Distribusi Gender</h2>
            <div className="mx-auto mt-6 h-48 w-48 rounded-full bg-[conic-gradient(#047857_0deg_177.84deg,#60a5fa_177.84deg_360deg)] p-5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
                <div>
                  <p className="text-sm text-slate-500">Komposisi</p>
                  <p className="text-2xl font-semibold text-slate-900">{malePercent}:{femalePercent}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                <p className="font-semibold text-slate-900">Laki-laki</p>
                <p className="mt-1 text-emerald-700">{malePercent}%</p>
              </div>
              <div className="rounded-2xl bg-sky-50 px-4 py-3">
                <p className="font-semibold text-slate-900">Perempuan</p>
                <p className="mt-1 text-sky-700">{femalePercent}%</p>
              </div>
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Sebaran Penduduk per Dusun</h2>
            {dataset.dusun.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                Data dusun belum tersedia. Admin desa dapat menambah rincian dusun dari menu Kependudukan.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {dataset.dusun.map((item) => {
                  const total = item.male + item.female;
                  return (
                    <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{numberFormat(item.households)} KK</p>
                        </div>
                        <p className="text-lg font-semibold text-slate-900">{numberFormat(total)} jiwa</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-200">
                        <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.round((total / maxDusunTotal) * 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Distribusi Jenis Pekerjaan</h2>
            <p className="mt-1 text-sm text-slate-500">Menggantikan indikator pendidikan sesuai keputusan PRD.</p>
            {dataset.occupations.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                Data jenis pekerjaan belum tersedia. Admin desa dapat menambah data dari menu Demografi.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {dataset.occupations.map((item) => (
                  <div key={item.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="font-medium text-slate-900">{numberFormat(item.value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${Math.max(4, Math.round((item.value / maxOccupation) * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
