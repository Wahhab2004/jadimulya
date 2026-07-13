"use client";

import { useEffect, useMemo, useState } from 'react';
import { initialPotensiItems, loadStoredPotensiItems, savePotensiItems, type PotensiCategory, type PotensiItem } from '@/lib/potensi-store';

const emptyForm: Omit<PotensiItem, 'id'> = {
  title: '',
  description: '',
  category: 'UMKM',
  tag: '',
  actionLabel: '',
  imageUrl: '/images/potensi-umkm.jpg',
};

export default function AdminPotensiPage() {
  const [items, setItems] = useState<PotensiItem[]>(initialPotensiItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState(emptyForm);

  useEffect(() => {
    setItems(loadStoredPotensiItems());
  }, []);

  useEffect(() => {
    savePotensiItems(items);
  }, [items]);

  const summary = useMemo(() => {
    return {
      total: items.length,
      umkm: items.filter((item) => item.category === 'UMKM').length,
      pertanian: items.filter((item) => item.category === 'Pertanian').length,
      wisata: items.filter((item) => item.category === 'Wisata').length,
    };
  }, [items]);

  function resetForm() {
    setEditingId(null);
    setFormState(emptyForm);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId) {
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === editingId ? { ...item, ...formState } : item))
      );
      resetForm();
      return;
    }

    const newItem: PotensiItem = {
      id: `p-${Date.now()}`,
      ...formState,
    };

    setItems((currentItems) => [newItem, ...currentItems]);
    resetForm();
  }

  function startEdit(item: PotensiItem) {
    setEditingId(item.id);
    setFormState({
      title: item.title,
      description: item.description,
      category: item.category,
      tag: item.tag,
      actionLabel: item.actionLabel,
      imageUrl: item.imageUrl,
    });
  }

  function removeItem(itemId: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));

    if (editingId === itemId) {
      resetForm();
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Modul Potensi</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Kelola Potensi Desa</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Modul ini sudah aktif untuk tambah, edit, dan hapus data potensi. Dalam versi demo ini, perubahan disimpan di
          browser dan langsung dibaca halaman publik potensi pada perangkat yang sama.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Total Potensi</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{summary.total}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">UMKM</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{summary.umkm}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Pertanian</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{summary.pertanian}</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Wisata</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{summary.wisata}</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Potensi' : 'Tambah Potensi Baru'}</h3>
              <p className="mt-1 text-sm text-slate-600">Lengkapi data agar kartu potensi tampil konsisten di halaman publik.</p>
            </div>
            {editingId ? (
              <button type="button" onClick={resetForm} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Batal Edit
              </button>
            ) : null}
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Judul</span>
              <input
                type="text"
                value={formState.title}
                onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Kategori</span>
              <select
                value={formState.category}
                onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value as PotensiCategory }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
              >
                <option value="UMKM">UMKM</option>
                <option value="Pertanian">Pertanian</option>
                <option value="Wisata">Wisata</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Tag</span>
              <input
                type="text"
                value={formState.tag}
                onChange={(event) => setFormState((current) => ({ ...current, tag: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Label Tombol</span>
              <input
                type="text"
                value={formState.actionLabel}
                onChange={(event) => setFormState((current) => ({ ...current, actionLabel: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">URL Gambar</span>
              <input
                type="text"
                value={formState.imageUrl}
                onChange={(event) => setFormState((current) => ({ ...current, imageUrl: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Deskripsi</span>
              <textarea
                value={formState.description}
                onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                className="min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
                required
              />
            </label>
          </div>

          <button type="submit" className="mt-6 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
            {editingId ? 'Simpan Perubahan' : 'Tambah Potensi'}
          </button>
        </form>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Daftar Potensi</h3>
              <p className="mt-1 text-sm text-slate-600">Perubahan di sini akan memengaruhi konten demo pada halaman publik potensi.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{item.category}</p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                  <img src={item.imageUrl} alt={item.title} className="h-20 w-28 rounded-2xl object-cover" />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1">{item.tag}</span>
                  <span className="rounded-full bg-white px-3 py-1">{item.actionLabel}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => startEdit(item)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                    Edit
                  </button>
                  <button type="button" onClick={() => removeItem(item.id)} className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
