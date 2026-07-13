"use client";

import type { PotensiCategory, PotensiItem } from '@/lib/potensi-store';

type AdminPotensiFormProps = {
  title: string;
  description: string;
  formState: Omit<PotensiItem, 'id'>;
  onChange: (nextState: Omit<PotensiItem, 'id'>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  cancelHref: string;
};

export default function AdminPotensiForm({
  title,
  description,
  formState,
  onChange,
  onSubmit,
  submitLabel,
  cancelHref,
}: AdminPotensiFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Judul</span>
        <input
          type="text"
          value={formState.title}
          onChange={(event) => onChange({ ...formState, title: event.target.value })}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Kategori</span>
        <select
          value={formState.category}
          onChange={(event) => onChange({ ...formState, category: event.target.value as PotensiCategory })}
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
          onChange={(event) => onChange({ ...formState, tag: event.target.value })}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Label Tombol</span>
        <input
          type="text"
          value={formState.actionLabel}
          onChange={(event) => onChange({ ...formState, actionLabel: event.target.value })}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">URL Gambar</span>
        <input
          type="text"
          value={formState.imageUrl}
          onChange={(event) => onChange({ ...formState, imageUrl: event.target.value })}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">Deskripsi</span>
        <textarea
          value={formState.description}
          onChange={(event) => onChange({ ...formState, description: event.target.value })}
          className="min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
          required
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800">
          {submitLabel}
        </button>
        <a href={cancelHref} className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          Kembali
        </a>
      </div>
    </form>
  );
}