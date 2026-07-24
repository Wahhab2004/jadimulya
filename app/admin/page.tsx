"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminNavItems } from "@/lib/admin-nav";
import { adminBeFetch } from "@/lib/admin-api-client";

type BackendResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

type PotentialCategoryRef = {
	id: string;
	name: string;
	isPublic: boolean;
};

type PotentialItem = {
	id: string;
	category: PotentialCategoryRef | null;
	isActive: boolean;
};

type NewsCategory =
	| "PEMBANGUNAN"
	| "KESEHATAN"
	| "PERTANIAN"
	| "WISATA"
	| "LAINNYA";

type NewsItem = {
	id: string;
	category: NewsCategory;
	isPublished: boolean;
};

type RingkasanDemografi = {
	totalPopulation?: number;
	dataYear?: number | null;
};

type MediaItem = {
	id: string;
};

const NEWS_CATEGORY_ORDER: NewsCategory[] = [
	"PEMBANGUNAN",
	"KESEHATAN",
	"PERTANIAN",
	"WISATA",
	"LAINNYA",
];

const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
	PEMBANGUNAN: "Pembangunan",
	KESEHATAN: "Kesehatan",
	PERTANIAN: "Pertanian",
	WISATA: "Wisata",
	LAINNYA: "Lainnya",
};

const DONUT_COLORS = [
	"#0ea5e9", // Sky
	"#10b981", // Emerald
	"#f59e0b", // Amber
	"#8b5cf6", // Purple
	"#ef4444", // Red
	"#14b8a6", // Teal
];

async function apiFetch<T>(path: string): Promise<T | null> {
	try {
		const res = await adminBeFetch(path, { method: "GET" });
		if (!res.ok) return null;
		const json = (await res
			.json()
			.catch(() => null)) as BackendResponse<T> | null;
		return json?.data ?? null;
	} catch {
		return null;
	}
}

function numberFormat(value: number) {
	return value.toLocaleString("id-ID");
}

