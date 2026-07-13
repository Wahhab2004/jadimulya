"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { initialSejarahContent, loadStoredSejarahContent, saveSejarahContent, type KepalaDesaItem, type SejarahContent } from '@/lib/sejarah-store';

const emptyLeader: KepalaDesaItem = { no: 0, nama: '', masaJabatan: '', keterangan: '' };

function SectionIcon({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">{children}</span>;
}

export default function AdminSejarahKepalaDesaPage() {
  const [content, setContent] = useState<SejarahContent>(initialSejarahContent);
  const [formState, setFormState] = useState<KepalaDesaItem>(emptyLeader);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setContent(loadStoredSejarahContent());
  }, []);

  function resetForm() {
    setFormState(emptyLeader);
    setEditingIndex(null);
  }

  function saveLeader(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.nama.trim() || !formState.masaJabatan.trim()) return;

    const nextItems = [...content.kepalaDesa];

    if (editingIndex !== null) {
      nextItems[editingIndex] = { ...formState, no: editingIndex + 1 };
    } else {
      nextItems.push({ ...formState, no: nextItems.length + 1 });
    }

    const normalizedItems = nextItems.map((item, index) => ({ ...item, no: index + 1 }));
    const nextContent = { ...content, kepalaDesa: normalizedItems };
    setContent(nextContent);
    saveSejarahContent(nextContent);
    setNotice(editingIndex !== null ? 'Data kepala desa berhasil diperbarui.' : 'Data kepala desa berhasil ditambahkan.');
    resetForm();
  }

  function editLeader(index: number) {
    setFormState(content.kepalaDesa[index]);
    setEditingIndex(index);
  }

  function removeLeader(index: number) {
    const nextItems = content.kepalaDesa.filter((_, itemIndex) => itemIndex !== index).map((item, itemIndex) => ({ ...item, no: itemIndex + 1 }));
    const nextContent = { ...content, kepalaDesa: nextItems };
    setContent(nextContent);
    saveSejarahContent(nextContent);
    setNotice('Data kepala desa berhasil dihapus.');
    if (editingIndex === index) resetForm();
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 px-5 py-5 lg:px-6">
            <SectionIcon>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4.75l5 2.5v4.5c0 3.2-2.1 6.16-5 7.5-2.9-1.34-5-4.3-5-7.5v-4.5z" />
                <path d="M9.5 11.75l1.75 1.75 3.25-3.5" />
              </svg>
            </SectionIcon>
            <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Sejarah Desa</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Kelola Kepala Desa</h2>
            <p className="mt-1 text-sm text-slate-600">Tambah dan rapikan data pimpinan desa.</p>
            </div>
          </div>
          <div className="px-5 py-5 lg:px-6">
            <Link href="/admin/sejarah" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">Kembali</Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.24)]">
        <div className="grid xl:grid-cols-[0.92fr_1.08fr]">
        <form onSubmit={saveLeader} className="border-b border-slate-200 px-5 py-5 xl:border-b-0 xl:border-r lg:px-6">
          {notice ? <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div> : null}
          <h3 className="text-lg font-semibold text-slate-900">{editingIndex !== null ? 'Edit Kepala Desa' : 'Tambah Kepala Desa'}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input type="text" placeholder="Nama" value={formState.nama} onChange={(event) => setFormState((current) => ({ ...current, nama: event.target.value }))} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-300 sm:col-span-2" />
            <input type="text" placeholder="Masa Jabatan" value={formState.masaJabatan} onChange={(event) => setFormState((current) => ({ ...current, masaJabatan: event.target.value }))} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-300" />
            <input type="text" placeholder="Keterangan" value={formState.keterangan} onChange={(event) => setFormState((current) => ({ ...current, keterangan: event.target.value }))} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-emerald-300" />
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800">{editingIndex !== null ? 'Simpan Perubahan' : 'Tambah Kepala Desa'}</button>
            {editingIndex !== null ? <button type="button" onClick={resetForm} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">Batal</button> : null}
          </div>
        </form>

        <section className="px-5 py-5 lg:px-6">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <h3 className="text-lg font-semibold text-slate-900">Daftar Kepala Desa</h3>
            <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{content.kepalaDesa.length} data</span>
          </div>
          <div className="divide-y divide-slate-200">
            {content.kepalaDesa.map((item, index) => (
              <article key={`${item.no}-${item.nama}`} className="py-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8.5" r="2.5" />
                      <path d="M7.5 17c.9-2.55 3.01-4 4.5-4s3.6 1.45 4.5 4" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{item.no}. {item.nama}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.masaJabatan}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.keterangan}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => editLeader(index)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">Edit</button>
                  <button type="button" onClick={() => removeLeader(index)} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700">Hapus</button>
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