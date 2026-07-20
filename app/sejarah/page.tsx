"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import SectionHeader from '@/app/components/SectionHeader';
import { initialSejarahContent, loadStoredSejarahContent, type SejarahContent } from '@/lib/sejarah-store';

const daftarIsi = [
  { id: 'asal-usul', label: 'Asal-usul Desa' },
  { id: 'pemekaran', label: 'Pemekaran Wilayah' },
  { id: 'dusun-kini', label: 'Wilayah Dusun Kini' },
];

const liniMasaUtama = [
  { year: '1928', label: 'Pembentukan Desa' },
  { year: '1979', label: 'Pemekaran Tahap I' },
  { year: '1997', label: 'Pemekaran Tahap II' },
  { year: 'Kini', label: '5 Dusun Aktif' },
];

export default function SejarahPage() {
  const [content, setContent] = useState<SejarahContent>(initialSejarahContent);
  const [activeSection, setActiveSection] = useState(daftarIsi[0].id);

  useEffect(() => {
    setContent(loadStoredSejarahContent());
  }, []);

  useEffect(() => {
    const sectionIds = daftarIsi.map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0.1, 0.25, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:hidden">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Daftar Isi</p>
            <nav className="mt-3 flex flex-wrap gap-2">
              {daftarIsi.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Daftar Isi</p>
              <nav className="mt-4 space-y-1">
                {daftarIsi.map((item) => {
                  const isActive = activeSection === item.id;

                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block rounded-xl px-3 py-2 text-sm transition ${
                        isActive
                          ? 'bg-emerald-50 font-medium text-emerald-700'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Lini Masa Utama</p>
                <ol className="mt-4 space-y-4">
                  {liniMasaUtama.map((item) => (
                    <li key={item.year} className="flex gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.year}</p>
                        <p className="text-xs text-slate-600">{item.label}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>

          <div className="space-y-5 sm:space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Napak Tilas Jadimulya</p>
              <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                {content.heroTitle}
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
                {content.heroDescription}
              </p>

              <div className="mt-6 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{content.visiTitle}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{content.visiDescription}</p>
              </div>
            </section>

            <section id="asal-usul" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <SectionHeader
                title={content.originTitle}
                subtitle={content.originSubtitle}
              />
              {content.originParagraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`} className={`${index === 0 ? '' : 'mt-4'} text-[15px] leading-7 text-slate-600 sm:text-base`}>
                  {paragraph}
                </p>
              ))}
            </section>

            <section id="pemekaran" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <SectionHeader
                title={content.expansionTitle}
                subtitle={content.expansionSubtitle}
              />

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="mx-auto grid max-w-4xl gap-4 text-center">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Lembur Jumleng</div>
                    <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Lembur Jajaway</div>
                  </div>

                  <div className="mx-auto h-8 w-px bg-slate-300" aria-hidden="true" />

                  <div className="mx-auto rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 sm:text-base">
                    1928 - Desa Jadimulya
                  </div>

                  <div className="mx-auto h-8 w-px bg-slate-300" aria-hidden="true" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Desa Jadimulya (Induk)</p>
                      <p className="mt-1 text-xs text-slate-600">Jumleng, Cigintung, Ciranto</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">1979 - Desa Jadikarya</p>
                      <p className="mt-1 text-xs text-slate-600">Jajaway, Wangkalronyok</p>
                    </div>
                  </div>

                  <div className="mx-auto h-8 w-px bg-slate-300" aria-hidden="true" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">1997 - Desa Sukamulya</p>
                      <p className="mt-1 text-xs text-slate-600">Cigintung</p>
                    </div>
                    <div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Desa Jadimulya (Induk)</p>
                      <p className="mt-1 text-xs text-slate-600">Jumleng, Ciranto</p>
                    </div>
                  </div>

                  <div className="mx-auto h-8 w-px bg-slate-300" aria-hidden="true" />

                  <div className="rounded-2xl border border-slate-300 bg-white px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">Struktur Dusun Desa Jadimulya Saat Ini</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {content.dusunSaatIni.map((dusun) => (
                        <span key={dusun} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                          {dusun}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {content.milestones.map((item, index) => (
                  <article key={`${item.year}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">{item.year}</p>
                    <p className="mt-2 text-[15px] leading-7 text-slate-700 sm:text-base">{item.event}</p>
                    {item.imageUrl ? (
                      <div className="relative mt-4 h-40 w-full overflow-hidden rounded-xl border border-slate-200">
                        <Image
                          src={item.imageUrl}
                          alt={`Foto milestone ${item.year}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section id="dusun-kini" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <SectionHeader
                title={content.currentDusunTitle}
                subtitle={content.currentDusunSubtitle}
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {content.dusunSaatIni.map((dusun) => (
                  <div key={dusun} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm font-medium text-emerald-800">
                    {dusun}
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
