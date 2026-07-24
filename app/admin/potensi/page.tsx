"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch } from "@/lib/admin-api-client";

type PotensiItem = {
	id: string;
	title: string;
	description: string;
	categoryId: string;
	categoryName: string;
	tag: string;
	isHighlight: boolean;
	imageUrl: string;
};

type BackendCategory = {
	id: string;
	name: string;
	isPublic: boolean;
	sortOrder: number;
};

type BackendPotential = {
	id: string;
	name: string;
	category: BackendCategory;
	shortDesc: string;
	coverImage: string | null;
	isHighlight: boolean;
};

type BackendResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

function mapPotentialToItem(item: BackendPotential): PotensiItem {
	return {
		id: item.id,
		title: item.name,
		description: item.shortDesc,
		categoryId: item.category?.id ?? "",
		categoryName: item.category?.name ?? "Tanpa kategori",
		tag: item.isHighlight ? "Highlight" : "Reguler",
		isHighlight: item.isHighlight,
		imageUrl: item.coverImage ?? "/images/potensi-kopi.jpg",
	};
}

export default function AdminPotensiPage() {
	const [items, setItems] = useState<PotensiItem[]>([]);
	const [notice, setNotice] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	// State Search & Filter
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

	useEffect(() => {
		void fetchItems();
	}, []);

	async function fetchItems() {
		setIsLoading(true);
		try {
			const response = await adminBeFetch("potensi/admin/all", {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error("Gagal mengambil potensi");
			}

			const payload = (await response.json()) as BackendResponse<
				BackendPotential[]
			>;
			const nextItems = Array.isArray(payload.data)
				? payload.data.map((item) => mapPotentialToItem(item))
				: [];

			setItems(nextItems);
			setNotice("");
		} catch {
			const message = "Tidak bisa memuat data potensi dari backend.";
			setNotice(message);
			showAdminToast(message, "error");
		} finally {
			setIsLoading(false);
		}
	}

	// Ringkasan Kategori
	const summary = useMemo(() => {
		const byCategory = new Map<string, number>();
		let highlightCount = 0;

		for (const item of items) {
			if (item.isHighlight) highlightCount++;
			byCategory.set(
				item.categoryName,
				(byCategory.get(item.categoryName) ?? 0) + 1,
			);
		}
		return {
			total: items.length,
			highlights: highlightCount,
			byCategory: Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]),
		};
	}, [items]);

	// Daftar Kategori Unik untuk Filter Dropdown
	const uniqueCategories = useMemo(() => {
		const categories = new Set<string>();
		items.forEach((item) => categories.add(item.categoryName));
		return Array.from(categories);
	}, [items]);

	// Filter & Search Logic
	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			const matchesSearch =
				item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.description.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory =
				selectedCategory === "ALL" || item.categoryName === selectedCategory;
			return matchesSearch && matchesCategory;
		});
	}, [items, searchQuery, selectedCategory]);

	async function removeItem(itemId: string) {
		const confirmed = window.confirm(
			"Hapus data potensi ini? Tindakan ini tidak bisa dibatalkan.",
		);
		if (!confirmed) return;

		try {
			const response = await adminBeFetch(`potensi/admin/${itemId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Gagal menghapus potensi");
			}

			await fetchItems();
			const message = "Data potensi berhasil dihapus.";
			showAdminToast(message, "success");
		} catch {
			const message = "Gagal menghapus data potensi.";
			showAdminToast(message, "error");
		}
	}

	return (
		<div className="space-y-6">
			{/* Header Banner */}
			<section className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-gradient-to-r from-white/90 via-sky-50/50 to-white/90 p-5 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.07)] backdrop-blur-md lg:rounded-[2rem] lg:p-7">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-800">
							<span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
							Modul Potensi
						</div>
						<h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Kelola Potensi Desa
						</h2>
						<p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
							Kelola ragam potensi desa secara fleksibel. Kategori dan highlight
							terhubung langsung dengan tampilan halaman publik.
						</p>
					</div>

					<div className="flex items-center gap-2">
						<button
							onClick={() => void fetchItems()}
							disabled={isLoading}
							className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:shadow-sm disabled:opacity-50"
							title="Refresh data"
						>
							<svg
								className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
							<span>Segarkan</span>
						</button>
					</div>
				</div>

				{notice && (
					<div className="mt-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-800 backdrop-blur">
						<div className="flex items-center gap-2">
							<svg
								className="h-5 w-5 text-rose-500 shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>{notice}</span>
						</div>
						<button
							onClick={() => setNotice("")}
							className="text-rose-500 hover:text-rose-700"
						>
							✕
						</button>
					</div>
				)}
			</section>

			{/* Ringkasan Stats Cards */}
			<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<article className="relative overflow-hidden rounded-[1.4rem] border border-white/80 bg-white/85 p-5 shadow-[0_15px_30px_-10px_rgba(15,23,42,0.05)] backdrop-blur transition hover:shadow-md">
					<div className="flex items-center justify-between">
						<p className="text-xs font-bold uppercase tracking-wider text-slate-500">
							Total Potensi
						</p>
						<div className="rounded-xl bg-sky-50 p-2.5 text-sky-600">
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
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
					</div>
					<p className="mt-3 text-3xl font-extrabold text-slate-900">
						{isLoading ? "..." : summary.total}
					</p>
					<p className="mt-1 text-xs text-slate-500">
						Item terdaftar di sistem
					</p>
				</article>

				<article className="relative overflow-hidden rounded-[1.4rem] border border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-white/90 p-5 shadow-[0_15px_30px_-10px_rgba(15,23,42,0.05)] backdrop-blur transition hover:shadow-md">
					<div className="flex items-center justify-between">
						<p className="text-xs font-bold uppercase tracking-wider text-amber-700">
							Potensi Highlight
						</p>
						<div className="rounded-xl bg-amber-100/80 p-2.5 text-amber-600">
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
									d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
								/>
							</svg>
						</div>
					</div>
					<p className="mt-3 text-3xl font-extrabold text-amber-900">
						{isLoading ? "..." : summary.highlights}
					</p>
					<p className="mt-1 text-xs text-amber-600/80">
						Ditampilkan secara menonjol
					</p>
				</article>

				{summary.byCategory.slice(0, 2).map(([categoryName, count]) => (
					<article
						key={categoryName}
						className="relative overflow-hidden rounded-[1.4rem] border border-white/80 bg-white/85 p-5 shadow-[0_15px_30px_-10px_rgba(15,23,42,0.05)] backdrop-blur transition hover:shadow-md"
					>
						<div className="flex items-center justify-between">
							<p className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate max-w-[150px]">
								{categoryName}
							</p>
							<div className="rounded-xl bg-slate-100 p-2.5 text-slate-600">
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
										d="M7 7h.01M7 10h.01M7 13h.01M10 7h7m-7 3h7m-7 3h7M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
									/>
								</svg>
							</div>
						</div>
						<p className="mt-3 text-3xl font-extrabold text-slate-900">
							{isLoading ? "..." : count}
						</p>
						<p className="mt-1 text-xs text-slate-500">Jumlah item terdaftar</p>
					</article>
				))}

				{summary.byCategory.length === 0 && !isLoading && (
					<article className="rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50/50 p-5 flex flex-col justify-center">
						<p className="text-xs uppercase font-bold text-slate-400">
							Status Kategori
						</p>
						<p className="mt-2 text-sm font-semibold text-slate-700">
							Belum ada data potensi
						</p>
					</article>
				)}
			</section>

			{/* Grid Utama: Aksi Cepat (Kiri) & Daftar Item (Kanan) */}
			<section className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr] items-start">
				{/* Panel Aksi Cepat */}
				<section className="space-y-4 rounded-[1.6rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] backdrop-blur lg:rounded-[2rem] lg:p-6 sticky top-6">
					<div>
						<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
							<svg
								className="h-5 w-5 text-sky-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
							Aksi Cepat
						</h3>
						<p className="mt-1 text-xs leading-relaxed text-slate-500">
							Akses cepat ke navigasi kelola data dan pengaturan kategori.
						</p>
					</div>

					<div className="space-y-3 pt-2">
						<Link
							href="/admin/potensi/tambah"
							className="group relative flex items-start gap-3.5 rounded-2xl border border-sky-200/80 bg-gradient-to-r from-sky-600 to-sky-700 p-4 text-white shadow-md shadow-sky-600/10 transition hover:from-sky-700 hover:to-sky-800 hover:shadow-lg hover:shadow-sky-600/20 active:scale-[0.99]"
						>
							<div className="rounded-xl bg-white/20 p-2 backdrop-blur shrink-0 group-hover:scale-105 transition-transform">
								<svg
									className="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
							</div>
							<div>
								<p className="font-semibold text-sm">Tambah Potensi Baru</p>
								<p className="mt-0.5 text-xs text-sky-100">
									Form khusus untuk menambah data potensi desa secara lengkap.
								</p>
							</div>
						</Link>

						<Link
							href="/admin/potensi/kategori"
							className="group flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-[0.99]"
						>
							<div className="rounded-xl bg-slate-100 p-2 shrink-0 group-hover:bg-slate-200 transition-colors">
								<svg
									className="h-5 w-5 text-slate-700"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
							<div>
								<p className="font-semibold text-sm text-slate-900">
									Kelola Kategori
								</p>
								<p className="mt-0.5 text-xs text-slate-500">
									Ubah, tambah, atau sembunyikan kategori potensi secara
									dinamis.
								</p>
							</div>
						</Link>

						<div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-xs leading-relaxed text-sky-900 flex gap-2.5">
							<svg
								className="h-5 w-5 text-sky-600 shrink-0 mt-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>
								<strong>Tips:</strong> Klik tombol <b>Edit</b> pada kartu
								potensi untuk memperbarui detail informasi atau mengubah status
								highlight.
							</span>
						</div>
					</div>
				</section>

				{/* Panel Daftar Potensi */}
				<section className="space-y-4 rounded-[1.6rem] border border-white/80 bg-white/85 p-5 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.05)] backdrop-blur lg:rounded-[2rem] lg:p-6">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h3 className="text-lg font-bold text-slate-900">
								Daftar Potensi Desa
							</h3>
							<p className="text-xs text-slate-500">
								Total {filteredItems.length} data ditemukan
							</p>
						</div>
					</div>

					{/* Filter & Search Bar */}
					<div className="flex flex-col gap-2.5 sm:flex-row pt-1">
						<div className="relative flex-1">
							<svg
								className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Cari potensi atau deskripsi..."
								className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
								>
									✕
								</button>
							)}
						</div>

						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
						>
							<option value="ALL">Semua Kategori</option>
							{uniqueCategories.map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
					</div>

					{/* List Content */}
					<div className="space-y-3.5 pt-2">
						{/* Loading Skeleton */}
						{isLoading && (
							<div className="space-y-3">
								{[1, 2, 3].map((n) => (
									<div
										key={n}
										className="animate-pulse rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4"
									>
										<div className="flex gap-4">
											<div className="flex-1 space-y-2">
												<div className="h-3 w-1/4 rounded bg-slate-200" />
												<div className="h-5 w-3/4 rounded bg-slate-200" />
												<div className="h-3 w-full rounded bg-slate-200" />
											</div>
											<div className="h-20 w-24 rounded-xl bg-slate-200" />
										</div>
									</div>
								))}
							</div>
						)}

						{/* Empty State */}
						{!isLoading && filteredItems.length === 0 && (
							<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
								<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
									<svg
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
										/>
									</svg>
								</div>
								<h4 className="mt-3 font-semibold text-slate-800">
									Tidak ada potensi ditemukan
								</h4>
								<p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
									{searchQuery || selectedCategory !== "ALL"
										? "Coba ubah kata kunci pencarian atau filter kategori Anda."
										: "Belum ada potensi yang ditambahkan. Silakan tambahkan potensi baru."}
								</p>
								{(searchQuery || selectedCategory !== "ALL") && (
									<button
										onClick={() => {
											setSearchQuery("");
											setSelectedCategory("ALL");
										}}
										className="mt-4 rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
									>
										Reset Filter
									</button>
								)}
							</div>
						)}

						{/* Item List */}
						{!isLoading &&
							filteredItems.map((item) => (
								<article
									key={item.id}
									className="group relative rounded-2xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:border-sky-300 hover:shadow-md hover:shadow-sky-500/5"
								>
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										<div className="flex-1 pr-2">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="inline-flex items-center rounded-md bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-700">
													{item.categoryName}
												</span>

												{item.isHighlight ? (
													<span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/60">
														<svg
															className="h-3 w-3 text-amber-500 fill-amber-400"
															viewBox="0 0 20 20"
															fill="currentColor"
														>
															<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
														</svg>
														Highlight
													</span>
												) : (
													<span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
														Reguler
													</span>
												)}
											</div>

											<h4 className="mt-2 text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
												{item.title}
											</h4>
											<p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
												{item.description}
											</p>
										</div>

										<div className="relative h-20 w-full sm:w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
											<Image
												src={item.imageUrl}
												alt={item.title}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-105"
												sizes="(max-width: 640px) 100vw, 112px"
											/>
										</div>
									</div>

									{/* Actions Footer */}
									<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
										<span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
											<svg
												className="h-3.5 w-3.5 text-slate-400"
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
											Publik
										</span>

										<div className="flex items-center gap-2">
											<Link
												href={`/admin/potensi/${item.id}`}
												className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
											>
												<svg
													className="h-3.5 w-3.5 text-slate-500"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
													/>
												</svg>
												Edit
											</Link>

											<button
												type="button"
												onClick={() => void removeItem(item.id)}
												className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/80 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 hover:border-rose-300"
											>
												<svg
													className="h-3.5 w-3.5 text-rose-500"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
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
