"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { showAdminToast } from '@/lib/admin-toast';
import { adminBeFetch } from '@/lib/admin-api-client';

type PotensiItem = {
  id: string;
  title: string;
  description: string;
  category: 'Pertanian' | 'Wisata';
  tag: string;
  imageUrl: string;
};

type BackendPotential = {
  id: string;
  name: string;
  category: 'PERTANIAN' | 'PARIWISATA' | 'UMKM';
  shortDesc: string;
  coverImage: string | null;
  isHighlight: boolean;
};

type BackendResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

function mapPotentialToItem(item: BackendPotential): PotensiItem | null {
  if (item.category === 'UMKM') {
    return null;
  }

  return {
    id: item.id,
    title: item.name,
    description: item.shortDesc,
    category: item.category === 'PARIWISATA' ? 'Wisata' : 'Pertanian',
    tag: item.isHighlight ? 'Highlight' : 'Reguler',
    imageUrl: item.coverImage ?? '/images/potensi-kopi.jpg',
  };
}

export default function AdminPotensiPage() {
  const [items, setItems] = useState<PotensiItem[]>([]);
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void fetchItems();
  }, []);

  async function fetchItems() {
    setIsLoading(true);
    try {
      const response = await adminBeFetch('potensi/admin/all', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil potensi');
      }

      const payload = (await response.json()) as BackendResponse<BackendPotential[]>;
      const nextItems = Array.isArray(payload.data)
        ? payload.data
            .map((item) => mapPotentialToItem(item))
            .filter((item): item is PotensiItem => item !== null)
        : [];

      setItems(nextItems);
    } catch {
      const message = 'Tidak bisa memuat data potensi dari backend.';
      setNotice(message);
      showAdminToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const summary = useMemo(() => {
    return {
      total: items.length,
      pertanian: items.filter((item) => item.category === 'Pertanian').length,
      wisata: items.filter((item) => item.category === 'Wisata').length,
    };
  }, [items]);

  async function removeItem(itemId: string) {
    const confirmed = window.confirm('Hapus data potensi ini? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmed) {
      return;
    }

    try {
      const response = await adminBeFetch(`potensi/admin/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus potensi');
      }

      await fetchItems();
      const message = 'Data potensi berhasil dihapus.';
      setNotice(message);
      showAdminToast(message, 'success');
    } catch {
      const message = 'Gagal menghapus data potensi.';
      setNotice(message);
      showAdminToast(message, 'error');
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Modul Potensi</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Kelola Potensi Desa</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
          Tahap MVP difokuskan ke dua kategori aktif: Pertanian dan Pariwisata. Aksi publik diseragamkan menjadi tombol
          Lihat Detail hingga ada konfirmasi lanjutan dari perangkat desa.
        </p>
        {notice ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Total Potensi</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{summary.total}</p>
        </article>
        <article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Pertanian</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{summary.pertanian}</p>
        </article>
        <article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Wisata</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{summary.wisata}</p>
        </article>
        <article className="rounded-[1.6rem] border border-sky-100 bg-sky-50/80 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Status Scope</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">UMKM ditunda</p>
          <p className="mt-1 text-xs text-slate-600">Masuk Next Phase sesuai PRD.</p>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="space-y-4 rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Aksi Cepat</h3>
              <p className="mt-1 text-sm text-slate-600">Pilih pekerjaan yang ingin dilakukan tanpa melihat form yang menumpuk.</p>
            </div>
          </div>
          <div className="space-y-3">
            <Link href="/admin/potensi/tambah" className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-sm">
              <p className="font-semibold text-slate-900">Tambah Potensi Baru</p>
              <p className="mt-1 text-sm text-slate-500">Gunakan form khusus untuk menambah data baru dengan lebih fokus.</p>
            </Link>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-900">
              Tip: untuk edit data, cukup buka daftar potensi di sebelah kanan lalu tekan tombol Edit pada item yang dipilih.
            </div>
          </div>
        </section>

        <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Daftar Potensi</h3>
              <p className="mt-1 text-sm text-slate-600">Perubahan di sini akan memengaruhi konten demo pada halaman publik potensi.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                Memuat data potensi...
              </article>
            ) : null}
            {!isLoading && items.length === 0 ? (
              <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                Belum ada data potensi tersedia.
              </article>
            ) : null}
            {items.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">{item.category}</p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                  <div className="relative h-20 w-28 overflow-hidden rounded-2xl">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="112px" />
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1">{item.tag}</span>
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">Aksi Publik: Lihat Detail</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/potensi/${item.id}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                    Edit
                  </Link>
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
