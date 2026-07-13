"use client";

import { useEffect, useMemo, useState } from 'react';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import { initialPotensiItems, loadStoredPotensiItems, type PotensiCategory, type PotensiItem } from '@/lib/potensi-store';

const categoryFilters = ['Semua Potensi', 'UMKM', 'Pertanian', 'Wisata'] as const;
type CategoryFilter = (typeof categoryFilters)[number];

const categoryBadgeStyles: Record<PotensiCategory, string> = {
  UMKM: 'bg-blue-100 text-blue-700',
  Pertanian: 'bg-emerald-100 text-emerald-700',
  Wisata: 'bg-amber-100 text-amber-700',
};

const categoryOrderWeight: Record<PotensiCategory, number> = {
  UMKM: 1,
  Pertanian: 2,
  Wisata: 3,
};

const cardActionIcons: Record<PotensiCategory, JSX.Element> = {
  UMKM: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M6 8h12l-1 11H7L6 8Z" />
      <path d="M9 8V6a3 3 0 1 1 6 0v2" />
    </svg>
  ),
  Pertanian: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M7 13c0 3 2 5 5 5" />
      <path d="M17 11c0 4-2 8-5 8V6c2 0 5 2 5 5Z" />
      <path d="M12 10c-2 0-5 2-5 5" />
    </svg>
  ),
  Wisata: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M7 21h10" />
      <path d="M12 21V10" />
      <path d="M5 5h7l2 3H5V5Z" />
      <path d="m14 8 2 3h3" />
    </svg>
  ),
};

export default function PotensiPage() {
  const [potensiItems, setPotensiItems] = useState<PotensiItem[]>(initialPotensiItems);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('Semua Potensi');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setPotensiItems(loadStoredPotensiItems());
  }, []);

  const filteredItems = useMemo(() => {
    const base =
      activeFilter === 'Semua Potensi' ? potensiItems : potensiItems.filter((item) => item.category === activeFilter);

    return [...base].sort((a, b) => {
      if (categoryOrderWeight[a.category] !== categoryOrderWeight[b.category]) {
        return categoryOrderWeight[a.category] - categoryOrderWeight[b.category];
      }
      return a.title.localeCompare(b.title);
    });
  }, [activeFilter, potensiItems]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />

      <main className="pb-10">
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/35" aria-hidden="true" />
          <img src="/images/hero-bg.jpg" alt="Lanskap potensi Desa Jadimulya" className="h-[300px] w-full object-cover sm:h-[360px] lg:h-[420px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-900/25 to-transparent" aria-hidden="true" />

          <div className="absolute inset-0 mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <span className="inline-flex rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold tracking-[0.08em]">
                Eksplorasi Desa
              </span>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Potensi dan Keunggulan Lokal Jadimulya</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                Menemukan permata tersembunyi di jantung desa kami, mulai dari produk UMKM berkualitas hingga destinasi
                wisata alam yang asri.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {categoryFilters.map((category) => {
                const isActive = activeFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      setActiveFilter(category);
                      setVisibleCount(6);
                    }}
                    className={`rounded-full px-5 py-2 text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-[0_10px_24px_-16px_rgba(6,95,70,0.9)]'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <p className="text-xs font-medium text-slate-600 sm:text-sm">Urutkan: Terpopuler</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleItems.map((item) => (
              <article key={item.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-56 overflow-hidden bg-slate-200">
                  <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${categoryBadgeStyles[item.category]}`}>
                    {item.category}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">{item.tag}</p>
                  <h3 className="mt-2 text-[1.7rem] font-semibold leading-tight text-slate-900">{item.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>

                  <div className="mt-5 flex items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      {item.actionLabel}
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 text-emerald-700 transition hover:bg-emerald-50"
                      aria-label={`Aksi tambahan ${item.title}`}
                    >
                      {cardActionIcons[item.category]}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 3)}
              disabled={!hasMore}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-700 px-7 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-700 hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent"
            >
              Tampilkan Lebih Banyak
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/35 p-8 text-center sm:p-10">
            <h2 className="text-3xl font-semibold text-slate-900">Ingin Menjadi Mitra Kami?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Kami membuka peluang kolaborasi bagi investor, distributor, maupun wisatawan yang ingin berkontribusi dalam
              memajukan potensi Desa Jadimulya.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_22px_-16px_rgba(6,95,70,0.85)] transition hover:bg-emerald-800">
                Hubungi Pemerintah Desa
              </button>
              <button type="button" className="rounded-full border border-emerald-700 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-700 hover:text-white">
                Unduh Katalog Potensi (PDF)
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
