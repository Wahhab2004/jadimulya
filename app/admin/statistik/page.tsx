"use client";

import { useEffect, useMemo, useState } from "react";
import { showAdminToast } from "@/lib/admin-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type DusunItem = {
	id: string;
	dusunName: string;
	totalKK: number;
	maleCount: number;
	femaleCount: number;
	dataYear: number;
	sortOrder?: number;
};

type AgeGroupItem = {
	id: string;
	label: string;
	value: number;
};

type OccupationItem = {
	id: string;
	label: string;
	value: number;
};

type BackendResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

type ActiveTab = "overview" | "dusun" | "usia" | "pekerjaan";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(value: number) {
	return value.toLocaleString("id-ID");
}

function toNum(value: unknown): number {
	if (typeof value === "number" && isFinite(value))
		return Math.max(0, Math.round(value));
	if (typeof value === "string") {
		const parsed = Number(value.replace(/[^\d.-]/g, ""));
		if (isFinite(parsed)) return Math.max(0, Math.round(parsed));
	}
	return 0;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`/api/admin/be/${path}`, {
		cache: "no-store",
		...options,
	});
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	const json = (await res.json()) as BackendResponse<T>;
	return json.data;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();
const EMPTY_DUSUN = {
	dusunName: "",
	totalKK: 0,
	maleCount: 0,
	femaleCount: 0,
	dataYear: CURRENT_YEAR,
};
const EMPTY_AGE = { label: "", value: 0 };
const EMPTY_OCC = { label: "", value: 0 };

const INPUT_CLS =
	"h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300";
const LABEL_CLS = "block text-xs font-semibold text-slate-600 mb-1";
const BTN_PRIMARY =
	"h-9 rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800 transition disabled:opacity-50";
const BTN_SECONDARY =
	"h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition";
const BTN_DANGER =
	"h-8 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100 transition";
const BTN_EDIT =
	"h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition";

