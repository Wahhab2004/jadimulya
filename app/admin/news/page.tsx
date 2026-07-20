"use client";

import { useEffect, useState } from 'react';
import { showAdminToast } from '@/lib/admin-toast';
import { adminBeFetch } from '@/lib/admin-api-client';

type NewsCategory = 'PEMBANGUNAN' | 'KESEHATAN' | 'PERTANIAN' | 'WISATA' | 'LAINNYA';

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  category: NewsCategory;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string;
};

type BackendResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type NewsFormState = {
  title: string;
  category: NewsCategory;
  excerpt: string;
  content: string;
  coverImage: string;
  isPublished: boolean;
  publishedAt: string;
};

const emptyForm: NewsFormState = {
  title: '',
  category: 'PEMBANGUNAN',
  excerpt: '',
  content: '',
  coverImage: '',
  isPublished: true,
  publishedAt: '',
};

const categoryLabel: Record<NewsCategory, string> = {
  PEMBANGUNAN: 'Pembangunan',
  KESEHATAN: 'Kesehatan',
  PERTANIAN: 'Pertanian',
  WISATA: 'Wisata',
  LAINNYA: 'Lainnya',
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    return undefined;
  }
}

function toDateInputValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<NewsFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadNews();
  }, []);

  async function loadNews() {
    setIsLoading(true);
    try {
      const response = await adminBeFetch('news/admin/all', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil berita');
      }

      const payload = (await response.json()) as BackendResponse<NewsItem[]>;
      setItems(Array.isArray(payload.data) ? payload.data : []);
    } catch {
      showAdminToast('Tidak bisa memuat data berita dari backend.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(item: NewsItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      excerpt: item.excerpt ?? '',
      content: item.content,
      coverImage: item.coverImage ?? '',
      isPublished: item.isPublished,
      publishedAt: toDateInputValue(item.publishedAt),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.title.trim().length < 5) {
      showAdminToast('Judul minimal 5 karakter.', 'info');
      return;
    }

    if (form.content.trim().length < 20) {
      showAdminToast('Konten minimal 20 karakter.', 'info');
      return;
    }

    setIsSaving(true);
    const path = editingId ? `news/admin/${editingId}` : 'news/admin';
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const response = await adminBeFetch(path, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          excerpt: form.excerpt.trim() || undefined,
          content: form.content.trim(),
          coverImage: normalizeUrl(form.coverImage),
          isPublished: form.isPublished,
          publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan berita');
      }

      await loadNews();
      resetForm();
      showAdminToast(editingId ? 'Berita berhasil diperbarui.' : 'Berita berhasil ditambahkan.', 'success');
    } catch {
      showAdminToast('Gagal menyimpan berita. Periksa format input.', 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function removeNews(id: string) {
    const confirmed = window.confirm('Hapus berita ini? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmed) {
      return;
    }

    try {
      const response = await adminBeFetch(`news/admin/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus berita');
      }

      await loadNews();
      if (editingId === id) {
        resetForm();
      }
      showAdminToast('Berita berhasil dihapus.', 'success');
    } catch {
      showAdminToast('Gagal menghapus berita.', 'error');
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Modul Berita</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Kelola Berita Desa</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Modul ini terhubung langsung ke backend untuk CRUD berita kategori Pembangunan, Kesehatan, Pertanian, Wisata,
          dan Lainnya.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={handleSubmit} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <h3 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Berita' : 'Tambah Berita'}</h3>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Judul berita"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
              required
            />

            <select
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as NewsCategory }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            >
              {(Object.keys(categoryLabel) as NewsCategory[]).map((category) => (
                <option key={category} value={category}>{categoryLabel[category]}</option>
              ))}
            </select>

            <input
              type="text"
              value={form.coverImage}
              onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))}
              placeholder="URL cover image (opsional)"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />

            <input
              type="date"
              value={form.publishedAt}
              onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />

            <textarea
              value={form.excerpt}
              onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
              placeholder="Ringkasan berita (opsional)"
              className="min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-300"
            />

            <textarea
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              placeholder="Konten berita"
              className="min-h-40 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-sky-300"
              required
            />

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-sky-700"
              />
              Langsung terbitkan berita
            </label>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:from-sky-700 hover:to-blue-800"
            >
              {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Berita'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                Batal
              </button>
            ) : null}
          </div>
        </form>

        <section className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <h3 className="text-xl font-semibold text-slate-900">Daftar Berita</h3>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <article className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Memuat data berita...
              </article>
            ) : null}

            {!isLoading && items.length === 0 ? (
              <article className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Belum ada berita tersimpan.
              </article>
            ) : null}

            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">{categoryLabel[item.category]}</p>
                    <p className="mt-1 font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500">/{item.slug}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.isPublished ? 'Published' : 'Draft'} • {new Date(item.publishedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeNews(item.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}