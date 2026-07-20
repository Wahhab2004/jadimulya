"use client";

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  MEDIA_MAX_FILE_SIZE,
  isAllowedImageSize,
  isAllowedImageType,
  loadStoredMediaItems,
  readFileAsDataUrl,
  saveMediaItems,
  type MediaItem,
} from '@/lib/media-store';
import { showAdminToast } from '@/lib/admin-toast';

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setItems(loadStoredMediaItems());
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = filter.trim().toLowerCase();
    if (!keyword) {
      return items;
    }

    return items.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [items, filter]);

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const currentItems = loadStoredMediaItems();
    const uploadedItems: MediaItem[] = [];
    let rejectedCount = 0;

    for (const file of files) {
      if (!isAllowedImageType(file) || !isAllowedImageSize(file)) {
        rejectedCount += 1;
        continue;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        uploadedItems.push({
          id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          url: dataUrl,
          size: file.size,
          mimeType: file.type,
          createdAt: new Date().toISOString(),
        });
      } catch {
        rejectedCount += 1;
      }
    }

    const nextItems = [...uploadedItems, ...currentItems];
    setItems(nextItems);
    saveMediaItems(nextItems);

    if (uploadedItems.length === 0) {
      const message = 'Tidak ada file yang diunggah. Pastikan file adalah gambar dan ukuran maksimal 2 MB.';
      setNotice(message);
      showAdminToast(message, 'error');
    } else if (rejectedCount > 0) {
      const message = `${uploadedItems.length} file berhasil diunggah, ${rejectedCount} file ditolak.`;
      setNotice(message);
      showAdminToast(message, 'info');
    } else {
      const message = `${uploadedItems.length} file berhasil diunggah.`;
      setNotice(message);
      showAdminToast(message, 'success');
    }

    event.target.value = '';
  }

  function removeItem(id: string) {
    const confirmed = window.confirm('Hapus media ini dari library? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmed) {
      return;
    }

    const nextItems = items.filter((item) => item.id !== id);
    setItems(nextItems);
    saveMediaItems(nextItems);
    const message = 'Media berhasil dihapus dari daftar.';
    setNotice(message);
    showAdminToast(message, 'success');
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Modul Media</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Media Upload Dasar</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
          Upload gambar untuk konten homepage, potensi, sejarah, dan organisasi. Sistem memvalidasi format gambar dan
          ukuran file maksimal 2 MB.
        </p>
        {notice ? <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">{notice}</div> : null}
      </section>

      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Unggah Gambar</h3>
            <p className="text-sm text-slate-600">Format yang didukung: JPG, PNG, WEBP, SVG. Maksimal {formatFileSize(MEDIA_MAX_FILE_SIZE)} per file.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:from-sky-700 hover:to-blue-800">
            Pilih File
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          </label>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h3 className="text-xl font-semibold text-slate-900">Daftar Media</h3>
          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Cari nama file..."
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-300"
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            Belum ada media tersimpan.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="relative h-36 w-full overflow-hidden rounded-xl border border-slate-200">
                  <Image src={item.url} alt={item.name} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 33vw" />
                </div>
                <p className="mt-3 line-clamp-1 text-sm font-semibold text-slate-900" title={item.name}>{item.name}</p>
                <p className="mt-1 text-xs text-slate-500">{formatFileSize(item.size)} • {new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
