"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPotensiForm, { type AdminPotensiFormState } from '@/app/components/AdminPotensiForm';
import { showAdminToast } from '@/lib/admin-toast';
import { adminBeFetch } from '@/lib/admin-api-client';

const emptyForm: AdminPotensiFormState = {
  name: '',
  shortDesc: '',
  fullDesc: '',
  category: 'PERTANIAN',
  coverImage: '',
  isHighlight: false,
};

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith('/')) {
    if (typeof window !== 'undefined') {
      return new URL(trimmed, window.location.origin).toString();
    }

    return undefined;
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    return undefined;
  }
}

export default function AdminPotensiTambahPage() {
  const router = useRouter();
  const [formState, setFormState] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);

    try {
      const response = await adminBeFetch('potensi/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name.trim(),
          shortDesc: formState.shortDesc.trim(),
          fullDesc: formState.fullDesc.trim() || undefined,
          category: formState.category,
          coverImage: normalizeUrl(formState.coverImage),
          isHighlight: formState.isHighlight,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menambah potensi');
      }

      showAdminToast('Potensi baru berhasil ditambahkan.', 'success');
      router.push('/admin/potensi');
    } catch {
      showAdminToast('Gagal menambah potensi. Periksa format input.', 'error');
    } finally {
      setIsSaving(false);
    }
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
        submitLabel={isSaving ? 'Menyimpan...' : 'Simpan Potensi'}
        cancelHref="/admin/potensi"
      />
    </div>
  );
}