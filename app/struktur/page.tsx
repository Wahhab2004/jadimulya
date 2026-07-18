"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { strukturOrganisasi, type OrgMember } from "@/data/struktur-organisasi";

const themeGlow = {
	green: "from-emerald-500/30 to-emerald-500/0",
	blue: "from-sky-500/30 to-sky-500/0",
	teal: "from-cyan-500/30 to-cyan-500/0",
	orange: "from-orange-500/30 to-orange-500/0",
} as const;

const themeDot = {
	green: "bg-emerald-500",
	blue: "bg-sky-500",
	teal: "bg-cyan-500",
	orange: "bg-orange-500",
} as const;

const themeBadge = {
	green: "border-emerald-200 bg-emerald-50 text-emerald-700",
	blue: "border-sky-200 bg-sky-50 text-sky-700",
	teal: "border-cyan-200 bg-cyan-50 text-cyan-700",
	orange: "border-orange-200 bg-orange-50 text-orange-700",
} as const;

function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function getLevelLabel(level: number) {
	switch (level) {
		case 1:
			return "Pimpinan";
		case 2:
			return "Koordinator";
		case 3:
			return "Seksi";
		case 4:
			return "Urusan";
		case 5:
			return "Kewilayahan";
		default:
			return "Pendukung";
	}
}

function OrgMemberCard({
	member,
	onSelect,
}: {
	member: OrgMember;
	onSelect: (member: OrgMember) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => onSelect(member)}
			className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white text-left shadow-[0_12px_30px_-24px_rgba(15,23,42,0.85)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-26px_rgba(15,23,42,0.95)] focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
		>
			<div className="relative aspect-[4/5] w-full overflow-hidden">
				{member.photoUrl ? (
					<img
						src={member.photoUrl}
						alt={member.name}
						className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-slate-100">
						<span className="text-3xl font-semibold text-slate-700">
							{getInitials(member.name)}
						</span>
					</div>
				)}
				<div
					className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${themeGlow[member.colorTheme]}`}
				/>
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
				<div className="absolute bottom-4 left-4 right-4">
					<span
						className={`mb-2 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] ${themeBadge[member.colorTheme]}`}
					>
						{getLevelLabel(member.level)}
					</span>
					<p className="line-clamp-2 text-lg font-semibold leading-tight text-white">
						{member.name}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3 px-4 py-4">
				<span
					className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${themeDot[member.colorTheme]}`}
					aria-hidden="true"
				/>
				<p className="line-clamp-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
					{member.position}
				</p>
			</div>
			<div className="border-t border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 transition group-hover:text-slate-900">
				Lihat profil lengkap
			</div>
		</button>
	);
}

