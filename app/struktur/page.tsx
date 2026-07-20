"use client";

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import {
  initialOrganisasiMembers,
  loadStoredOrganisasiMembers,
  type OrganisasiMember,
} from '@/lib/organisasi-store';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function ContactField({ label, value }: { label: string; value?: string }) {
  return (
    <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</span>
      {value && value.trim() ? value : 'Belum tersedia'}
    </p>
  );
}

function MemberCard({ member, onSelect }: { member: OrganisasiMember; onSelect: (item: OrganisasiMember) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="group w-full overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-48 w-full bg-slate-100">
        {member.photoUrl ? (
          <Image src={member.photoUrl} alt={member.name} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 25vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl font-semibold text-slate-600">{getInitials(member.name)}</div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <p className="line-clamp-2 text-lg font-semibold text-white">{member.name}</p>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-200">{member.position}</p>
        </div>
      </div>
      <div className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 group-hover:text-slate-900">Lihat kontak</div>
    </button>
  );
}

function DetailDialog({ member, onClose }: { member: OrganisasiMember | null; onClose: () => void }) {
  if (!member) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-[1.8rem] bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Profil Aparatur</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{member.name}</h2>
            <p className="mt-1 text-sm uppercase tracking-[0.16em] text-slate-500">{member.position}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
            Tutup
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ContactField label="Email" value={member.contact.email} />
          <ContactField label="Telepon" value={member.contact.phone} />
          <ContactField label="WhatsApp" value={member.contact.whatsapp} />
          <ContactField label="Facebook" value={member.contact.facebook} />
        </div>
      </div>
    </div>
  );
}

export default function StrukturOrganisasiPage() {
  const [members, setMembers] = useState<OrganisasiMember[]>(initialOrganisasiMembers);
  const [selectedMember, setSelectedMember] = useState<OrganisasiMember | null>(null);

  useEffect(() => {
    setMembers(loadStoredOrganisasiMembers());
  }, []);

  const kepalaDesa = useMemo(
    () => members.find((member) => member.group === 'kepala-desa') ?? null,
    [members]
  );

  const secondRow = useMemo(() => {
    const sekdes = members.find((member) => member.group === 'sekretaris-desa');
    const ketuaBpd = members.find((member) => member.group === 'ketua-bpd');
    return [sekdes, ketuaBpd].filter((item): item is OrganisasiMember => Boolean(item));
  }, [members]);

  const restMembers = useMemo(
    () =>
      members.filter(
        (member) =>
          member.id !== kepalaDesa?.id && !secondRow.some((rowMember) => rowMember.id === member.id)
      ),
    [members, kepalaDesa?.id, secondRow]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">SOTK Desa Jadimulya</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Struktur Organisasi dan Tata Kelola Pemerintah Desa (SOTK)</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Menampilkan aparatur desa beserta kontak resmi email, telepon/WhatsApp, dan Facebook untuk memudahkan koordinasi warga.
          </p>
        </section>

        {kepalaDesa ? (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Kepala Desa</h2>
            <div className="mx-auto max-w-sm">
              <MemberCard member={kepalaDesa} onSelect={setSelectedMember} />
            </div>
          </section>
        ) : null}

        {secondRow.length > 0 ? (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Sekretaris Desa dan Ketua BPD</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {secondRow.map((member) => (
                <MemberCard key={member.id} member={member} onSelect={setSelectedMember} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Kaur, Kasi, dan Kepala Dusun</h2>
          {restMembers.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 text-sm text-slate-600">Data aparatur belum tersedia.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {restMembers.map((member) => (
                <MemberCard key={member.id} member={member} onSelect={setSelectedMember} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <DetailDialog member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
}
