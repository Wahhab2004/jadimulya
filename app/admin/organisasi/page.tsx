"use client";

import { useEffect, useMemo, useState } from 'react';
import { loadStoredMediaItems, type MediaItem } from '@/lib/media-store';
import {
  type OrganisasiGroup,
  type OrganisasiMember,
} from '@/lib/organisasi-store';
import { showAdminToast } from '@/lib/admin-toast';

type OrganisasiFormState = Omit<OrganisasiMember, 'id'>;

const emptyForm: OrganisasiFormState = {
  name: '',
  position: '',
  group: 'kaur-kasi',
  photoUrl: '',
  contact: {
    email: '',
    phone: '',
    whatsapp: '',
    facebook: '',
  },
};

const groupLabels: Record<OrganisasiGroup, string> = {
  'kepala-desa': 'Kepala Desa',
  'sekretaris-desa': 'Sekretaris Desa',
  'ketua-bpd': 'Ketua BPD',
  'kaur-kasi': 'Kaur / Kasi',
  'kepala-dusun': 'Kepala Dusun',
  staf: 'Staf Pendukung',
};

type BackendOfficialTier = 'KEPALA_DESA' | 'SEKDES_BPD' | 'STAFF';

type BackendOfficial = {
  id: string;
  fullName: string;
  position: string;
  tier: BackendOfficialTier;
  photoUrl: string | null;
  email: string | null;
  phone: string | null;
  facebookUrl: string | null;
};

type BackendResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

function getGroupFromOfficial(official: BackendOfficial): OrganisasiGroup {
  if (official.tier === 'KEPALA_DESA') {
    return 'kepala-desa';
  }

  if (official.tier === 'SEKDES_BPD') {
    return /bpd/i.test(official.position) ? 'ketua-bpd' : 'sekretaris-desa';
  }

  if (/dusun/i.test(official.position)) {
    return 'kepala-dusun';
  }

  if (/staf|operator|admin/i.test(official.position)) {
    return 'staf';
  }

  return 'kaur-kasi';
}

function mapOfficialToMember(official: BackendOfficial): OrganisasiMember {
  return {
    id: official.id,
    name: official.fullName,
    position: official.position,
    group: getGroupFromOfficial(official),
    photoUrl: official.photoUrl ?? '',
    contact: {
      email: official.email ?? '',
      phone: official.phone ?? '',
      whatsapp: official.phone ?? '',
      facebook: official.facebookUrl ?? '',
    },
  };
}

function mapGroupToTier(group: OrganisasiGroup): BackendOfficialTier {
  if (group === 'kepala-desa') {
    return 'KEPALA_DESA';
  }

  if (group === 'sekretaris-desa' || group === 'ketua-bpd') {
    return 'SEKDES_BPD';
  }

  return 'STAFF';
}

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.toString();
  } catch {
    return undefined;
  }
}