function DetailDialog({
	member,
	onClose,
}: {
	member: OrgMember | null;
	onClose: () => void;
}) {
	if (!member) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-10"
			onClick={onClose}
		>
			<div
				className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="mb-5 flex items-start justify-between gap-4">
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						Detail Aparatur
					</p>
					<button
						type="button"
						onClick={onClose}
						className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 transition hover:bg-slate-100"
					>
						Tutup
					</button>
				</div>
				<div className="flex flex-col gap-6 sm:flex-row sm:items-center">
					<div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-slate-200 bg-slate-100">
						{member.photoUrl ? (
							<img
								src={member.photoUrl}
								alt={member.name}
								className="h-full w-full object-cover"
							/>
						) : (
							<span className="text-2xl font-semibold text-slate-700">
								{getInitials(member.name)}
							</span>
						)}
					</div>
					<div>
						<h2 className="text-2xl font-semibold text-slate-900">
							{member.name}
						</h2>
						<p className="mt-1 text-sm uppercase tracking-[0.2em] text-slate-500">
							{member.position}
						</p>
						<div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
							<p className="rounded-xl bg-slate-50 px-3 py-2">
								<span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
									Email
								</span>
								{member.contact?.email ?? "Belum tersedia"}
							</p>
							<p className="rounded-xl bg-slate-50 px-3 py-2 sm:col-span-2">
								<span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
									Telepon
								</span>
								{member.contact?.phone ?? "Belum tersedia"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function StrukturOrganisasiPage() {
	const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeLevel, setActiveLevel] = useState<number | "all">("all");
	const sortedMembers = useMemo(() => {
		return [...strukturOrganisasi].sort((a, b) => {
			if (a.level !== b.level) return a.level - b.level;
			return a.name.localeCompare(b.name);
		});
	}, []);

	useEffect(() => {
		if (!selectedMember) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setSelectedMember(null);
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [selectedMember]);

	const leader =
		sortedMembers.find((member) => member.parentId === null) ??
		sortedMembers[0];
	const teamMembers = sortedMembers.filter(
		(member) => member.id !== leader?.id,
	);

	const levelOptions = useMemo(
		() =>
			[...new Set(teamMembers.map((member) => member.level))].sort(
				(a, b) => a - b,
			),
		[teamMembers],
	);

	const filteredTeamMembers = useMemo(() => {
		const keyword = searchTerm.trim().toLowerCase();

		return teamMembers.filter((member) => {
			const matchLevel = activeLevel === "all" || member.level === activeLevel;
			const matchKeyword =
				!keyword ||
				member.name.toLowerCase().includes(keyword) ||
				member.position.toLowerCase().includes(keyword);

			return matchLevel && matchKeyword;
		});
	}, [teamMembers, searchTerm, activeLevel]);

	const stats = [
		{
			label: "Total Aparatur",
			value: sortedMembers.length,
		},
		{
			label: "Bidang Jabatan",
			value: levelOptions.length + 1,
		},
		{
			label: "Perangkat Ditampilkan",
			value: filteredTeamMembers.length + (leader ? 1 : 0),
		},
	];

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_15%_-15%,rgba(52,211,153,0.22),transparent_45%),radial-gradient(circle_at_95%_10%,rgba(56,189,248,0.16),transparent_35%),#f8fafc] text-slate-900">
			<Header />
			<main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
				<section className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_22px_44px_-30px_rgba(15,23,42,0.6)] backdrop-blur sm:p-8">
					<div className="flex flex-col gap-8">
						<div className="space-y-3 text-center sm:text-left">
							<p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
								Struktur Pemerintahan Desa Jadimulya
							</p>
							<h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
								Struktur Organisasi dan Tata Kelola Pemerintah Desa
							</h1>
							<p className="mx-auto max-w-3xl text-sm text-slate-600 sm:mx-0 sm:text-base">
								Halaman ini membantu warga mengenali peran, nama pejabat, dan
								jalur koordinasi pemerintah desa secara cepat. Pilih profil
								untuk melihat detail kontak dan informasi pendukung layanan.
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-3">
							{stats.map((item) => (
								<div
									key={item.label}
									className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
								>
									<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
										{item.label}
									</p>
									<p className="mt-1 text-2xl font-semibold text-slate-900">
										{item.value}
									</p>
								</div>
							))}
						</div>

						<div className="grid gap-3 rounded-2xl border border-slate-200/90 bg-white/80 p-3 sm:grid-cols-[1.4fr_1fr]">
							<label className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-within:border-emerald-300">
								<span className="mr-2 text-slate-400">Cari</span>
								<input
									type="text"
									value={searchTerm}
									onChange={(event) => setSearchTerm(event.target.value)}
									placeholder="Nama aparatur atau jabatan"
									className="h-full w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400"
								/>
							</label>
							<select
								value={String(activeLevel)}
								onChange={(event) => {
									const value = event.target.value;
									setActiveLevel(value === "all" ? "all" : Number(value));
								}}
								className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300"
							>
								<option value="all">Semua kategori jabatan</option>
								{levelOptions.map((level) => (
									<option key={level} value={level}>
										{getLevelLabel(level)}
									</option>
								))}
							</select>
						</div>

						{leader && (
							<div className="space-y-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
										Pimpinan Desa
									</p>
									<h2 className="mt-1 text-xl font-semibold text-slate-900">
										Kepala Desa
									</h2>
								</div>
								<div className="mx-auto w-full max-w-sm">
									<OrgMemberCard member={leader} onSelect={setSelectedMember} />
								</div>
							</div>
						)}

						<div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

						<div className="space-y-4">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<div>
									<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
										Perangkat Desa
									</p>
									<h2 className="mt-1 text-xl font-semibold text-slate-900">
										Tim Pelaksana Layanan
									</h2>
								</div>
								<p className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
									{filteredTeamMembers.length} profil ditemukan
								</p>
							</div>

							{filteredTeamMembers.length === 0 ? (
								<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
									<p className="text-sm font-semibold text-slate-700">
										Tidak ada profil yang cocok dengan pencarian Anda.
									</p>
									<p className="mt-1 text-sm text-slate-500">
										Coba kata kunci lain atau ubah filter kategori jabatan.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
									{filteredTeamMembers.map((member) => (
										<OrgMemberCard
											key={member.id}
											member={member}
											onSelect={setSelectedMember}
										/>
									))}
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
			<Footer />
			<DetailDialog
				member={selectedMember}
				onClose={() => setSelectedMember(null)}
			/>
		</div>
	);
}