export default function AdminHomePage() {
	const [potentialItems, setPotentialItems] = useState<PotentialItem[]>([]);
	const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
	const [ringkasan, setRingkasan] = useState<RingkasanDemografi | null>(null);
	const [mediaCount, setMediaCount] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	// Fungsi Fetching Data diisolasi agar bisa dipanggil ulang (retry)
	const loadDashboardData = useCallback(async (isMounted = true) => {
		setIsLoading(true);
		setHasError(false);

		const [potensiRes, newsRes, ringkasanRes, mediaRes] =
			await Promise.allSettled([
				apiFetch<PotentialItem[]>("potensi/admin/all"),
				apiFetch<NewsItem[]>("news/admin/all"),
				apiFetch<RingkasanDemografi>("demografi/admin/ringkasan"),
				apiFetch<MediaItem[]>("media"),
			]);

		if (!isMounted) return;

		let anyFailed = false;

		if (potensiRes.status === "fulfilled" && potensiRes.value) {
			setPotentialItems(potensiRes.value);
		} else {
			anyFailed = true;
		}

		if (newsRes.status === "fulfilled" && newsRes.value) {
			setNewsItems(newsRes.value);
		} else {
			anyFailed = true;
		}

		if (ringkasanRes.status === "fulfilled" && ringkasanRes.value) {
			setRingkasan(ringkasanRes.value);
		} else {
			anyFailed = true;
		}

		if (mediaRes.status === "fulfilled" && mediaRes.value) {
			setMediaCount(mediaRes.value.length);
		} else {
			anyFailed = true;
		}

		setHasError(anyFailed);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		let isMounted = true;
		void loadDashboardData(isMounted);

		return () => {
			isMounted = false;
		};
	}, [loadDashboardData]);

	const publishedNewsCount = useMemo(
		() => newsItems.filter((item) => item.isPublished).length,
		[newsItems],
	);
	const draftNewsCount = newsItems.length - publishedNewsCount;
	const activePotentialCount = useMemo(
		() => potentialItems.filter((item) => item.isActive).length,
		[potentialItems],
	);

	const topSummary = [
		{
			label: "Total Penduduk",
			value: numberFormat(ringkasan?.totalPopulation ?? 0),
			note: ringkasan?.dataYear
				? `Data resmi tahun ${ringkasan.dataYear}`
				: "Data belum dikonfigurasi",
			accent: "from-cyan-500 to-sky-600",
			glow: "shadow-sky-500/20",
			icon: (
				<svg
					className="h-6 w-6 stroke-white"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			),
		},
		{
			label: "Potensi Aktif",
			value: numberFormat(activePotentialCount),
			note: `${numberFormat(potentialItems.length)} total potensi terdaftar`,
			accent: "from-emerald-500 to-teal-600",
			glow: "shadow-emerald-500/20",
			icon: (
				<svg
					className="h-6 w-6 stroke-white"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
					/>
				</svg>
			),
		},
		{
			label: "Berita Terbit",
			value: numberFormat(publishedNewsCount),
			note: `${numberFormat(newsItems.length)} publikasi artikel`,
			accent: "from-blue-500 to-indigo-600",
			glow: "shadow-blue-500/20",
			icon: (
				<svg
					className="h-6 w-6 stroke-white"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
					/>
				</svg>
			),
		},
		{
			label: "Berita Draft",
			value: numberFormat(draftNewsCount),
			note: "Menunggu peninjauan/terbit",
			accent: "from-amber-500 to-orange-600",
			glow: "shadow-amber-500/20",
			icon: (
				<svg
					className="h-6 w-6 stroke-white"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="2"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
					/>
				</svg>
			),
		},
	];

	// Distribusi berita per kategori
	const newsByCategory = useMemo(() => {
		return NEWS_CATEGORY_ORDER.map((category) => {
			const itemsInCategory = newsItems.filter(
				(item) => item.category === category,
			);
			return {
				category,
				label: NEWS_CATEGORY_LABEL[category],
				total: itemsInCategory.length,
				published: itemsInCategory.filter((item) => item.isPublished).length,
			};
		});
	}, [newsItems]);

	const maxNewsInCategory = Math.max(
		1,
		...newsByCategory.map((item) => item.total),
	);

	// Komposisi potensi per kategori
	const potentialByCategory = useMemo(() => {
		const counts = new Map<string, number>();
		for (const item of potentialItems) {
			const name = item.category?.name ?? "Tanpa kategori";
			counts.set(name, (counts.get(name) ?? 0) + 1);
		}
		return Array.from(counts.entries())
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count);
	}, [potentialItems]);

	const donutGradient = useMemo(() => {
		const total = potentialByCategory.reduce(
			(sum, item) => sum + item.count,
			0,
		);
		if (total === 0) {
			return "conic-gradient(#f1f5f9 0deg 360deg)";
		}
		let cursor = 0;
		const stops = potentialByCategory.map((item, index) => {
			const start = cursor;
			cursor += (item.count / total) * 360;
			const color = DONUT_COLORS[index % DONUT_COLORS.length];
			return `${color} ${start}deg ${cursor}deg`;
		});
		return `conic-gradient(${stops.join(", ")})`;
	}, [potentialByCategory]);

	const moduleCounts = [
		{ label: "Artikel Berita", value: newsItems.length, icon: "📰" },
		{ label: "Potensi Desa", value: potentialItems.length, icon: "🌾" },
		{
			label: "Kategori Potensi",
			value: potentialByCategory.length,
			icon: "🏷️",
		},
		{ label: "Berkas Media", value: mediaCount ?? 0, icon: "🖼️" },
	];
	const maxModuleCount = Math.max(1, ...moduleCounts.map((item) => item.value));

	return (
		<div className="space-y-6 text-slate-800">
			{/* Banner Header Dashboard */}
			<section className="relative overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
				<div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
							<span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
							CMS Panel Administrasi
						</div>
						<h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Selamat Datang Kembali, Admin 👋
						</h2>
						<p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
							Ringkasan performa data Desa Jadimulya tersinkronisasi langsung
							dari server backend terpusat.
						</p>
					</div>

					{/* Status Indikator Backend & Reload Manual */}
					<div className="flex items-center gap-3 self-start lg:self-center">
						<div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-xs">
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M5 12h14M12 5l7 7-7 7"
									/>
								</svg>
							</div>
							<div>
								<p className="font-semibold text-slate-800">
									Koneksi Backend Active
								</p>
								<p className="text-slate-400">Endpoint terintegrasi</p>
							</div>
						</div>

						<button
							type="button"
							onClick={() => void loadDashboardData()}
							disabled={isLoading}
							title="Muat ulang data dashboard"
							className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
						>
							<svg
								className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
						</button>
					</div>
				</div>

				{hasError && (
					<div className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
						<div className="flex items-center gap-2">
							<svg
								className="h-4 w-4 shrink-0 fill-current"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
							<p>
								Beberapa data gagal dimuat dari server. Silakan klik tombol coba
								lagi.
							</p>
						</div>
						<button
							onClick={() => void loadDashboardData()}
							className="underline font-semibold hover:text-rose-900 shrink-0"
						>
							Coba Lagi
						</button>
					</div>
				)}

				{/* Grid 4 Kartu Ringkasan Utama */}
				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{topSummary.map((item) => (
						<article
							key={item.label}
							className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
						>
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
										{item.label}
									</p>
									<p className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
										{isLoading ? (
											<span className="inline-block h-8 w-20 animate-pulse rounded-md bg-slate-200" />
										) : (
											item.value
										)}
									</p>
								</div>
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-lg ${item.glow} transition-transform duration-300 group-hover:scale-110`}
								>
									{item.icon}
								</div>
							</div>
							<div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
								<span className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-sky-500 transition-colors" />
								<span>{isLoading ? "Memperbarui..." : item.note}</span>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Section Grafik / Chart Utama */}
			<section className="grid gap-6 2xl:grid-cols-[1.8fr_1fr]">
				{/* Visualisasi 1: Distribusi Berita */}
				<article className="rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-sm">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
								📊 Distribusi Berita per Kategori
							</h3>
							<p className="text-xs text-slate-500">
								Perbandingan jumlah artikel total vs publikasi terbit
							</p>
						</div>
						<div className="flex items-center gap-4 text-xs font-medium text-slate-600">
							<span className="inline-flex items-center gap-1.5">
								<span className="h-3 w-3 rounded-md bg-sky-500" /> Terbit
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="h-3 w-3 rounded-md bg-sky-100" /> Total Artikel
							</span>
						</div>
					</div>

					{isLoading ? (
						<div className="mt-8 flex h-[260px] items-center justify-center">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
						</div>
					) : newsItems.length === 0 ? (
						<div className="mt-8 flex h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
							<p className="text-sm">Belum ada artikel berita tersimpan.</p>
						</div>
					) : (
						<div className="mt-8 grid h-[260px] grid-cols-5 items-end gap-3 sm:gap-6 border-b border-slate-100 pb-2">
							{newsByCategory.map((item) => {
								const totalHeight = Math.max(
									16,
									(item.total / maxNewsInCategory) * 200,
								);
								const publishedHeight = Math.max(
									0,
									(item.published / maxNewsInCategory) * 200,
								);

								return (
									<div
										key={item.category}
										className="group flex h-full flex-col items-center justify-end gap-2"
									>
										<div className="relative flex h-[200px] w-full max-w-[48px] items-end justify-center rounded-xl bg-slate-50/50 p-1">
											{/* Bar Total */}
											<div
												className="absolute bottom-1 w-full rounded-lg bg-sky-100 transition-all duration-500 group-hover:bg-sky-200"
												style={{ height: `${totalHeight}px` }}
											/>
											{/* Bar Terbit */}
											<div
												className="absolute bottom-1 w-3/4 rounded-lg bg-sky-500 shadow-md shadow-sky-500/20 transition-all duration-500 group-hover:bg-sky-600"
												style={{ height: `${publishedHeight}px` }}
											/>

											{/* Floating Tooltip Value */}
											<div className="absolute -top-8 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
												{item.published}/{item.total}
											</div>
										</div>

										<span className="text-[11px] font-medium text-slate-600 truncate max-w-full text-center">
											{item.label}
										</span>
										<span className="text-[10px] font-bold text-slate-400">
											{item.total} Data
										</span>
									</div>
								);
							})}
						</div>
					)}
				</article>

				{/* Visualisasi 2: Komposisi Potensi (Donut Chart) */}
				<article className="rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
					<div>
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
								🎨 Komposisi Potensi
							</h3>
							<span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
								Kategori
							</span>
						</div>

						{isLoading ? (
							<div className="mt-8 flex h-48 items-center justify-center">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
							</div>
						) : (
							<div
								className="relative mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-full p-4 shadow-inner"
								style={{ background: donutGradient }}
							>
								<div className="flex h-36 w-36 flex-col items-center justify-center rounded-full bg-white text-center shadow-md">
									<span className="text-3xl font-extrabold text-slate-900">
										{potentialItems.length}
									</span>
									<span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
										Total Potensi
									</span>
								</div>
							</div>
						)}
					</div>

					{/* Legend Items */}
					<div className="mt-6 space-y-2 max-h-40 overflow-y-auto pr-1">
						{potentialByCategory.length === 0 && !isLoading ? (
							<p className="text-center text-xs text-slate-400 py-2">
								Belum ada data potensi tersimpan.
							</p>
						) : (
							potentialByCategory.map((item, index) => (
								<div
									key={item.name}
									className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs transition-colors hover:bg-slate-100/80"
								>
									<span className="flex items-center gap-2 font-medium text-slate-700 truncate">
										<span
											className="h-2.5 w-2.5 shrink-0 rounded-full"
											style={{
												backgroundColor:
													DONUT_COLORS[index % DONUT_COLORS.length],
											}}
										/>
										<span className="truncate">{item.name}</span>
									</span>
									<span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
										{item.count}
									</span>
								</div>
							))
						)}
					</div>
				</article>
			</section>

			{/* Section Akses Cepat & Ringkasan Modul */}
			<section className="grid gap-6 xl:grid-cols-2">
				{/* Navigasi Publikasi Cepat */}
				<article className="rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-sm">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-bold text-slate-900">
								⚡ Akses Publikasi Cepat
							</h3>
							<p className="text-xs text-slate-500">
								Akses langsung ke menu pengolahan data utama
							</p>
						</div>
					</div>

					<div className="mt-5 grid gap-3 sm:grid-cols-2">
						{adminNavItems
							.filter((item) => item.href !== "/admin" && item.enabled)
							.slice(0, 4)
							.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/30 hover:shadow-sm"
								>
									<div>
										<div className="flex items-center justify-between">
											<p className="font-bold text-slate-800 group-hover:text-sky-700">
												{item.label}
											</p>
											<svg
												className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-sky-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2.5"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</div>
										<p className="mt-1.5 text-xs text-slate-500 line-clamp-2">
											{item.description}
										</p>
									</div>
								</Link>
							))}
					</div>
				</article>

				{/* Meteran Ringkasan Data Modul */}
				<article className="rounded-[1.8rem] border border-slate-200/80 bg-white p-6 shadow-sm">
					<h3 className="text-lg font-bold text-slate-900">
						📦 Kapasitas Modul CMS
					</h3>
					<p className="text-xs text-slate-500">
						Volume data terdaftar di setiap entitas modul
					</p>

					<div className="mt-5 space-y-4">
						{isLoading ? (
							<div className="space-y-3">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="h-8 w-full animate-pulse rounded-lg bg-slate-100"
									/>
								))}
							</div>
						) : (
							moduleCounts.map((item) => {
								const percentage = Math.max(
									5,
									Math.round((item.value / maxModuleCount) * 100),
								);
								return (
									<div key={item.label} className="space-y-1.5">
										<div className="flex items-center justify-between text-xs font-semibold">
											<span className="flex items-center gap-2 text-slate-700">
												<span>{item.icon}</span>
												<span>{item.label}</span>
											</span>
											<span className="text-slate-900 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
												{numberFormat(item.value)} Data
											</span>
										</div>
										<div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
											<div
												className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-700"
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								);
							})
						)}
					</div>
				</article>
			</section>
		</div>
	);
}
