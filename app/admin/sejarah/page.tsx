"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { initialSejarahContent, loadStoredSejarahContent, type SejarahContent } from '@/lib/sejarah-store';

function ModuleIcon({ children, tone = 'emerald' }: { children: React.ReactNode; tone?: 'emerald' | 'sky' | 'amber' }) {
  const tones = {
    emerald: 'bg-emerald-100 text-emerald-700',
    sky: 'bg-sky-100 text-sky-700',
    amber: 'bg-amber-100 text-amber-700',
  };

  return <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>{children}</span>;
}

export default function AdminSejarahPage() {
  const [content, setContent] = useState<SejarahContent>(initialSejarahContent);

  useEffect(() => {
    setContent(loadStoredSejarahContent());
  }, []);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 lg:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Modul Sejarah</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Kelola Sejarah Desa</h2>
            <p className="mt-2 text-sm text-slate-600">Tampilan dibuat seperti halaman manajemen: lebih datar, lebih singkat, dan mudah dibaca.</p>
          </div>
          <Link href="/sejarah" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100">
            Lihat Halaman Publik
          </Link>
        </div>

        <div className="grid border-b border-slate-200 sm:grid-cols-3">
          <div className="border-b border-slate-200 px-5 py-4 sm:border-b-0 sm:border-r lg:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Judul Hero</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{content.heroTitle}</p>
          </div>
          <div className="border-b border-slate-200 px-5 py-4 sm:border-b-0 sm:border-r lg:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Milestone</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{content.milestones.length}</p>
          </div>
          <div className="px-5 py-4 lg:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Kepala Desa</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{content.kepalaDesa.length}</p>
          </div>
        </div>

        <div className="grid xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Link href="/admin/sejarah/konten" className="flex items-start gap-4 border-b border-slate-200 px-5 py-4 transition hover:bg-slate-50 lg:px-6">
            <ModuleIcon tone="emerald">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4.75h7l3 3V19.25a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
                <path d="M14 4.75v3h3" />
                <path d="M9 11h6" />
                <path d="M9 15h6" />
              </svg>
            </ModuleIcon>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">Konten Utama</h3>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Hero & narasi</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Edit judul, cerita asal-usul, dan dusun saat ini.</p>
            </div>
          </Link>

          <Link href="/admin/sejarah/milestone" className="flex items-start gap-4 border-b border-slate-200 px-5 py-4 transition hover:bg-slate-50 lg:px-6">
            <ModuleIcon tone="sky">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18.25h16" />
                <path d="M7 18.25V10.5" />
                <path d="M12 18.25V6.5" />
                <path d="M17 18.25v-4.75" />
              </svg>
            </ModuleIcon>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">Milestone</h3>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{content.milestones.length} data</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Tambah atau rapikan fase penting sejarah desa.</p>
            </div>
          </Link>

          <Link href="/admin/sejarah/kepala-desa" className="flex items-start gap-4 px-5 py-4 transition hover:bg-slate-50 lg:px-6">
            <ModuleIcon tone="amber">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4.75l5 2.5v4.5c0 3.2-2.1 6.16-5 7.5-2.9-1.34-5-4.3-5-7.5v-4.5z" />
                <path d="M9.5 11.75l1.75 1.75 3.25-3.5" />
              </svg>
            </ModuleIcon>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">Kepala Desa</h3>
                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{content.kepalaDesa.length} data</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">Kelola daftar pimpinan desa dari masa ke masa.</p>
            </div>
          </Link>
          </div>

          <section className="border-t border-slate-200 px-5 py-5 xl:border-l xl:border-t-0 lg:px-6">
          <div className="flex items-center gap-3">
            <ModuleIcon tone="emerald">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 18.25h14" />
                <path d="M7.75 14.5h8.5" />
                <path d="M9.75 10.75h4.5" />
              </svg>
            </ModuleIcon>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Dusun Saat Ini</h3>
              <p className="text-sm text-slate-600">Ringkasan wilayah aktif desa saat ini.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {content.dusunSaatIni.map((dusun) => (
              <span key={dusun} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                {dusun}
              </span>
            ))}
          </div>
          </section>
        </div>
      </section>
    </div>
  );
}
