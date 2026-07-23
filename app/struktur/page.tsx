"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import {
  type OrganisasiGroup,
  type OrganisasiMember,
} from '@/lib/organisasi-store';
import { getOrganisasi, type BackendOrganisasiItem } from '@/lib/api';

function mapTierToGroup(item: BackendOrganisasiItem): OrganisasiGroup {
	if (item.tier === "KEPALA_DESA") {
		return "kepala-desa";
	}

	if (item.tier === "SEKDES_BPD") {
		return /bpd/i.test(item.position) ? "ketua-bpd" : "sekretaris-desa";
	}

	if (/dusun/i.test(item.position)) {
		return "kepala-dusun";
	}

	if (/staf|operator|admin/i.test(item.position)) {
		return "staf";
	}

	return "kaur-kasi";
}

function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function cleanPhoneForWa(phone: string) {
	const cleaned = phone.replace(/\D/g, "");
	if (cleaned.startsWith("0")) {
		return "62" + cleaned.slice(1);
	}
	return cleaned;
}

function ContactField({
	label,
	value,
	href,
}: {
	label: string;
	value?: string;
	href?: string;
}) {
	const hasValue = Boolean(value && value.trim());

	return (
		<div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
			<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
				{label}
			</p>
			{hasValue && href ? (
				<a
					href={href}
					target="_blank"
					rel="noreferrer"
					className="mt-0.5 block text-sm font-semibold text-sky-700 hover:underline truncate"
				>
					{value}
				</a>
			) : (
				<p className="mt-0.5 text-sm font-medium text-slate-700 truncate">
					{hasValue ? value : "Belum tersedia"}
				</p>
			)}
		</div>
	);
}

