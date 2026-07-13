"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { initialSejarahContent, loadStoredSejarahContent, saveSejarahContent, type SejarahContent, type SejarahMilestone } from '@/lib/sejarah-store';

const emptyMilestone: SejarahMilestone = { year: '', event: '' };

function SectionIcon({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">{children}</span>;
}

export default function AdminSejarahMilestonePage() {
  const [content, setContent] = useState<SejarahContent>(initialSejarahContent);
  const [formState, setFormState] = useState<SejarahMilestone>(emptyMilestone);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setContent(loadStoredSejarahContent());
  }, []);

  function resetForm() {
    setFormState(emptyMilestone);
    setEditingIndex(null);
  }

  function saveMilestone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.year.trim() || !formState.event.trim()) return;

    const nextMilestones = [...content.milestones];

    if (editingIndex !== null) {
      nextMilestones[editingIndex] = formState;
    } else {
      nextMilestones.push(formState);
    }

    const nextContent = { ...content, milestones: nextMilestones };
    setContent(nextContent);
    saveSejarahContent(nextContent);
    setNotice(editingIndex !== null ? 'Milestone berhasil diperbarui.' : 'Milestone berhasil ditambahkan.');
    resetForm();
  }

  function editMilestone(index: number) {
    setFormState(content.milestones[index]);
    setEditingIndex(index);
  }

  function removeMilestone(index: number) {
    const nextContent = { ...content, milestones: content.milestones.filter((_, itemIndex) => itemIndex !== index) };
    setContent(nextContent);
    saveSejarahContent(nextContent);
    setNotice('Milestone berhasil dihapus.');
    if (editingIndex === index) resetForm();
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-5 py-5 lg:px-6">
            <SectionIcon>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 18.25h16" />
                <path d="M7 18.25V10.5" />
                <path d="M12 18.25V6.5" />
                <path d="M17 18.25v-4.75" />
              </svg>
            </SectionIcon>
            <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Sejarah Desa</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Kelola Milestone</h2>
            <p className="mt-1 text-sm text-slate-600">Tambah dan rapikan fase sejarah.</p>
            </div>
          </div>
          <div className="px-5 py-5 lg:px-6">
            <Link href="/admin/sejarah" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">Kembali</Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]">
        <div className="grid xl:grid-cols-[0.86fr_1.14fr]">
        <form onSubmit={saveMilestone} className="border-b border-slate-200 px-5 py-5 xl:border-b-0 xl:border-r lg:px-6">
          {notice ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div> : null}
          <h3 className="text-lg font-semibold text-slate-900">{editingIndex !== null ? 'Edit Milestone' : 'Tambah Milestone'}</h3>
          <div className="mt-4 space-y-3">
            <input type="text" placeholder="Tahun / Label" value={formState.year} onChange={(event) => setFormState((current) => ({ ...current, year: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-sky-300" />
            <textarea placeholder="Deskripsi milestone" value={formState.event} onChange={(event) => setFormState((current) => ({ ...current, event: event.target.value }))} className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-300" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800">{editingIndex !== null ? 'Simpan Perubahan' : 'Tambah Milestone'}</button>
            {editingIndex !== null ? <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">Batal</button> : null}
          </div>
        </form>

        <section className="px-5 py-5 lg:px-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <h3 className="text-lg font-semibold text-slate-900">Daftar Milestone</h3>
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{content.milestones.length} data</span>
          </div>
          <div className="divide-y divide-slate-200">
            {content.milestones.map((item, index) => (
              <article key={`${item.year}-${index}`} className="py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="7" />
                      <path d="M12 8.75v3.75l2.25 1.5" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">{item.year}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{item.event}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => editMilestone(index)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">Edit</button>
                  <button type="button" onClick={() => removeMilestone(index)} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">Hapus</button>
                </div>
              </article>
            ))}
          </div>
        </section>
        </div>
      </section>
    </div>
  );
}