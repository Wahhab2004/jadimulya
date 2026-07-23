"use client";

import { useEffect, useMemo, useState } from "react";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch } from "@/lib/admin-api-client";

type DusunItem = {
	id: string;
	dusunName: string;
	totalKK: number;
	maleCount: number;
	femaleCount: number;
	dataYear: number;
	sortOrder?: number;
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

type RingkasanItem = {
	totalPopulation?: number;
	totalFamilies?: number;
	maleCount?: number;
	femaleCount?: number;
	dataYear?: number;
};

type ActiveTab = "overview" | "dusun" | "pekerjaan";

type DusunFormState = Omit<DusunItem, "id">;

type OccupationFormState = Omit<OccupationItem, "id">;

const CURRENT_YEAR = new Date().getFullYear();

const EMPTY_DUSUN: DusunFormState = {
	dusunName: "",
	totalKK: 0,
	maleCount: 0,
	femaleCount: 0,
	dataYear: CURRENT_YEAR,
};
const EMPTY_OCC: OccupationFormState = { label: "", value: 0 };

const INPUT_CLS =
	"h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-sky-300";
const LABEL_CLS = "block text-xs font-semibold text-slate-600 mb-1";
const BTN_PRIMARY =
	"h-9 rounded-lg bg-sky-700 px-4 text-sm font-medium text-white hover:bg-sky-800 transition disabled:opacity-50";
const BTN_SECONDARY =
	"h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 transition";
const BTN_DANGER =
	"h-8 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-medium text-red-700 hover:bg-red-100 transition";
const BTN_EDIT =
	"h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 transition";

function formatNumber(value: number) {
	return value.toLocaleString("id-ID");
}

function toNum(value: unknown): number {
	if (typeof value === "number" && isFinite(value)) {
		return Math.max(0, Math.round(value));
	}
	if (typeof value === "string") {
		const parsed = Number(value.replace(/[^\d.-]/g, ""));
		if (isFinite(parsed)) return Math.max(0, Math.round(parsed));
	}
	return 0;
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await adminBeFetch(path, options);
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	const json = (await res.json()) as BackendResponse<T>;
	return json.data;
}

export default function AdminStatistikPage() {
	const [dusun, setDusun] = useState<DusunItem[]>([]);
	const [occupations, setOccupations] = useState<OccupationItem[]>([]);
	const [ringkasanApi, setRingkasanApi] = useState<RingkasanItem | null>(null);
	const [updatedAt, setUpdatedAt] = useState(
		new Date().toISOString().slice(0, 10),
	);
	const [isLoading, setIsLoading] = useState(false);

	const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
	const [searchTerm, setSearchTerm] = useState("");
	const [showPadatOnly, setShowPadatOnly] = useState(false);

	const [dusunForm, setDusunForm] = useState<DusunFormState>(EMPTY_DUSUN);
	const [editingDusunId, setEditingDusunId] = useState<string | null>(null);
	const [showDusunForm, setShowDusunForm] = useState(false);
	const [savingDusun, setSavingDusun] = useState(false);

	const [occForm, setOccForm] = useState<OccupationFormState>(EMPTY_OCC);
	const [editingOccId, setEditingOccId] = useState<string | null>(null);
	const [showOccForm, setShowOccForm] = useState(false);
	const [savingOcc, setSavingOcc] = useState(false);

	useEffect(() => {
		void fetchAll();
	}, []);

	async function fetchAll() {
		setIsLoading(true);
		await Promise.allSettled([
			fetchRingkasan(),
			fetchDusun(),
			fetchOccupations(),
		]);
		setIsLoading(false);
	}

	async function fetchRingkasan() {
		try {
			const item = await apiFetch<RingkasanItem>("demografi/ringkasan");
			setRingkasanApi(item ?? null);
		} catch {
			setRingkasanApi(null);
			showAdminToast("Gagal memuat ringkasan statistik dari backend.", "error");
		}
	}

	async function fetchDusun() {
		try {
			const items = await apiFetch<Array<Record<string, unknown>>>(
				"demografi/per-dusun",
			);
			const normalized = (Array.isArray(items) ? items : []).map(
				(item, index) => {
					const dusunName = String(
						item.dusunName ?? item.name ?? item.dusun ?? `Dusun ${index + 1}`,
					).trim();
					return {
						id: String(item.id ?? `dusun-${slugify(dusunName)}-${index + 1}`),
						dusunName,
						totalKK: toNum(item.totalKK ?? item.totalFamilies ?? item.kk),
						maleCount: toNum(item.maleCount ?? item.maleCount ?? item.lakiLaki),
						femaleCount: toNum(
							item.femaleCount ?? item.femaleCount ?? item.perempuan,
						),
						dataYear: toNum(item.dataYear) || CURRENT_YEAR,
						sortOrder: toNum(item.sortOrder) || index + 1,
					} as DusunItem;
				},
			);
			setDusun(normalized);
			setUpdatedAt(new Date().toISOString().slice(0, 10));
		} catch {
			showAdminToast("Gagal memuat data dusun dari backend.", "error");
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

	const summary = useMemo(
		() =>
			dusun.reduce(
				(acc, item) => ({
					totalPopulation:
						acc.totalPopulation + item.maleCount + item.femaleCount,
					totalFamilies: acc.totalFamilies + item.totalKK,
					male: acc.male + item.maleCount,
					female: acc.female + item.femaleCount,
				}),
				{ totalPopulation: 0, totalFamilies: 0, male: 0, female: 0 },
			),
		[dusun],
	);

	const summaryView = useMemo(() => {
		if (!ringkasanApi) {
			return summary;
		}

		const apiSummary = {
			totalPopulation: toNum(ringkasanApi.totalPopulation),
			totalFamilies: toNum(ringkasanApi.totalFamilies),
			male: toNum(ringkasanApi.maleCount),
			female: toNum(ringkasanApi.femaleCount),
		};

		const hasApiData =
			apiSummary.totalPopulation > 0 ||
			apiSummary.totalFamilies > 0 ||
			apiSummary.male > 0 ||
			apiSummary.female > 0;

		return hasApiData ? apiSummary : summary;
	}, [ringkasanApi, summary]);

	const malePercent = summaryView.totalPopulation
		? Math.round((summaryView.male / summaryView.totalPopulation) * 1000) / 10
		: 0;
	const femalePercent = summaryView.totalPopulation
		? Math.round((summaryView.female / summaryView.totalPopulation) * 1000) / 10
		: 0;
	const maleDeg = Math.round((malePercent / 100) * 360);

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
				? `demografi/admin/dusun/${editingDusunId}`
				: "demografi/admin/dusun";
			const res = await adminBeFetch(path, {
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
			const res = await adminBeFetch(`demografi/admin/dusun/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(`${res.status}`);
			showAdminToast("Data dusun berhasil dihapus.", "success");
			await fetchDusun();
		} catch {
			showAdminToast("Gagal menghapus data dusun.", "error");
		}
	}

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
				? `demografi/admin/pekerjaan/${editingOccId}`
				: "demografi/admin/pekerjaan";
			const res = await adminBeFetch(path, {
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
			const res = await adminBeFetch(`demografi/admin/pekerjaan/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) throw new Error(`${res.status}`);
			showAdminToast("Jenis pekerjaan berhasil dihapus.", "success");
			await fetchOccupations();
		} catch {
			showAdminToast("Gagal menghapus jenis pekerjaan.", "error");
		}
	}

	const tabs: { id: ActiveTab; label: string }[] = [
		{ id: "overview", label: "Ringkasan & Grafik" },
		{ id: "dusun", label: `Per Dusun (${dusun.length})` },
		{ id: "pekerjaan", label: `Jenis Pekerjaan (${occupations.length})` },
	];

	const summaryItems = [
		{
			label: "Total Penduduk",
			value: formatNumber(summaryView.totalPopulation),
			note: "Sumber: /demografi/ringkasan",
			noteClass: "text-sky-700",
		},
		{
			label: "Kepala Keluarga",
			value: formatNumber(summaryView.totalFamilies),
			note: "Sumber: /demografi/ringkasan",
			noteClass: "text-sky-700",
		},
		{
			label: "Laki-laki",
			value: formatNumber(summaryView.male),
			note: `${malePercent}% dari populasi`,
			noteClass: "text-amber-700",
		},
		{
			label: "Perempuan",
			value: formatNumber(summaryView.female),
			note: `${femalePercent}% dari populasi`,
			noteClass: "text-sky-700",
		},
	];

	return (
		<div className="space-y-4">
			<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="max-w-2xl">
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
							Modul Statistik
						</p>
						<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
							Kelola Statistik Desa
						</h2>
						<p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
							Data diambil langsung dari backend. Fokus halaman ini hanya pada
							data dusun dan jenis pekerjaan.
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<button
							type="button"
							onClick={() => void fetchAll()}
							disabled={isLoading}
							className={BTN_PRIMARY}
						>
							{isLoading ? "Memuat..." : "Refresh Data"}
						</button>
					</div>
				</div>
			</section>

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

			<div className="flex flex-wrap gap-2">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => setActiveTab(tab.id)}
						className={`h-9 rounded-lg px-4 text-sm font-medium transition ${
							activeTab === tab.id
								? "bg-sky-700 text-white shadow"
								: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			{activeTab === "overview" && (
				<>
					<section className="grid gap-4 2xl:grid-cols-[0.95fr_1.7fr]">
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
											{summaryView.totalPopulation > 0 ? "100%" : "—"}
										</p>
										<p className="mt-1 text-sm text-slate-500">Data gender</p>
									</div>
								</div>
							</div>
							<div className="mt-6 grid grid-cols-2 gap-4 text-sm">
								<div className="rounded-2xl bg-sky-50 px-4 py-3">
									<p className="font-semibold text-slate-900">Laki-laki</p>
									<p className="text-sky-700">{malePercent}%</p>
								</div>
								<div className="rounded-2xl bg-sky-50 px-4 py-3">
									<p className="font-semibold text-slate-900">Perempuan</p>
									<p className="text-sky-700">{femalePercent}%</p>
								</div>
							</div>
						</article>

						<article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="text-2xl font-semibold text-slate-900">
										Ringkasan Dusun
									</h3>
									<p className="mt-1 text-sm text-slate-500">
										5 dusun utama yang diisi dan dikelola admin
									</p>
								</div>
								<span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
									Update {updatedAt}
								</span>
							</div>
							<div className="mt-5 space-y-4">
								{dusun.map((item) => {
									const total = item.maleCount + item.femaleCount;
									const width = Math.max(
										8,
										Math.round((total / maxDusunTotal) * 100),
									);
									return (
										<div
											key={item.id}
											className="rounded-2xl border border-slate-200 p-4"
										>
											<div className="flex flex-wrap items-start justify-between gap-3">
												<div>
													<p className="text-base font-semibold text-slate-900">
														{item.dusunName}
													</p>
													<p className="mt-1 text-sm text-slate-500">
														KK {formatNumber(item.totalKK)} · Total{" "}
														{formatNumber(total)}
													</p>
												</div>
												<p className="text-sm font-semibold text-sky-700">
													{width}% dari dusun terbesar
												</p>
											</div>
											<div className="mt-4 h-3 rounded-full bg-slate-100">
												<div
													className="h-3 rounded-full bg-sky-600"
													style={{ width: `${width}%` }}
												/>
											</div>
											<div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
												<div className="rounded-xl bg-sky-50 px-3 py-2">
													<p className="text-xs text-slate-500">Laki-laki</p>
													<p className="font-semibold text-slate-900">
														{formatNumber(item.maleCount)}
													</p>
												</div>
												<div className="rounded-xl bg-sky-50 px-3 py-2">
													<p className="text-xs text-slate-500">Perempuan</p>
													<p className="font-semibold text-slate-900">
														{formatNumber(item.femaleCount)}
													</p>
												</div>
												<div className="rounded-xl bg-sky-50 px-3 py-2">
													<p className="text-xs text-slate-500">Total</p>
													<p className="font-semibold text-slate-900">
														{formatNumber(total)}
													</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</article>
					</section>

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
							<button
								type="button"
								onClick={() => setActiveTab("pekerjaan")}
								className={BTN_SECONDARY}
							>
								Kelola Data Pekerjaan →
							</button>
						</div>
						{occupations.length === 0 ? (
							<div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
								Belum ada data jenis pekerjaan. Tambahkan di tab Jenis
								Pekerjaan.
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
												className="h-1.5 rounded-full bg-sky-600"
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
				</>
			)}

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
								className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-sky-300"
							/>
							<button
								type="button"
								onClick={() => setShowPadatOnly((v) => !v)}
								className={`h-9 rounded-lg px-3 text-sm font-medium transition ${showPadatOnly ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
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
								{filteredDusun.map((item) => {
									const total = item.maleCount + item.femaleCount;
									return (
										<tr
											key={item.id}
											className={`border-t border-slate-200 text-slate-700 ${editingDusunId === item.id ? "bg-sky-50" : "bg-white"}`}
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
												{formatNumber(total)}
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
									);
								})}
								{filteredDusun.length === 0 && (
									<tr>
										<td
											colSpan={7}
											className="px-5 py-8 text-center text-sm text-slate-500"
										>
											Belum ada data dusun yang cocok dengan filter.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>
			)}

			{activeTab === "pekerjaan" && (
				<section className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/85 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem]">
					<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-5">
						<div>
							<h3 className="text-2xl font-semibold text-slate-900">
								Jenis Pekerjaan
							</h3>
							<p className="mt-1 text-sm text-slate-500">
								Kelola komposisi pekerjaan penduduk
							</p>
						</div>
						<button type="button" onClick={startAddOcc} className={BTN_PRIMARY}>
							+ Tambah Pekerjaan
						</button>
					</div>

					{showOccForm && (
						<div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
							<h4 className="mb-4 text-sm font-semibold text-slate-800">
								{editingOccId
									? "Edit Jenis Pekerjaan"
									: "Tambah Jenis Pekerjaan"}
							</h4>
							<form
								onSubmit={(e) => void saveOcc(e)}
								className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
							>
								<div className="sm:col-span-2">
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
								<div>
									<label className={LABEL_CLS}>Jumlah</label>
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
								<div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
									<button
										type="submit"
										disabled={savingOcc}
										className={BTN_PRIMARY}
									>
										{savingOcc
											? "Menyimpan..."
											: editingOccId
												? "Simpan Perubahan"
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

					<div className="overflow-x-auto">
						<table className="min-w-full border-collapse text-left text-sm">
							<thead className="bg-slate-50 text-[11px] uppercase tracking-[0.08em] text-slate-500">
								<tr>
									<th className="px-4 py-3 font-semibold sm:px-5">
										Nama Pekerjaan
									</th>
									<th className="px-4 py-3 font-semibold sm:px-5">Jumlah</th>
									<th className="px-4 py-3 font-semibold sm:px-5">Aksi</th>
								</tr>
							</thead>
							<tbody>
								{occupations.map((item) => (
									<tr
										key={item.id}
										className={`border-t border-slate-200 text-slate-700 ${editingOccId === item.id ? "bg-sky-50" : "bg-white"}`}
									>
										<td className="px-4 py-3 font-semibold text-slate-900 sm:px-5">
											{item.label}
										</td>
										<td className="px-4 py-3 sm:px-5">
											{formatNumber(item.value)}
										</td>
										<td className="px-4 py-3 sm:px-5">
											<div className="flex items-center gap-2">
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
										</td>
									</tr>
								))}
								{occupations.length === 0 && (
									<tr>
										<td
											colSpan={3}
											className="px-5 py-8 text-center text-sm text-slate-500"
										>
											Belum ada data jenis pekerjaan.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>
			)}
		</div>
	);
}
