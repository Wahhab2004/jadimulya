"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { initialSejarahContent, loadStoredSejarahContent, saveSejarahContent, type SejarahContent } from '@/lib/sejarah-store';

function SectionIcon({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">{children}</span>;
}

export default function AdminSejarahKontenPage() {
  const [content, setContent] = useState<SejarahContent>(initialSejarahContent);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setContent(loadStoredSejarahContent());
  }, []);

  function updateOriginParagraph(index: number, value: string) {
    setContent((current) => ({
      ...current,
      originParagraphs: current.originParagraphs.map((paragraph, paragraphIndex) => (paragraphIndex === index ? value : paragraph)),
    }));
  }

  function handleDusunChange(value: string) {
    const items = value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    setContent((current) => ({ ...current, dusunSaatIni: items }));
  }

  function saveContent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSejarahContent(content);
    setNotice('Konten utama sejarah berhasil disimpan.');
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-5 py-5 lg:px-6">
            <SectionIcon>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4.75h7l3 3V19.25a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
                <path d="M14 4.75v3h3" />
                <path d="M9 11h6" />
                <path d="M9 15h6" />
              </svg>
            </SectionIcon>
            <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Sejarah Desa</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Edit Konten Utama</h2>
            <p className="mt-1 text-sm text-slate-600">Kelola isi utama dalam satu panel yang lebih rapi.</p>
            </div>
          </div>
          <div className="px-5 py-5 lg:px-6">
          <Link href="/admin/sejarah" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">
            Kembali
          </Link>
          </div>
        </div>
      </section>

      <form onSubmit={saveContent} className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]">
        {notice ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div> : null}

        <section className="space-y-4 border-b border-slate-200 px-5 py-5 lg:px-6">
          <div className="flex items-center gap-3">
            <SectionIcon>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.75 12h14.5" />
                <path d="M7.75 8.5h8.5" />
                <path d="M9.5 15.5h5" />
              </svg>
            </SectionIcon>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Hero</h3>
              <p className="text-sm text-slate-600">Bagian pembuka halaman sejarah.</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Hero Eyebrow</span>
              <input type="text" value={content.heroEyebrow} onChange={(event) => setContent((current) => ({ ...current, heroEyebrow: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-300" />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Hero Title</span>
              <input type="text" value={content.heroTitle} onChange={(event) => setContent((current) => ({ ...current, heroTitle: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-300" />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Hero Description</span>
              <textarea value={content.heroDescription} onChange={(event) => setContent((current) => ({ ...current, heroDescription: event.target.value }))} className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300" />
            </label>
          </div>
        </section>

        <section className="space-y-4 border-b border-slate-200 px-5 py-5 lg:px-6">
          <div className="flex items-center gap-3">
            <SectionIcon>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.75 5.75h10.5" />
                <path d="M6.75 11.75h10.5" />
                <path d="M6.75 17.75h7.5" />
              </svg>
            </SectionIcon>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Asal-usul</h3>
              <p className="text-sm text-slate-600">Judul dan isi cerita sejarah.</p>
            </div>
          </div>

          <div className="grid gap-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Judul Asal-usul</span>
              <input type="text" value={content.originTitle} onChange={(event) => setContent((current) => ({ ...current, originTitle: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-300" />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Subtitle Asal-usul</span>
              <input type="text" value={content.originSubtitle} onChange={(event) => setContent((current) => ({ ...current, originSubtitle: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-300" />
            </label>
            {content.originParagraphs.map((paragraph, index) => (
              <label key={index} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Paragraf {index + 1}</span>
                <textarea value={paragraph} onChange={(event) => updateOriginParagraph(index, event.target.value)} className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300" />
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4 px-5 py-5 lg:px-6">
          <div className="flex items-center gap-3">
            <SectionIcon>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5.5v13" />
                <path d="M5.5 12h13" />
              </svg>
            </SectionIcon>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Dusun Saat Ini</h3>
              <p className="text-sm text-slate-600">Satu baris untuk satu dusun.</p>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Daftar Dusun</span>
            <textarea value={content.dusunSaatIni.join('\n')} onChange={(event) => handleDusunChange(event.target.value)} className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-300" />
          </label>
        </section>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4 lg:px-6">
          <button type="submit" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800">
            Simpan Konten
          </button>
        </div>
      </form>
    </div>
  );
}