"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminPotensiForm from '@/app/components/AdminPotensiForm';
import { initialPotensiItems, loadStoredPotensiItems, savePotensiItems, type PotensiItem } from '@/lib/potensi-store';

const emptyForm: Omit<PotensiItem, 'id'> = {
  title: '',
  description: '',
  category: 'UMKM',
  tag: '',
  actionLabel: '',
  imageUrl: '/images/potensi-umkm.jpg',
};

export default function AdminPotensiEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [formState, setFormState] = useState(emptyForm);

  useEffect(() => {
    const items = loadStoredPotensiItems();
    const foundItem = items.find((item) => item.id === params.id);

    if (!foundItem) {
      router.push('/admin/potensi');
      return;
    }

    setFormState({
      title: foundItem.title,
      description: foundItem.description,
      category: foundItem.category,
      tag: foundItem.tag,
      actionLabel: foundItem.actionLabel,
      imageUrl: foundItem.imageUrl,
    });
  }, [params.id, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const items = loadStoredPotensiItems();
    const nextItems = items.map((item) => (item.id === params.id ? { ...item, ...formState } : item));
    savePotensiItems(nextItems);
    router.push('/admin/potensi');
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Potensi Desa</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Edit Potensi</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Ubah data potensi yang dipilih tanpa bercampur dengan daftar item lain.</p>
      </section>

      <AdminPotensiForm
        title="Form Edit Potensi"
        description="Perbarui data agar halaman publik selalu sesuai kondisi terbaru."
        formState={formState}
        onChange={setFormState}
        onSubmit={handleSubmit}
        submitLabel="Simpan Perubahan"
        cancelHref="/admin/potensi"
      />
    </div>
  );
}