export default function AdminOrganisasiPage() {
  const [members, setMembers] = useState<OrganisasiMember[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [form, setForm] = useState<OrganisasiFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void fetchMembers();
    setMediaItems(loadStoredMediaItems());
  }, []);

  async function fetchMembers() {
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/be/organisasi/admin/all', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil data organisasi');
      }

      const payload = (await response.json()) as BackendResponse<BackendOfficial[]>;
      const nextMembers = Array.isArray(payload.data)
        ? payload.data.map((item) => mapOfficialToMember(item))
        : [];

      setMembers(nextMembers);
    } catch {
      const message = 'Tidak bisa memuat data organisasi dari backend.';
      setNotice(message);
      showAdminToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const groupedSummary = useMemo(() => {
    return (Object.keys(groupLabels) as OrganisasiGroup[]).map((group) => ({
      group,
      label: groupLabels[group],
      total: members.filter((member) => member.group === group).length,
    }));
  }, [members]);

  function validateForm() {
    if (!form.name.trim()) {
      return 'Nama aparatur wajib diisi.';
    }

    if (!form.position.trim()) {
      return 'Jabatan aparatur wajib diisi.';
    }

    const duplicate = members.some(
      (member) => member.name.toLowerCase() === form.name.trim().toLowerCase() && member.id !== editingId
    );

    if (duplicate) {
      return 'Nama aparatur sudah ada, gunakan nama berbeda.';
    }

    return null;
  }

  async function saveMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setNotice(validationError);
      return;
    }

    const body = {
      fullName: form.name.trim(),
      position: form.position.trim(),
      tier: mapGroupToTier(form.group),
      photoUrl: normalizeUrl(form.photoUrl ?? ''),
      email: form.contact.email?.trim() || undefined,
      phone: (form.contact.whatsapp?.trim() || form.contact.phone?.trim()) || undefined,
      facebookUrl: normalizeUrl(form.contact.facebook ?? ''),
    };

    const endpoint = editingId ? `/api/admin/be/organisasi/admin/${editingId}` : '/api/admin/be/organisasi/admin';
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan organisasi');
      }

      await fetchMembers();
      setForm(emptyForm);
      setEditingId(null);
      const message = editingId ? 'Data aparatur berhasil diperbarui.' : 'Data aparatur berhasil ditambahkan.';
      setNotice(message);
      showAdminToast(message, 'success');
    } catch {
      const message = 'Gagal menyimpan data organisasi. Periksa format field URL/email.';
      setNotice(message);
      showAdminToast(message, 'error');
    }
  }

  function editMember(member: OrganisasiMember) {
    setEditingId(member.id);
    setForm({
      name: member.name,
      position: member.position,
      group: member.group,
      photoUrl: member.photoUrl,
      contact: {
        email: member.contact.email ?? '',
        phone: member.contact.phone ?? '',
        whatsapp: member.contact.whatsapp ?? '',
        facebook: member.contact.facebook ?? '',
      },
    });
  }

  async function removeMember(id: string) {
    const confirmed = window.confirm('Hapus data aparatur ini? Tindakan ini tidak bisa dibatalkan.');
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/be/organisasi/admin/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus organisasi');
      }

      await fetchMembers();
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      const message = 'Data aparatur berhasil dihapus.';
      setNotice(message);
      showAdminToast(message, 'success');
    } catch {
      const message = 'Gagal menghapus data organisasi.';
      setNotice(message);
      showAdminToast(message, 'error');
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Modul Organisasi</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Kelola Struktur Organisasi SOTK</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
          Form ini mendukung data kontak email, nomor telepon/WhatsApp, dan akun Facebook per aparatur. Kolom NIP
          sengaja dihilangkan sesuai PRD terbaru.
        </p>
        {notice ? <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">{notice}</div> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <article className="rounded-[1.4rem] border border-slate-200 bg-white p-4 xl:col-span-2">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Total Aparatur</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{members.length}</p>
        </article>
        {groupedSummary.slice(0, 4).map((item) => (
          <article key={item.group} className="rounded-[1.4rem] border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{item.total}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <form onSubmit={saveMember} className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
          <h3 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Aparatur' : 'Tambah Aparatur'}</h3>

          <div className="mt-4 space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Nama aparatur"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
            <input
              type="text"
              value={form.position}
              onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))}
              placeholder="Jabatan"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
            <select
              value={form.group}
              onChange={(event) => setForm((current) => ({ ...current, group: event.target.value as OrganisasiGroup }))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            >
              {(Object.keys(groupLabels) as OrganisasiGroup[]).map((group) => (
                <option key={group} value={group}>{groupLabels[group]}</option>
              ))}
            </select>

            <input
              type="text"
              value={form.photoUrl}
              onChange={(event) => setForm((current) => ({ ...current, photoUrl: event.target.value }))}
              placeholder="URL foto profil"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />

            <select
              value=""
              onChange={(event) => {
                if (!event.target.value) return;
                setForm((current) => ({ ...current, photoUrl: event.target.value }));
              }}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-300"
            >
              <option value="">Pilih foto dari media library</option>
              {mediaItems.map((item) => (
                <option key={item.id} value={item.url}>{item.name}</option>
              ))}
            </select>

            <input
              type="email"
              value={form.contact.email ?? ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contact: { ...current.contact, email: event.target.value },
                }))
              }
              placeholder="Email"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
            <input
              type="text"
              value={form.contact.phone ?? ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contact: { ...current.contact, phone: event.target.value },
                }))
              }
              placeholder="Nomor telepon"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
            <input
              type="text"
              value={form.contact.whatsapp ?? ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contact: { ...current.contact, whatsapp: event.target.value },
                }))
              }
              placeholder="Nomor WhatsApp"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
            <input
              type="text"
              value={form.contact.facebook ?? ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  contact: { ...current.contact, facebook: event.target.value },
                }))
              }
              placeholder="URL Facebook"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:from-sky-700 hover:to-blue-800">
              {editingId ? 'Simpan Perubahan' : 'Tambah Aparatur'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                Batal
              </button>
            ) : null}
          </div>
        </form>

        <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
          <h3 className="text-xl font-semibold text-slate-900">Daftar Aparatur</h3>
          <div className="mt-4 space-y-2">
            {isLoading ? (
              <article className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                Memuat data organisasi...
              </article>
            ) : null}
            {!isLoading && members.length === 0 ? (
              <article className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                Belum ada data aparatur tersimpan.
              </article>
            ) : null}
            {members.map((member) => (
              <article key={member.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-600">{member.position}</p>
                    <p className="mt-1 text-xs text-slate-500">{groupLabels[member.group]}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Email: {member.contact.email || '-'} • WA: {member.contact.whatsapp || '-'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editMember(member)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
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
