"use client";

import { useEffect, useMemo, useState } from "react";
import {
	loadRemoteMediaItems,
	loadStoredMediaItems,
	subscribeMediaLibraryUpdates,
	type MediaItem,
} from "@/lib/media-store";
import {
	type OrganisasiGroup,
	type OrganisasiMember,
} from "@/lib/organisasi-store";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch } from "@/lib/admin-api-client";

type OrganisasiFormState = Omit<OrganisasiMember, "id">;

const emptyForm: OrganisasiFormState = {
	name: "",
	position: "",
	group: "kaur-kasi",
	photoUrl: "",
	contact: {
		email: "",
		phone: "",
		whatsapp: "",
		facebook: "",
	},
};

const groupLabels: Record<OrganisasiGroup, string> = {
	"kepala-desa": "Kepala Desa",
	"sekretaris-desa": "Sekretaris Desa",
	"ketua-bpd": "Ketua BPD",
	"kaur-kasi": "Kaur / Kasi",
	"kepala-dusun": "Kepala Dusun",
	staf: "Staf Pendukung",
};

type BackendOfficialTier = "KEPALA_DESA" | "SEKDES_BPD" | "STAFF";

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
	if (official.tier === "KEPALA_DESA") {
		return "kepala-desa";
	}

	if (official.tier === "SEKDES_BPD") {
		return /bpd/i.test(official.position) ? "ketua-bpd" : "sekretaris-desa";
	}

	if (/dusun/i.test(official.position)) {
		return "kepala-dusun";
	}

	if (/staf|operator|admin/i.test(official.position)) {
		return "staf";
	}

	return "kaur-kasi";
}

function mapOfficialToMember(official: BackendOfficial): OrganisasiMember {
	return {
		id: official.id,
		name: official.fullName,
		position: official.position,
		group: getGroupFromOfficial(official),
		photoUrl: official.photoUrl ?? "",
		contact: {
			email: official.email ?? "",
			phone: official.phone ?? "",
			whatsapp: official.phone ?? "",
			facebook: official.facebookUrl ?? "",
		},
	};
}

function mapGroupToTier(group: OrganisasiGroup): BackendOfficialTier {
	if (group === "kepala-desa") {
		return "KEPALA_DESA";
	}

	if (group === "sekretaris-desa" || group === "ketua-bpd") {
		return "SEKDES_BPD";
	}

	return "STAFF";
}

