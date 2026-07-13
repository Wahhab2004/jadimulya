"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPotensiForm from '@/app/components/AdminPotensiForm';
import { initialPotensiItems, savePotensiItems, type PotensiItem } from '@/lib/potensi-store';

const emptyForm: Omit<PotensiItem, 'id'> = {
  title: '',
  description: '',
  category: 'UMKM',
  tag: '',
  actionLabel: '',
  imageUrl: '/images/potensi-umkm.jpg',
};

export default function AdminPotensiTambahPage() {
  const router = useRouter();
  const [formState, setFormState] = useState(emptyForm);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextId = `p-${Date.now()}`;
    const currentItemsRaw = typeof window !== 'undefined' ? window.localStorage.getItem('jadimulya_potensi_items') : null;
    const currentItems = currentItemsRaw ? (JSON.parse(currentItemsRaw) as PotensiItem[]) : initialPotensiItems;
    savePotensiItems([{ id: nextId, ...formState }, ...currentItems]);
    router.push('/admin/potensi');
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Potensi Desa</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Tambah Potensi Baru</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Isi satu data potensi dalam halaman khusus agar lebih fokus dan minim salah input.</p>
      </section>

      <AdminPotensiForm
        title="Form Tambah Potensi"
        description="Lengkapi data agar kartu potensi tampil rapi di halaman publik."
        formState={formState}
        onChange={setFormState}
        onSubmit={handleSubmit}
        submitLabel="Simpan Potensi"
        cancelHref="/admin/potensi"
      />
    </div>
  );
}