export default function AdminStatistikPage() {
	// ── Data state ──────────────────────────────────────────────────────────────
	const [dusun, setDusun] = useState<DusunItem[]>([]);
	const [ageGroups, setAgeGroups] = useState<AgeGroupItem[]>([]);
	const [occupations, setOccupations] = useState<OccupationItem[]>([]);
	const [updatedAt, setUpdatedAt] = useState(
		new Date().toISOString().slice(0, 10),
	);
	const [isLoading, setIsLoading] = useState(false);

	// ── UI state ─────────────────────────────────────────────────────────────────
	const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
	const [searchTerm, setSearchTerm] = useState("");
	const [showPadatOnly, setShowPadatOnly] = useState(false);

	// ── Dusun CRUD state ─────────────────────────────────────────────────────────
	const [dusunForm, setDusunForm] = useState(EMPTY_DUSUN);
	const [editingDusunId, setEditingDusunId] = useState<string | null>(null);
	const [showDusunForm, setShowDusunForm] = useState(false);
	const [savingDusun, setSavingDusun] = useState(false);

	// ── Age group CRUD state ──────────────────────────────────────────────────────
	const [ageForm, setAgeForm] = useState(EMPTY_AGE);
	const [editingAgeId, setEditingAgeId] = useState<string | null>(null);
	const [showAgeForm, setShowAgeForm] = useState(false);
	const [savingAge, setSavingAge] = useState(false);

	// ── Occupation CRUD state ─────────────────────────────────────────────────────
	const [occForm, setOccForm] = useState(EMPTY_OCC);
	const [editingOccId, setEditingOccId] = useState<string | null>(null);
	const [showOccForm, setShowOccForm] = useState(false);
	const [savingOcc, setSavingOcc] = useState(false);

	// ── Fetch ─────────────────────────────────────────────────────────────────────
	useEffect(() => {
		void fetchAll();
	}, []);

	async function fetchAll() {
		setIsLoading(true);
		await Promise.allSettled([
			fetchDusun(),
			fetchAgeGroups(),
			fetchOccupations(),
		]);
		setIsLoading(false);
	}

	async function fetchDusun() {
		try {
			const items = await apiFetch<DusunItem[]>("demografi/admin/dusun");
			setDusun(Array.isArray(items) ? items : []);
			setUpdatedAt(new Date().toISOString().slice(0, 10));
		} catch {
			showAdminToast("Gagal memuat data per dusun dari backend.", "error");
		}
	}

	async function fetchAgeGroups() {
		try {
			const items = await apiFetch<AgeGroupItem[]>("demografi/admin/usia");
			setAgeGroups(Array.isArray(items) ? items : []);
		} catch {
			showAdminToast("Gagal memuat data kelompok usia dari backend.", "error");
		}
	}

	async function fetchOccupations() {
		try {
			const items = await apiFetch<OccupationItem[]>(
				"demografi/admin/pekerjaan",
			);
			setOccupations(Array.isArray(items) ? items : []);
		} catch {
			showAdminToast(
				"Gagal memuat data jenis pekerjaan dari backend.",
				"error",
			);
		}
	}

	// ── Derived summary ───────────────────────────────────────────────────────────
	const summary = useMemo(
		() =>
			dusun.reduce(
				(acc, item) => ({
					totalPopulation:
						acc.totalPopulation + item.maleCount + item.femaleCount,
					households: acc.households + item.totalKK,
					male: acc.male + item.maleCount,
					female: acc.female + item.femaleCount,
				}),
				{ totalPopulation: 0, households: 0, male: 0, female: 0 },
			),
		[dusun],
	);

	const malePercent = summary.totalPopulation
		? Math.round((summary.male / summary.totalPopulation) * 1000) / 10
		: 0;
	const femalePercent = summary.totalPopulation
		? Math.round((summary.female / summary.totalPopulation) * 1000) / 10
		: 0;
	const maleDeg = Math.round((malePercent / 100) * 360);

	const maxAgeValue = useMemo(
		() => Math.max(1, ...ageGroups.map((item) => item.value)),
		[ageGroups],
	);
	const maxDusunTotal = useMemo(
		() =>
			Math.max(1, ...dusun.map((item) => item.maleCount + item.femaleCount)),
		[dusun],
	);
	const maxOccValue = useMemo(
		() => Math.max(1, ...occupations.map((item) => item.value)),
		[occupations],
	);

	const filteredDusun = useMemo(
		() =>
			dusun.filter((item) => {
				const matchName = item.dusunName
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
				const matchDensity = showPadatOnly
					? item.maleCount + item.femaleCount >= 1100
					: true;
				return matchName && matchDensity;
			}),
		[dusun, searchTerm, showPadatOnly],
	);

	// ── Dusun CRUD ────────────────────────────────────────────────────────────────
	function startAddDusun() {
		setEditingDusunId(null);
		setDusunForm(EMPTY_DUSUN);
		setShowDusunForm(true);
	}

	function startEditDusun(item: DusunItem) {
		setEditingDusunId(item.id);
		setDusunForm({
			dusunName: item.dusunName,
			totalKK: item.totalKK,
			maleCount: item.maleCount,
			femaleCount: item.femaleCount,
			dataYear: item.dataYear,
		});
		setShowDusunForm(true);
	}

	function cancelDusunForm() {
		setShowDusunForm(false);
		setEditingDusunId(null);
		setDusunForm(EMPTY_DUSUN);
	}

	async function saveDusun(event: React.FormEvent) {
		event.preventDefault();
		if (!dusunForm.dusunName.trim()) {
			showAdminToast("Nama dusun wajib diisi.", "error");
			return;
		}
		setSavingDusun(true);
		const body = JSON.stringify({
			dusunName: dusunForm.dusunName.trim(),
			totalKK: toNum(dusunForm.totalKK),
			maleCount: toNum(dusunForm.maleCount),
			femaleCount: toNum(dusunForm.femaleCount),
			dataYear: toNum(dusunForm.dataYear) || CURRENT_YEAR,
		});
		try {
			const path = editingDusunId
				? `/api/admin/be/demografi/admin/dusun/${editingDusunId}`
				: "/api/admin/be/demografi/admin/dusun";
			const res = await fetch(path, {
				method: editingDusunId ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				body,
			});
			if (!res.ok) throw new Error(`${res.status}`);
			showAdminToast(
				editingDusunId
					? "Data dusun berhasil diperbarui."
					: "Data dusun berhasil ditambahkan.",
				"success",
			);
			cancelDusunForm();
			await fetchDusun();
		} catch {
			showAdminToast("Gagal menyimpan data dusun.", "error");
		} finally {
			setSavingDusun(false);
		}
	}

	async function deleteDusun(id: string, name: string) {
		if (
			!window.confirm(
				`Hapus data dusun "${name}"? Tindakan ini tidak bisa dibatalkan.`,
			)
		)
			return;
		try {
			const res = await fetch(`/api/admin/be/demografi/admin/dusun/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(`${res.status}`);
			showAdminToast("Data dusun berhasil dihapus.", "success");
			await fetchDusun();
		} catch {
			showAdminToast("Gagal menghapus data dusun.", "error");
		}
	}

	// ── Age Group CRUD ────────────────────────────────────────────────────────────
	function startAddAge() {
		setEditingAgeId(null);
		setAgeForm(EMPTY_AGE);
		setShowAgeForm(true);
	}

	function startEditAge(item: AgeGroupItem) {
		setEditingAgeId(item.id);
		setAgeForm({ label: item.label, value: item.value });
		setShowAgeForm(true);
	}

	function cancelAgeForm() {
		setShowAgeForm(false);
		setEditingAgeId(null);
		setAgeForm(EMPTY_AGE);
	}

	async function saveAge(event: React.FormEvent) {
		event.preventDefault();
		if (!ageForm.label.trim()) {
			showAdminToast("Rentang usia wajib diisi.", "error");
			return;
		}
		setSavingAge(true);
		const body = JSON.stringify({
			label: ageForm.label.trim(),
			value: toNum(ageForm.value),
		});
		try {
			const path = editingAgeId
				? `/api/admin/be/demografi/admin/usia/${editingAgeId}`
				: "/api/admin/be/demografi/admin/usia";
			const res = await fetch(path, {
				method: editingAgeId ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				body,
			});
			if (!res.ok) throw new Error(`${res.status}`);
			showAdminToast(
				editingAgeId
					? "Kelompok usia berhasil diperbarui."
					: "Kelompok usia berhasil ditambahkan.",
				"success",
			);
			cancelAgeForm();
			await fetchAgeGroups();
		} catch {
			showAdminToast("Gagal menyimpan kelompok usia.", "error");
		} finally {
			setSavingAge(false);
		}
	}

	async function deleteAge(id: string, label: string) {
		if (!window.confirm(`Hapus kelompok usia "${label}"?`)) return;
		try {
			const res = await fetch(`/api/admin/be/demografi/admin/usia/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(`${res.status}`);
			showAdminToast("Kelompok usia berhasil dihapus.", "success");
			await fetchAgeGroups();
		} catch {
			showAdminToast("Gagal menghapus kelompok usia.", "error");
		}
	}

	// ── Occupation CRUD ───────────────────────────────────────────────────────────
	function startAddOcc() {
		setEditingOccId(null);
		setOccForm(EMPTY_OCC);
		setShowOccForm(true);
	}

	function startEditOcc(item: OccupationItem) {
		setEditingOccId(item.id);
		setOccForm({ label: item.label, value: item.value });
		setShowOccForm(true);
	}

	function cancelOccForm() {
		setShowOccForm(false);
		setEditingOccId(null);
		setOccForm(EMPTY_OCC);
	}

	async function saveOcc(event: React.FormEvent) {
		event.preventDefault();
		if (!occForm.label.trim()) {
			showAdminToast("Nama jenis pekerjaan wajib diisi.", "error");
			return;
		}
		setSavingOcc(true);
		const body = JSON.stringify({
			label: occForm.label.trim(),
			value: toNum(occForm.value),
		});
		try {
			const path = editingOccId
				? `/api/admin/be/demografi/admin/pekerjaan/${editingOccId}`
				: "/api/admin/be/demografi/admin/pekerjaan";
			const res = await fetch(path, {
				method: editingOccId ? "PATCH" : "POST",
				headers: { "Content-Type": "application/json" },
				body,
			});
			if (!res.ok) throw new Error(`${res.status}`);
			showAdminToast(
				editingOccId
					? "Jenis pekerjaan berhasil diperbarui."
					: "Jenis pekerjaan berhasil ditambahkan.",
				"success",
			);
			cancelOccForm();
			await fetchOccupations();
		} catch {
			showAdminToast("Gagal menyimpan jenis pekerjaan.", "error");
		} finally {
			setSavingOcc(false);
		}
	}

	async function deleteOcc(id: string, label: string) {
		if (!window.confirm(`Hapus jenis pekerjaan "${label}"?`)) return;
		try {
			const res = await fetch(`/api/admin/be/demografi/admin/pekerjaan/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(`${res.status}`);
			showAdminToast("Jenis pekerjaan berhasil dihapus.", "success");
			await fetchOccupations();
		} catch {
			showAdminToast("Gagal menghapus jenis pekerjaan.", "error");
		}
	}

	// ── Tab config ────────────────────────────────────────────────────────────────
	const tabs: { id: ActiveTab; label: string }[] = [
		{ id: "overview", label: "Ringkasan & Grafik" },
		{ id: "dusun", label: `Per Dusun (${dusun.length})` },
		{ id: "usia", label: `Kelompok Usia (${ageGroups.length})` },
		{ id: "pekerjaan", label: `Jenis Pekerjaan (${occupations.length})` },
	];

	const summaryItems = [
		{
			label: "Total Penduduk",
			value: formatNumber(summary.totalPopulation),
			note: "Dihitung otomatis dari data per dusun",
			noteClass: "text-emerald-700",
		},
		{
			label: "Kepala Keluarga",
			value: formatNumber(summary.households),
			note: "Akumulasi semua dusun",
			noteClass: "text-sky-700",
		},
		{
			label: "Laki-laki",
			value: formatNumber(summary.male),
			note: `${malePercent}% dari populasi`,
			noteClass: "text-amber-700",
		},
		{
			label: "Perempuan",
			value: formatNumber(summary.female),
			note: `${femalePercent}% dari populasi`,
			noteClass: "text-emerald-700",
		},
	];

	// ── Render ────────────────────────────────────────────────────────────────────
	return (
		<div className="space-y-4">
			{/* ── Header ─────────────────────────────────────────────────────────── */}
			<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="max-w-2xl">
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
							Modul Statistik
						</p>
						<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
							Kelola &amp; Visualisasi Data Kependudukan
						</h2>
						<p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
							Data diambil langsung dari backend. Gunakan tab di bawah untuk
							mengelola data per dusun, kelompok usia, dan jenis pekerjaan.
						</p>
					</div>
					<button
						type="button"
						onClick={() => void fetchAll()}
						disabled={isLoading}
						className={BTN_PRIMARY}
					>
						{isLoading ? "Memuat..." : "Refresh Data"}
					</button>
				</div>
			</section>

			{/* ── Summary cards ──────────────────────────────────────────────────── */}
			<section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
				{summaryItems.map((item) => (
					<article
						key={item.label}
						className="rounded-[1.5rem] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.4)]"
					>
						<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
							{item.label}
						</p>
						<p className="mt-3 text-4xl font-semibold leading-none text-slate-900">
							{item.value}
						</p>
						<p className={`mt-2 text-xs font-medium ${item.noteClass}`}>
							{item.note}
						</p>
					</article>
				))}
			</section>

			{/* ── Tab bar ────────────────────────────────────────────────────────── */}
			<div className="flex flex-wrap gap-2">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActiveTab(tab.id)}
						className={`h-9 rounded-lg px-4 text-sm font-medium transition ${
							activeTab === tab.id
								? "bg-emerald-700 text-white shadow"
								: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* ══ OVERVIEW TAB ══════════════════════════════════════════════════════ */}
			{activeTab === "overview" && (
				<>
					<section className="grid gap-4 2xl:grid-cols-[0.95fr_1.7fr]">
						{/* Gender donut */}
						<article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
							<h3 className="text-2xl font-semibold text-slate-900">
								Distribusi Gender
							</h3>
							<div
								className="mx-auto mt-6 h-48 w-48 rounded-full p-4 shadow-[0_24px_40px_-28px_rgba(15,23,42,0.5)]"
								style={{
									background: `conic-gradient(#047857 0deg ${maleDeg}deg, #60a5fa ${maleDeg}deg 360deg)`,
								}}
							>
								<div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
									<div>
										<p className="text-4xl font-semibold text-slate-900">
											{summary.totalPopulation > 0 ? "100%" : "—"}
										</p>
										<p className="mt-1 text-sm text-slate-500">Data gender</p>
									</div>
								</div>
							</div>
							<div className="mt-6 grid grid-cols-2 gap-4 text-sm">
								<div className="rounded-2xl bg-emerald-50 px-4 py-3">
									<p className="font-semibold text-slate-900">Laki-laki</p>
									<p className="text-emerald-700">{malePercent}%</p>
								</div>
								<div className="rounded-2xl bg-sky-50 px-4 py-3">
									<p className="font-semibold text-slate-900">Perempuan</p>
									<p className="text-sky-700">{femalePercent}%</p>
								</div>
							</div>
						</article>

						{/* Age groups bar chart */}
						<article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-2xl font-semibold text-slate-900">
										Kelompok Usia
									</h3>
									<p className="mt-1 text-sm text-slate-500">
										Komposisi populasi per rentang umur
									</p>
								</div>
								<span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
									Update {updatedAt}
								</span>
							</div>
							{ageGroups.length === 0 ? (
								<div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
									Belum ada data kelompok usia. Tambahkan di tab{" "}
									<button
										type="button"
										onClick={() => setActiveTab("usia")}
										className="font-semibold text-emerald-700 underline"
									>
										Kelompok Usia
									</button>
									.
								</div>
							) : (
								<div
									className="mt-8 items-end gap-3"
									style={{
										display: "grid",
										gridTemplateColumns: `repeat(${ageGroups.length}, 1fr)`,
										height: "250px",
									}}
								>
									{ageGroups.map((item) => (
										<div
											key={item.id}
											className="flex h-full flex-col items-center justify-end gap-2"
										>
											<div
												className="w-full rounded-md bg-emerald-700/95"
												style={{
													height: `${Math.max(20, (item.value / maxAgeValue) * 200)}px`,
												}}
												title={`${item.label}: ${formatNumber(item.value)}`}
											/>
											<span className="text-[10px] text-slate-500">
												{item.label}
											</span>
										</div>
									))}
								</div>
							)}
						</article>
					</section>

					{/* Occupations */}
					<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
						<div className="mb-5 flex items-center justify-between">
							<div>
								<h3 className="text-2xl font-semibold text-slate-900">
									Distribusi Jenis Pekerjaan
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Komposisi pekerjaan penduduk
								</p>
							</div>
						</div>
						{occupations.length === 0 ? (
							<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
								Belum ada data jenis pekerjaan. Tambahkan di tab{" "}
								<button
									type="button"
									onClick={() => setActiveTab("pekerjaan")}
									className="font-semibold text-emerald-700 underline"
								>
									Jenis Pekerjaan
								</button>
								.
							</div>
						) : (
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
								{occupations.map((item) => (
									<div
										key={item.id}
										className="rounded-lg bg-slate-50 px-3 py-3"
									>
										<div className="h-1.5 rounded-full bg-slate-200">
											<div
												className="h-1.5 rounded-full bg-emerald-600"
												style={{
													width: `${Math.max(4, Math.round((item.value / maxOccValue) * 100))}%`,
												}}
											/>
										</div>
										<p className="mt-2 text-[11px] text-slate-500">
											{item.label}
										</p>
										<p className="mt-1 text-sm font-semibold text-slate-900">
											{formatNumber(item.value)}
										</p>
									</div>
								))}
							</div>
						)}
					</section>

					{/* Dusun table (read-only in overview) */}
					<section className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/85 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem]">
						<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-5">
							<div>
								<h3 className="text-2xl font-semibold text-slate-900">
									Rincian per Dusun
								</h3>
								<p className="mt-1 text-sm text-slate-500">
									Ringkasan kepadatan tiap dusun
								</p>
							</div>
							<button
								type="button"
								onClick={() => setActiveTab("dusun")}
								className={BTN_SECONDARY}
							>
								Kelola Data Dusun →
							</button>
						</div>
						<div className="overflow-x-auto">
							<table className="min-w-full border-collapse text-left text-sm">
								<thead className="bg-slate-50 text-[11px] uppercase tracking-[0.08em] text-slate-500">
									<tr>
										<th className="px-4 py-3 font-semibold sm:px-5">
											Nama Dusun
										</th>
										<th className="px-4 py-3 font-semibold sm:px-5">KK</th>
										<th className="px-4 py-3 font-semibold sm:px-5">
											Laki-laki
										</th>
										<th className="px-4 py-3 font-semibold sm:px-5">
											Perempuan
										</th>
										<th className="px-4 py-3 font-semibold sm:px-5">Total</th>
										<th className="px-4 py-3 font-semibold sm:px-5">
											Kepadatan
										</th>
									</tr>
								</thead>
								<tbody>
									{dusun.map((item) => {
										const total = item.maleCount + item.femaleCount;
										return (
											<tr
												key={item.id}
												className="border-t border-slate-200 bg-white text-slate-700"
											>
												<td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">
													{item.dusunName}
												</td>
												<td className="px-4 py-3 sm:px-5">
													{formatNumber(item.totalKK)}
												</td>
												<td className="px-4 py-3 sm:px-5">
													{formatNumber(item.maleCount)}
												</td>
												<td className="px-4 py-3 sm:px-5">
													{formatNumber(item.femaleCount)}
												</td>
												<td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">
													{formatNumber(total)}
												</td>
												<td className="px-4 py-3 sm:px-5">
													<div className="h-1.5 w-20 rounded-full bg-slate-200">
														<div
															className="h-1.5 rounded-full bg-emerald-700"
															style={{
																width: `${Math.round((total / maxDusunTotal) * 100)}%`,
															}}
														/>
													</div>
												</td>
											</tr>
										);
									})}
									{dusun.length === 0 && (
										<tr>
											<td
												colSpan={6}
												className="px-5 py-8 text-center text-sm text-slate-500"
											>
												Belum ada data dusun.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</section>
				</>
			)}

			{/* ══ DUSUN TAB ════════════════════════════════════════════════════════ */}
			{activeTab === "dusun" && (
				<section className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/85 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem]">
					<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-5">
						<div>
							<h3 className="text-2xl font-semibold text-slate-900">
								Data Per Dusun
							</h3>
							<p className="mt-1 text-sm text-slate-500">
								Kelola jumlah penduduk per dusun
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<input
								type="search"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Cari dusun..."
								className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-emerald-300"
							/>
							<button
								type="button"
								onClick={() => setShowPadatOnly((v) => !v)}
								className={`h-9 rounded-lg px-3 text-sm font-medium transition ${
									showPadatOnly
										? "bg-emerald-700 text-white"
										: "bg-slate-100 text-slate-700 hover:bg-slate-200"
								}`}
							>
								Padat &ge;1100
							</button>
							<button
								type="button"
								onClick={startAddDusun}
								className={BTN_PRIMARY}
							>
								+ Tambah Dusun
							</button>
						</div>
					</div>

					{/* Add/Edit form */}
					{showDusunForm && (
						<div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
							<h4 className="mb-4 text-sm font-semibold text-slate-800">
								{editingDusunId ? "Edit Data Dusun" : "Tambah Data Dusun"}
							</h4>
							<form
								onSubmit={(e) => void saveDusun(e)}
								className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"
							>
								<div className="xl:col-span-2">
									<label className={LABEL_CLS}>Nama Dusun *</label>
									<input
										className={INPUT_CLS}
										value={dusunForm.dusunName}
										onChange={(e) =>
											setDusunForm((f) => ({ ...f, dusunName: e.target.value }))
										}
										placeholder="cth. Dusun Ciranto"
										required
									/>
								</div>
								<div>
									<label className={LABEL_CLS}>Jumlah KK</label>
									<input
										className={INPUT_CLS}
										type="number"
										min="0"
										value={dusunForm.totalKK}
										onChange={(e) =>
											setDusunForm((f) => ({
												...f,
												totalKK: Number(e.target.value),
											}))
										}
									/>
								</div>
								<div>
									<label className={LABEL_CLS}>Laki-laki</label>
									<input
										className={INPUT_CLS}
										type="number"
										min="0"
										value={dusunForm.maleCount}
										onChange={(e) =>
											setDusunForm((f) => ({
												...f,
												maleCount: Number(e.target.value),
											}))
										}
									/>
								</div>
								<div>
									<label className={LABEL_CLS}>Perempuan</label>
									<input
										className={INPUT_CLS}
										type="number"
										min="0"
										value={dusunForm.femaleCount}
										onChange={(e) =>
											setDusunForm((f) => ({
												...f,
												femaleCount: Number(e.target.value),
											}))
										}
									/>
								</div>
								<div>
									<label className={LABEL_CLS}>Tahun Data *</label>
									<input
										className={INPUT_CLS}
										type="number"
										min="1900"
										max="2100"
										value={dusunForm.dataYear}
										onChange={(e) =>
											setDusunForm((f) => ({
												...f,
												dataYear: Number(e.target.value),
											}))
										}
										required
									/>
								</div>
								<div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4 xl:col-span-6">
									<button
										type="submit"
										disabled={savingDusun}
										className={BTN_PRIMARY}
									>
										{savingDusun
											? "Menyimpan..."
											: editingDusunId
												? "Simpan Perubahan"
												: "Tambahkan"}
									</button>
									<button
										type="button"
										onClick={cancelDusunForm}
										className={BTN_SECONDARY}
									>
										Batal
									</button>
								</div>
							</form>
						</div>
					)}

					<div className="overflow-x-auto">
						<table className="min-w-full border-collapse text-left text-sm">
							<thead className="bg-slate-50 text-[11px] uppercase tracking-[0.08em] text-slate-500">
								<tr>
									<th className="px-4 py-3 font-semibold sm:px-5">
										Nama Dusun
									</th>
									<th className="px-4 py-3 font-semibold sm:px-5">Tahun</th>
									<th className="px-4 py-3 font-semibold sm:px-5">KK</th>
									<th className="px-4 py-3 font-semibold sm:px-5">Laki-laki</th>
									<th className="px-4 py-3 font-semibold sm:px-5">Perempuan</th>
									<th className="px-4 py-3 font-semibold sm:px-5">Total</th>
									<th className="px-4 py-3 font-semibold sm:px-5">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{filteredDusun.map((item) => (
									<tr
										key={item.id}
										className={`border-t border-slate-200 text-slate-700 ${
											editingDusunId === item.id ? "bg-emerald-50" : "bg-white"
										}`}
									>
										<td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">
											{item.dusunName}
										</td>
										<td className="px-4 py-3 sm:px-5">{item.dataYear}</td>
										<td className="px-4 py-3 sm:px-5">
											{formatNumber(item.totalKK)}
										</td>
										<td className="px-4 py-3 sm:px-5">
											{formatNumber(item.maleCount)}
										</td>
										<td className="px-4 py-3 sm:px-5">
											{formatNumber(item.femaleCount)}
										</td>
										<td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">
											{formatNumber(item.maleCount + item.femaleCount)}
										</td>
										<td className="px-4 py-3 sm:px-5">
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() => startEditDusun(item)}
													className={BTN_EDIT}
												>
													Edit
												</button>
												<button
													type="button"
													onClick={() =>
														void deleteDusun(item.id, item.dusunName)
													}
													className={BTN_DANGER}
												>
													Hapus
												</button>
											</div>
										</td>
									</tr>
								))}
								{filteredDusun.length === 0 && (
									<tr>
										<td
											colSpan={7}
											className="px-5 py-8 text-center text-sm text-slate-500"
										>
											{dusun.length === 0
												? "Belum ada data dusun."
												: "Tidak ada hasil pencarian."}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
						<p>
							Menampilkan {filteredDusun.length} dari {dusun.length} dusun
						</p>
					</div>
				</section>
			)}

			{/* ══ KELOMPOK USIA TAB ════════════════════════════════════════════════ */}
			{activeTab === "usia" && (
				<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h3 className="text-2xl font-semibold text-slate-900">
								Kelompok Usia
							</h3>
							<p className="mt-1 text-sm text-slate-500">
								Komposisi populasi per rentang umur
							</p>
						</div>
						<button type="button" onClick={startAddAge} className={BTN_PRIMARY}>
							+ Tambah Kelompok Usia
						</button>
					</div>

					{/* Add/Edit form */}
					{showAgeForm && (
						<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
							<h4 className="mb-4 text-sm font-semibold text-slate-800">
								{editingAgeId ? "Edit Kelompok Usia" : "Tambah Kelompok Usia"}
							</h4>
							<form
								onSubmit={(e) => void saveAge(e)}
								className="flex flex-wrap items-end gap-4"
							>
								<div className="min-w-[180px] flex-1">
									<label className={LABEL_CLS}>Rentang Usia *</label>
									<input
										className={INPUT_CLS}
										value={ageForm.label}
										onChange={(e) =>
											setAgeForm((f) => ({ ...f, label: e.target.value }))
										}
										placeholder="cth. 25-34"
										required
									/>
								</div>
								<div className="min-w-[140px] flex-1">
									<label className={LABEL_CLS}>Jumlah Jiwa</label>
									<input
										className={INPUT_CLS}
										type="number"
										min="0"
										value={ageForm.value}
										onChange={(e) =>
											setAgeForm((f) => ({
												...f,
												value: Number(e.target.value),
											}))
										}
									/>
								</div>
								<div className="flex gap-2">
									<button
										type="submit"
										disabled={savingAge}
										className={BTN_PRIMARY}
									>
										{savingAge
											? "Menyimpan..."
											: editingAgeId
												? "Simpan"
												: "Tambahkan"}
									</button>
									<button
										type="button"
										onClick={cancelAgeForm}
										className={BTN_SECONDARY}
									>
										Batal
									</button>
								</div>
							</form>
						</div>
					)}

					{/* List */}
					<div className="mt-5 space-y-2">
						{ageGroups.length === 0 && !showAgeForm && (
							<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
								Belum ada data kelompok usia.
							</div>
						)}
						{ageGroups.map((item) => (
							<div
								key={item.id}
								className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
									editingAgeId === item.id
										? "border-emerald-200 bg-emerald-50"
										: "border-slate-200 bg-white"
								}`}
							>
								<div className="w-24 flex-shrink-0 text-sm font-semibold text-slate-900">
									{item.label}
								</div>
								<div className="flex-1">
									<div className="h-2 rounded-full bg-slate-100">
										<div
											className="h-2 rounded-full bg-emerald-600"
											style={{
												width: `${Math.max(4, Math.round((item.value / maxAgeValue) * 100))}%`,
											}}
										/>
									</div>
								</div>
								<div className="w-20 flex-shrink-0 text-right text-sm font-semibold text-slate-900">
									{formatNumber(item.value)}
								</div>
								<div className="flex flex-shrink-0 gap-2">
									<button
										type="button"
										onClick={() => startEditAge(item)}
										className={BTN_EDIT}
									>
										Edit
									</button>
									<button
										type="button"
										onClick={() => void deleteAge(item.id, item.label)}
										className={BTN_DANGER}
									>
										Hapus
									</button>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* ══ JENIS PEKERJAAN TAB ══════════════════════════════════════════════ */}
			{activeTab === "pekerjaan" && (
				<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h3 className="text-2xl font-semibold text-slate-900">
								Jenis Pekerjaan
							</h3>
							<p className="mt-1 text-sm text-slate-500">
								Komposisi pekerjaan penduduk desa
							</p>
						</div>
						<button type="button" onClick={startAddOcc} className={BTN_PRIMARY}>
							+ Tambah Jenis Pekerjaan
						</button>
					</div>

					{/* Add/Edit form */}
					{showOccForm && (
						<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
							<h4 className="mb-4 text-sm font-semibold text-slate-800">
								{editingOccId
									? "Edit Jenis Pekerjaan"
									: "Tambah Jenis Pekerjaan"}
							</h4>
							<form
								onSubmit={(e) => void saveOcc(e)}
								className="flex flex-wrap items-end gap-4"
							>
								<div className="min-w-[180px] flex-1">
									<label className={LABEL_CLS}>Nama Pekerjaan *</label>
									<input
										className={INPUT_CLS}
										value={occForm.label}
										onChange={(e) =>
											setOccForm((f) => ({ ...f, label: e.target.value }))
										}
										placeholder="cth. Petani"
										required
									/>
								</div>
								<div className="min-w-[140px] flex-1">
									<label className={LABEL_CLS}>Jumlah Jiwa</label>
									<input
										className={INPUT_CLS}
										type="number"
										min="0"
										value={occForm.value}
										onChange={(e) =>
											setOccForm((f) => ({
												...f,
												value: Number(e.target.value),
											}))
										}
									/>
								</div>
								<div className="flex gap-2">
									<button
										type="submit"
										disabled={savingOcc}
										className={BTN_PRIMARY}
									>
										{savingOcc
											? "Menyimpan..."
											: editingOccId
												? "Simpan"
												: "Tambahkan"}
									</button>
									<button
										type="button"
										onClick={cancelOccForm}
										className={BTN_SECONDARY}
									>
										Batal
									</button>
								</div>
							</form>
						</div>
					)}

					{/* List */}
					<div className="mt-5 space-y-2">
						{occupations.length === 0 && !showOccForm && (
							<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
								Belum ada data jenis pekerjaan.
							</div>
						)}
						{occupations.map((item) => (
							<div
								key={item.id}
								className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
									editingOccId === item.id
										? "border-emerald-200 bg-emerald-50"
										: "border-slate-200 bg-white"
								}`}
							>
								<div className="w-36 flex-shrink-0 text-sm font-semibold text-slate-900">
									{item.label}
								</div>
								<div className="flex-1">
									<div className="h-2 rounded-full bg-slate-100">
										<div
											className="h-2 rounded-full bg-emerald-600"
											style={{
												width: `${Math.max(4, Math.round((item.value / maxOccValue) * 100))}%`,
											}}
										/>
									</div>
								</div>
								<div className="w-20 flex-shrink-0 text-right text-sm font-semibold text-slate-900">
									{formatNumber(item.value)}
								</div>
								<div className="flex flex-shrink-0 gap-2">
									<button
										type="button"
										onClick={() => startEditOcc(item)}
										className={BTN_EDIT}
									>
										Edit
									</button>
									<button
										type="button"
										onClick={() => void deleteOcc(item.id, item.label)}
										className={BTN_DANGER}
									>
										Hapus
									</button>
								</div>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