function normalizeUrl(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return undefined;
	}

	if (trimmed.startsWith("/")) {
		if (typeof window !== "undefined") {
			return new URL(trimmed, window.location.origin).toString();
		}

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
	const [notice, setNotice] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fitur pencarian & filter UI
	const [searchQuery, setSearchQuery] = useState("");
	const [activeGroupFilter, setActiveGroupFilter] = useState<string>("ALL");

	useEffect(() => {
		void fetchMembers();

		let isMounted = true;

		const syncMediaItems = async () => {
			const initialItems = loadStoredMediaItems();
			if (isMounted) {
				setMediaItems(initialItems);
			}

			const remoteItems = await loadRemoteMediaItems();
			if (isMounted) {
				setMediaItems(remoteItems);
			}
		};

		void syncMediaItems();
		const unsubscribe = subscribeMediaLibraryUpdates(() => {
			setMediaItems(loadStoredMediaItems());
		});

		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, []);

	async function fetchMembers() {
		setIsLoading(true);

		try {
			const response = await adminBeFetch("organisasi/admin/all", {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error("Gagal mengambil data organisasi");
			}

			const payload = (await response.json()) as BackendResponse<
				BackendOfficial[]
			>;
			const nextMembers = Array.isArray(payload.data)
				? payload.data.map((item) => mapOfficialToMember(item))
				: [];

			setMembers(nextMembers);
		} catch {
			const message = "Tidak bisa memuat data organisasi dari backend.";
			setNotice(message);
			showAdminToast(message, "error");
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

	// Member terfilter berdasarkan pencarian & tab filter
	const filteredMembers = useMemo(() => {
		return members.filter((member) => {
			const matchesSearch =
				member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				member.position.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesGroup =
				activeGroupFilter === "ALL" || member.group === activeGroupFilter;
			return matchesSearch && matchesGroup;
		});
	}, [members, searchQuery, activeGroupFilter]);

	function validateForm() {
		if (!form.name.trim()) {
			return "Nama aparatur wajib diisi.";
		}

		if (!form.position.trim()) {
			return "Jabatan aparatur wajib diisi.";
		}

		if (!form.photoUrl?.trim()) {
			return "Foto aparatur wajib diisi.";
		}

		if (!normalizeUrl(form.photoUrl)) {
			return "URL foto aparatur tidak valid.";
		}

		const duplicate = members.some(
			(member) =>
				member.name.toLowerCase() === form.name.trim().toLowerCase() &&
				member.id !== editingId,
		);

		if (duplicate) {
			return "Nama aparatur sudah ada, gunakan nama berbeda.";
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

		setIsSubmitting(true);
		const body = {
			fullName: form.name.trim(),
			position: form.position.trim(),
			tier: mapGroupToTier(form.group),
			photoUrl: normalizeUrl(form.photoUrl ?? ""),
			email: form.contact.email?.trim() || undefined,
			phone:
				form.contact.whatsapp?.trim() ||
				form.contact.phone?.trim() ||
				undefined,
			facebookUrl: normalizeUrl(form.contact.facebook ?? ""),
		};

		const path = editingId
			? `organisasi/admin/${editingId}`
			: "organisasi/admin";
		const method = editingId ? "PATCH" : "POST";

		try {
			const response = await adminBeFetch(path, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				throw new Error("Gagal menyimpan organisasi");
			}

			await fetchMembers();
			setForm(emptyForm);
			setEditingId(null);
			const message = editingId
				? "Data aparatur berhasil diperbarui."
				: "Data aparatur berhasil ditambahkan.";
			setNotice(message);
			showAdminToast(message, "success");
		} catch {
			const message =
				"Gagal menyimpan data organisasi. Periksa format field URL/email.";
			setNotice(message);
			showAdminToast(message, "error");
		} finally {
			setIsSubmitting(false);
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
				email: member.contact.email ?? "",
				phone: member.contact.phone ?? "",
				whatsapp: member.contact.whatsapp ?? "",
				facebook: member.contact.facebook ?? "",
			},
		});
		setNotice("");
		// Auto scroll ke form di layar mobile
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	async function removeMember(id: string) {
		const confirmed = window.confirm(
			"Hapus data aparatur ini? Tindakan ini tidak bisa dibatalkan.",
		);
		if (!confirmed) {
			return;
		}

		try {
			const response = await adminBeFetch(`organisasi/admin/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Gagal menghapus organisasi");
			}

			await fetchMembers();
			if (editingId === id) {
				setEditingId(null);
				setForm(emptyForm);
			}
			const message = "Data aparatur berhasil dihapus.";
			setNotice(message);
			showAdminToast(message, "success");
		} catch {
			const message = "Gagal menghapus data organisasi.";
			setNotice(message);
			showAdminToast(message, "error");
		}
	}

	return (
		<div className="space-y-6 text-slate-800">
			{/* Header Banner */}
			<section className="relative overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
				<div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

				<div className="flex flex-col gap-2">
					<div className="inline-flex items-center gap-2 self-start rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
							/>
						</svg>
						Modul Organisasi & Aparatur
					</div>
					<h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
						Kelola Struktur SOTK Desa
					</h2>
					<p className="max-w-3xl text-sm leading-relaxed text-slate-500">
						Kelola susunan struktur organisasi pemerintah desa, info aparatur,
						kontak resmi, dan profil sosial media. Kolom NIP telah ditiadakan
						sesuai spesifikasi PRD.
					</p>
				</div>

				{notice && (
					<div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-xs font-medium text-sky-800">
						<span>{notice}</span>
						<button
							type="button"
							onClick={() => setNotice("")}
							className="text-sky-600 hover:text-sky-900"
						>
							✕
						</button>
					</div>
				)}
			</section>

			{/* Metrik Statistik Aparatur */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
				<article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm xl:col-span-2">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								Total Aparatur
							</p>
							<p className="mt-1 text-3xl font-extrabold text-slate-900">
								{isLoading ? "..." : members.length}
							</p>
						</div>
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
							<svg
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12"
								/>
							</svg>
						</div>
					</div>
					<p className="mt-3 text-[11px] font-medium text-slate-500">
						Terdaftar dalam sistem SOTK aktif
					</p>
				</article>

				{groupedSummary.slice(0, 4).map((item) => (
					<article
						key={item.group}
						className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300"
					>
						<p className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate">
							{item.label}
						</p>
						<p className="mt-1 text-2xl font-bold text-slate-900">
							{isLoading ? "..." : item.total}
						</p>
						<span className="mt-2 inline-block h-1 w-8 rounded-full bg-sky-500/40" />
					</article>
				))}
			</section>

			{/* Grid Utama (Form Editor & List Data) */}
			<section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
				{/* Panel Kiri: Form Editor */}
				<form
					onSubmit={saveMember}
					className="flex flex-col justify-between rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-sm"
				>
					<div className="space-y-5">
						<div className="flex items-center justify-between border-b border-slate-100 pb-4">
							<div>
								<h3 className="text-lg font-bold text-slate-900">
									{editingId ? "✏️ Edit Aparatur" : "➕ Tambah Aparatur Baru"}
								</h3>
								<p className="text-xs text-slate-500">
									{editingId
										? "Perbarui informasi profil & kontak aparatur"
										: "Isi formulir lengkap untuk menambahkan pejabat baru"}
								</p>
							</div>
							{editingId && (
								<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
									Mode Edit
								</span>
							)}
						</div>

						{/* Live Photo Preview */}
						<div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
							<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-200/60 shadow-inner">
								{form.photoUrl ? (
									// eslint-disable-next-next/no-img-element
									<img
										src={form.photoUrl}
										alt="Preview"
										className="h-full w-full object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).src =
												"https://placehold.co/150x150?text=Error";
										}}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-slate-400">
										<svg
											className="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="1.5"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
								)}
							</div>
							<div className="space-y-1 text-xs">
								<p className="font-semibold text-slate-800">
									Preview Foto Aparatur
								</p>
								<p className="text-slate-500">
									Gunakan URL langsung atau pilih berkas dari Media Library di
									bawah.
								</p>
							</div>
						</div>

						{/* Input Informasi Utama */}
						<div className="space-y-3">
							<label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
								Data Utama
							</label>

							<div>
								<input
									type="text"
									value={form.name}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											name: event.target.value,
										}))
									}
									placeholder="Nama Lengkap (Contoh: H. Ahmad Supardi, S.IP)"
									className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								/>
							</div>

							<div className="grid gap-3 sm:grid-cols-2">
								<input
									type="text"
									value={form.position}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											position: event.target.value,
										}))
									}
									placeholder="Jabatan Resmi"
									className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								/>

								<select
									value={form.group}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											group: event.target.value as OrganisasiGroup,
										}))
									}
									className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm font-medium text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								>
									{(Object.keys(groupLabels) as OrganisasiGroup[]).map(
										(group) => (
											<option key={group} value={group}>
												{groupLabels[group]}
											</option>
										),
									)}
								</select>
							</div>
						</div>

						{/* Input Foto & Media Picker */}
						<div className="space-y-3">
							<label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
								Integrasi Foto Profil
							</label>

							<input
								type="text"
								value={form.photoUrl}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										photoUrl: event.target.value,
									}))
								}
								placeholder="URL Foto Profil (https://...)"
								className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								required
							/>

							<select
								value=""
								onChange={(event) => {
									if (!event.target.value) return;
									setForm((current) => ({
										...current,
										photoUrl: event.target.value,
									}));
								}}
								className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
							>
								<option value="">📁 Pilih dari Media Library...</option>
								{mediaItems.map((item) => (
									<option key={item.id} value={item.url}>
										{item.name}
									</option>
								))}
							</select>
						</div>

						{/* Input Kontak & Sosial Media */}
						<div className="space-y-3">
							<label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
								Kontak & Informasi Sosial
							</label>

							<div className="grid gap-3 sm:grid-cols-2">
								<input
									type="email"
									value={form.contact.email ?? ""}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											contact: {
												...current.contact,
												email: event.target.value,
											},
										}))
									}
									placeholder="Alamat Email"
									className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								/>

								<input
									type="text"
									value={form.contact.phone ?? ""}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											contact: {
												...current.contact,
												phone: event.target.value,
											},
										}))
									}
									placeholder="Nomor Telepon Kantor/HP"
									className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								/>

								<input
									type="text"
									value={form.contact.whatsapp ?? ""}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											contact: {
												...current.contact,
												whatsapp: event.target.value,
											},
										}))
									}
									placeholder="Nomor WhatsApp"
									className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								/>

								<input
									type="text"
									value={form.contact.facebook ?? ""}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											contact: {
												...current.contact,
												facebook: event.target.value,
											},
										}))
									}
									placeholder="URL Profil Facebook"
									className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-sm text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
								/>
							</div>
						</div>
					</div>

					{/* Tombol Aksi Form */}
					<div className="mt-8 flex items-center gap-3 border-t border-slate-100 pt-5">
						<button
							type="submit"
							disabled={isSubmitting}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition hover:from-sky-700 hover:to-blue-700 disabled:opacity-50"
						>
							{isSubmitting ? (
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
							) : (
								<svg
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							)}
							<span>{editingId ? "Simpan Perubahan" : "Simpan Aparatur"}</span>
						</button>

						{editingId && (
							<button
								type="button"
								onClick={() => {
									setEditingId(null);
									setForm(emptyForm);
								}}
								className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
							>
								Batal
							</button>
						)}
					</div>
				</form>

				{/* Panel Kanan: Daftar Aparatur */}
				<section className="flex flex-col rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-sm">
					{/* Bar Pencarian & Filter */}
					<div className="space-y-4 border-b border-slate-100 pb-5">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<h3 className="text-lg font-bold text-slate-900">
								👥 Daftar Aparatur
							</h3>
							<span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 self-start sm:self-auto">
								{filteredMembers.length} Personel
							</span>
						</div>

						{/* Search Input */}
						<div className="relative">
							<svg
								className="absolute left-3.5 top-3 h-4 w-4 text-slate-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Cari berdasarkan nama atau jabatan..."
								className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs text-slate-800 transition focus:border-sky-500 focus:bg-white focus:outline-none"
							/>
						</div>

						{/* Filter Tabs */}
						<div className="flex flex-wrap gap-1.5 pt-1">
							<button
								type="button"
								onClick={() => setActiveGroupFilter("ALL")}
								className={`rounded-lg px-3 py-1 text-[11px] font-semibold transition ${
									activeGroupFilter === "ALL"
										? "bg-sky-600 text-white shadow-xs"
										: "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
								}`}
							>
								Semua
							</button>
							{(Object.keys(groupLabels) as OrganisasiGroup[]).map((group) => (
								<button
									key={group}
									type="button"
									onClick={() => setActiveGroupFilter(group)}
									className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
										activeGroupFilter === group
											? "bg-sky-600 text-white shadow-xs"
											: "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
									}`}
								>
									{groupLabels[group]}
								</button>
							))}
						</div>
					</div>

					{/* List Content */}
					<div className="mt-4 space-y-3 max-h-[680px] overflow-y-auto pr-1">
						{isLoading ? (
							<div className="space-y-3 py-2">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
									>
										<div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
										<div className="flex-1 space-y-2">
											<div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
											<div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
										</div>
									</div>
								))}
							</div>
						) : filteredMembers.length === 0 ? (
							<div className="flex h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-slate-400">
								<svg
									className="h-10 w-10 stroke-slate-300"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="1.5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
									/>
								</svg>
								<p className="mt-2 text-xs font-semibold text-slate-500">
									Aparatur tidak ditemukan
								</p>
								<p className="text-[11px] text-slate-400">
									Coba ubah kata kunci pencarian atau ganti filter grup.
								</p>
							</div>
						) : (
							filteredMembers.map((member) => (
								<article
									key={member.id}
									className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-sky-300 hover:shadow-md sm:flex-row sm:items-center"
								>
									<div className="flex items-center gap-3.5">
										{/* Avatar Foto */}
										<div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
											{member.photoUrl ? (
												// eslint-disable-next-next/no-img-element
												<img
													src={member.photoUrl}
													alt={member.name}
													className="h-full w-full object-cover"
													onError={(e) => {
														(e.target as HTMLImageElement).src =
															"https://placehold.co/100x100?text=Aparatur";
													}}
												/>
											) : (
												<div className="flex h-full w-full items-center justify-center font-bold text-slate-400">
													{member.name.charAt(0)}
												</div>
											)}
										</div>

										<div>
											<h4 className="font-bold text-slate-900 group-hover:text-sky-700">
												{member.name}
											</h4>
											<p className="text-xs font-medium text-slate-600">
												{member.position}
											</p>

											<div className="mt-1.5 flex flex-wrap items-center gap-2">
												<span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100">
													{groupLabels[member.group]}
												</span>

												{member.contact.email && (
													<span
														className="text-[10px] text-slate-400"
														title={member.contact.email}
													>
														✉️ {member.contact.email}
													</span>
												)}
												{member.contact.whatsapp && (
													<span className="text-[10px] text-slate-400">
														💬 {member.contact.whatsapp}
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex items-center gap-2 self-end sm:self-center">
										<button
											type="button"
											onClick={() => editMember(member)}
											className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
											title="Edit Aparatur"
										>
											<svg
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
												/>
											</svg>
										</button>

										<button
											type="button"
											onClick={() => removeMember(member.id)}
											className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
											title="Hapus Aparatur"
										>
											<svg
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</div>
								</article>
							))
						)}
					</div>
				</section>
			</section>
		</div>
	);
}