function MemberCard({
	member,
	onSelect,
}: {
	member: OrganisasiMember;
	onSelect: (item: OrganisasiMember) => void;
}) {
	const rawPhone = member.contact.whatsapp || member.contact.phone;
	const waNumber = rawPhone ? cleanPhoneForWa(rawPhone) : "";

	return (
		<div
			onClick={() => onSelect(member)}
			className="group relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
		>
			{/* Background Foto Profil */}
			{member.photoUrl ? (
				<Image
					src={member.photoUrl}
					alt={member.name}
					fill
					className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-3xl font-extrabold text-slate-400">
					{getInitials(member.name)}
				</div>
			)}

			{/* Top Action Buttons (Glassmorphism Effect) */}
			<div className="absolute top-4 right-4 z-10 flex items-center gap-2">
				{waNumber ? (
					<a
						href={`https://wa.me/${waNumber}`}
						target="_blank"
						rel="noreferrer"
						onClick={(e) => e.stopPropagation()}
						title="Hubungi via WhatsApp"
						className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 transition hover:bg-white hover:text-emerald-600 hover:scale-110 shadow-lg"
					>
						<svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
							<path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
						</svg>
					</a>
				) : null}

				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onSelect(member);
					}}
					title="Lihat Detail Profil"
					className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 transition hover:bg-white hover:text-sky-600 hover:scale-110 shadow-lg"
				>
					<svg
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						/>
					</svg>
				</button>
			</div>

			{/* Bottom Gradient & Info Overlay */}
			<div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-5 text-white pt-16">
				<div>
					<span className="inline-block rounded-full bg-sky-500/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-sky-200 backdrop-blur-md border border-sky-400/30">
						{member.position}
					</span>
					<h3 className="mt-2 text-xl font-bold leading-tight tracking-tight text-white group-hover:text-sky-200 transition">
						{member.name}
					</h3>
				</div>

				{/* Micro Info Contacts */}
				<div className="mt-3.5 space-y-1.5 border-t border-white/10 pt-3 text-xs text-slate-300">
					{member.contact.phone ? (
						<div className="flex items-center gap-2">
							<svg
								className="h-3.5 w-3.5 shrink-0 text-sky-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
							<span className="truncate">{member.contact.phone}</span>
						</div>
					) : null}

					{member.contact.email ? (
						<div className="flex items-center gap-2">
							<svg
								className="h-3.5 w-3.5 shrink-0 text-sky-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
							<span className="truncate">{member.contact.email}</span>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

function DetailDialog({
	member,
	onClose,
}: {
	member: OrganisasiMember | null;
	onClose: () => void;
}) {
	if (!member) {
		return null;
	}

	const waNumber =
		member.contact.whatsapp || member.contact.phone
			? cleanPhoneForWa(member.contact.whatsapp || member.contact.phone)
			: "";

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm transition-all"
			onClick={onClose}
		>
			<div
				className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl transition-all"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
					<div>
						<span className="inline-block rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700">
							{member.position}
						</span>
						<h2 className="mt-2 text-2xl font-bold text-slate-900">
							{member.name}
						</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
					>
						<svg
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div className="mt-6 grid gap-3 sm:grid-cols-2">
					<ContactField
						label="Telepon"
						value={member.contact.phone}
						href={
							member.contact.phone ? `tel:${member.contact.phone}` : undefined
						}
					/>
					<ContactField
						label="WhatsApp"
						value={member.contact.whatsapp || member.contact.phone}
						href={waNumber ? `https://wa.me/${waNumber}` : undefined}
					/>
					<ContactField
						label="Email Resmi"
						value={member.contact.email}
						href={
							member.contact.email
								? `mailto:${member.contact.email}`
								: undefined
						}
					/>
					<ContactField
						label="Facebook"
						value={member.contact.facebook}
						href={member.contact.facebook || undefined}
					/>
				</div>

				<div className="mt-6 flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-800 transition"
					>
						Selesai
					</button>
				</div>
			</div>
		</div>
	);
}

export default function StrukturOrganisasiPage() {
  const [members, setMembers] = useState<OrganisasiMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<OrganisasiMember | null>(null);

  useEffect(() => {
   
    void (async () => {
      try {
        const apiMembers = await getOrganisasi();
        const mappedMembers = apiMembers.map((item) => ({
          id: item.id,
          name: item.fullName,
          position: item.position,
          group: mapTierToGroup(item),
          photoUrl: item.photoUrl ?? '',
          contact: {
            email: item.email ?? '',
            phone: item.phone ?? '',
            whatsapp: item.phone ?? '',
            facebook: item.facebookUrl ?? '',
          },
        } satisfies OrganisasiMember));

				if (mappedMembers.length > 0) {
					setMembers(mappedMembers);
				}
			} catch {
				// Modul fallback jika API belum terhubung
			}
		})();
	}, []);

	const kepalaDesa = useMemo(
		() => members.find((member) => member.group === "kepala-desa") ?? null,
		[members],
	);

	const secondRow = useMemo(() => {
		const sekdes = members.find((member) => member.group === "sekretaris-desa");
		const ketuaBpd = members.find((member) => member.group === "ketua-bpd");
		return [sekdes, ketuaBpd].filter((item): item is OrganisasiMember =>
			Boolean(item),
		);
	}, [members]);

	const restMembers = useMemo(
		() =>
			members.filter(
				(member) =>
					member.id !== kepalaDesa?.id &&
					!secondRow.some((rowMember) => rowMember.id === member.id),
			),
		[members, kepalaDesa?.id, secondRow],
	);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
			<Header />
			<main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
				{/* Header Banner */}
				<section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
					<div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />
					<div className="relative z-10 max-w-3xl">
						<div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700 border border-sky-100">
							<span className="h-1.5 w-1.5 rounded-full bg-sky-600 animate-pulse" />
							SOTK Desa Jadimulya
						</div>
						<h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
							Struktur Organisasi & Tata Kelola
						</h1>
						<p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
							Daftar resmi aparatur Pemerintahan Desa Jadimulya beserta kontak
							layanan masyarakat. Klik pada profil aparatur untuk opsi
							komunikasi langsung.
						</p>
					</div>
				</section>

				{/* Level 1: Kepala Desa */}
				{kepalaDesa ? (
					<section className="mt-10">
						<div className="mb-4 flex items-center justify-center gap-3">
							<span className="h-px w-12 bg-slate-200" />
							<h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
								Pimpinan Desa
							</h2>
							<span className="h-px w-12 bg-slate-200" />
						</div>
						<div className="mx-auto max-w-xs sm:max-w-sm">
							<MemberCard member={kepalaDesa} onSelect={setSelectedMember} />
						</div>
					</section>
				) : null}

				{/* Level 2: Sekdes & BPD */}
				{secondRow.length > 0 ? (
					<section className="mt-12">
						<div className="mb-6 flex items-center justify-center gap-3">
							<span className="h-px w-12 bg-slate-200" />
							<h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
								Pimpinan Sekretariat & BPD
							</h2>
							<span className="h-px w-12 bg-slate-200" />
						</div>
						<div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
							{secondRow.map((member) => (
								<MemberCard
									key={member.id}
									member={member}
									onSelect={setSelectedMember}
								/>
							))}
						</div>
					</section>
				) : null}

				{/* Level 3: Kaur, Kasi, Kadusun */}
				<section className="mt-12">
					<div className="mb-6 flex items-center justify-center gap-3">
						<span className="h-px w-12 bg-slate-200" />
						<h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
							Kaur, Kasi & Kepala Dusun
						</h2>
						<span className="h-px w-12 bg-slate-200" />
					</div>

					{restMembers.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
							Data aparatur desa sedang dalam proses pembaruan.
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
							{restMembers.map((member) => (
								<MemberCard
									key={member.id}
									member={member}
									onSelect={setSelectedMember}
								/>
							))}
						</div>
					)}
				</section>
			</main>
			<Footer />

			{/* Modal Dialog Detail */}
			<DetailDialog
				member={selectedMember}
				onClose={() => setSelectedMember(null)}
			/>
		</div>
	);
}
