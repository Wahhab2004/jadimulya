'use client';

import { useMemo, useState } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { strukturOrganisasi, type OrgMember } from '@/data/struktur-organisasi';

const themeGlow = {
  green: 'from-emerald-500/30 to-emerald-500/0',
  blue: 'from-sky-500/30 to-sky-500/0',
  teal: 'from-cyan-500/30 to-cyan-500/0',
  orange: 'from-orange-500/30 to-orange-500/0',
} as const;

const themeDot = {
  green: 'bg-emerald-500',
  blue: 'bg-sky-500',
  teal: 'bg-cyan-500',
  orange: 'bg-orange-500',
} as const;

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function OrgMemberCard({ member, onSelect }: { member: OrgMember; onSelect: (member: OrgMember) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white text-left shadow-[0_12px_30px_-24px_rgba(15,23,42,0.85)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-26px_rgba(15,23,42,0.95)] focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {member.photoUrl ? (
          <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <span className="text-3xl font-semibold text-slate-700">{getInitials(member.name)}</span>
          </div>
        )}
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${themeGlow[member.colorTheme]}`} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="line-clamp-2 text-lg font-semibold leading-tight text-white">{member.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 py-4">
        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${themeDot[member.colorTheme]}`} aria-hidden="true" />
        <p className="line-clamp-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">{member.position}</p>
      </div>
    </button>
  );
}

function DetailDialog({ member, onClose }: { member: OrgMember | null; onClose: () => void }) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-slate-200 bg-slate-100">
            {member.photoUrl ? (
              <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-slate-700">{getInitials(member.name)}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{member.name}</h2>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-500">{member.position}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>NIP: {member.nip ?? '—'}</p>
              <p>Email: {member.contact?.email ?? '—'}</p>
              <p>Telepon: {member.contact?.phone ?? '—'}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StrukturOrganisasiPage() {
  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
  const sortedMembers = useMemo(() => {
    return [...strukturOrganisasi].sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });
  }, []);

  const leader = sortedMembers.find((member) => member.parentId === null) ?? sortedMembers[0];
  const teamMembers = sortedMembers.filter((member) => member.id !== leader?.id);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_-15%,rgba(52,211,153,0.22),transparent_45%),radial-gradient(circle_at_95%_10%,rgba(56,189,248,0.16),transparent_35%),#f8fafc] text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.6)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Pemerintah Desa Jadimulya</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Struktur Organisasi Pemerintahan Desa
              </h1>
              <p className="mx-auto max-w-3xl text-sm text-slate-600 sm:mx-0 sm:text-base">
                Tampilan kartu dibuat agar nyaman dibaca di semua ukuran layar: satu alur konten, tanpa pembagian level pada mobile, dan tanpa area yang terpotong di laptop.
              </p>
            </div>

            {leader && (
              <div className="mx-auto w-full max-w-sm">
                <OrgMemberCard member={leader} onSelect={setSelectedMember} />
              </div>
            )}

            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {teamMembers.map((member) => (
                <OrgMemberCard key={member.id} member={member} onSelect={setSelectedMember} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <DetailDialog member={selectedMember} onClose={() => setSelectedMember(null)} />
    </div>
  );
}
