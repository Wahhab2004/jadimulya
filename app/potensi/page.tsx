"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import PotensiDetailModal from "@/app/components/PotensiDetailModal";
import {
	getCategoryBadgeStyle,
	initialPotensiItems,
	loadStoredPotensiItems,
	type PotensiItem,
} from "@/lib/potensi-store";
import {
	getPotensi,
	getPotensiKategori,
	type BackendPotensiCategory,
} from "@/lib/api";
import { downloadPotensiCatalogPdf } from "@/lib/potensi-catalog-pdf";

const SEMUA_POTENSI = "Semua Potensi";

// Ikon generik untuk aksi tambahan di kartu — kategori sekarang dinamis
// (nama bebas dari admin), jadi tidak lagi ada ikon khusus per kategori
// seperti sebelumnya (yang cuma cocok untuk 2 kategori tetap).
function CardActionIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			className="h-4 w-4"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			aria-hidden="true"
		>
			<path d="M9 18h6" />
			<path d="M10 21h4" />
			<path d="M12 3a6 6 0 0 0-6 6c0 2.5 1.5 4 2.5 5.5S10 17 10 18h4c0-1 1-1.5 2-3s2.5-3 2.5-5.5A6 6 0 0 0 12 3Z" />
		</svg>
	);
}

export default function PotensiPage() {
	const [potensiItems, setPotensiItems] =
		useState<PotensiItem[]>(initialPotensiItems);
	const [categories, setCategories] = useState<BackendPotensiCategory[]>([]);
	const [activeFilter, setActiveFilter] = useState<string>(SEMUA_POTENSI);
	const [visibleCount, setVisibleCount] = useState(6);
	const [selectedItem, setSelectedItem] = useState<PotensiItem | null>(null);
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadError, setDownloadError] = useState("");

	useEffect(() => {
		const localItems = loadStoredPotensiItems();
		setPotensiItems(localItems);

		void (async () => {
			try {
				const apiItems = await getPotensi();
				const mappedItems = apiItems.map(
					(item) =>
						({
							id: item.id,
							title: item.name,
							description: item.shortDesc,
							fullDesc: item.fullDesc ?? undefined,
							category: item.category?.name ?? "Lainnya",
							tag: item.isHighlight ? "Highlight" : "Reguler",
							imageUrl: item.coverImage ?? "/images/potensi-wisata.jpg",
							images:
								item.images && item.images.length > 0
									? [...item.images]
											.sort((a, b) => a.sortOrder - b.sortOrder)
											.map((image) => image.imageUrl)
									: undefined,
						}) satisfies PotensiItem,
				);

				if (mappedItems.length > 0) {
					setPotensiItems(mappedItems);
				}
			} catch {
				// Menyimpan data lokal secara tenang jika koneksi sedang disesuaikan
			}
		})();

		void (async () => {
			try {
				const apiCategories = await getPotensiKategori();
				setCategories(
					[...apiCategories].sort((a, b) => a.sortOrder - b.sortOrder),
				);
			} catch {
				// Filter tetap jalan dengan "Semua Potensi" saja kalau kategori gagal dimuat
			}
		})();
	}, []);

	// Bobot urutan kategori sekarang diambil dari sortOrder backend, bukan
	// hardcode Pertanian:1, Wisata:2 — supaya ikut urutan yang diatur admin.
	const categoryOrderWeight = useMemo(() => {
		const weights = new Map<string, number>();
		categories.forEach((category, index) => {
			weights.set(category.name, category.sortOrder ?? index);
		});
		return weights;
	}, [categories]);

	const categoryFilters = useMemo(
		() => [SEMUA_POTENSI, ...categories.map((category) => category.name)],
		[categories],
	);

	const filteredItems = useMemo(() => {
		const base =
			activeFilter === SEMUA_POTENSI
				? potensiItems
				: potensiItems.filter((item) => item.category === activeFilter);

		return [...base].sort((a, b) => {
			const weightA = categoryOrderWeight.get(a.category) ?? 999;
			const weightB = categoryOrderWeight.get(b.category) ?? 999;
			if (weightA !== weightB) {
				return weightA - weightB;
			}
			return a.title.localeCompare(b.title);
		});
	}, [activeFilter, potensiItems, categoryOrderWeight]);

	const visibleItems = filteredItems.slice(0, visibleCount);
	const hasMore = visibleCount < filteredItems.length;

	// Daftar lengkap (tidak difilter) tapi tetap terurut sesuai kategori —
	// dipakai untuk PDF supaya katalog yang diunduh selalu berisi semua
	// potensi, terlepas dari filter yang sedang aktif di layar.
	const sortedAllItems = useMemo(() => {
		return [...potensiItems].sort((a, b) => {
			const weightA = categoryOrderWeight.get(a.category) ?? 999;
			const weightB = categoryOrderWeight.get(b.category) ?? 999;
			if (weightA !== weightB) {
				return weightA - weightB;
			}
			return a.title.localeCompare(b.title);
		});
	}, [potensiItems, categoryOrderWeight]);

	async function handleDownloadCatalog() {
		setDownloadError("");
		setIsDownloading(true);
		try {
			await downloadPotensiCatalogPdf(sortedAllItems);
		} catch {
			setDownloadError("Gagal membuat PDF. Coba lagi beberapa saat.");
		} finally {
			setIsDownloading(false);
		}
	}

	// Item Unggulan untuk Hero Spotlight Banner
	const highlightItem = useMemo(
		() =>
			potensiItems.find((item) => item.tag === "Highlight") ?? potensiItems[0],
		[potensiItems],
	);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
			<Header />

			<main className="pb-16">
				{/* Hero Banner Section */}
				<section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-slate-50 to-slate-50 pt-10 pb-12 sm:pt-14 sm:pb-16">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
						<h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
							Potensi dan Keunggulan <br className="hidden sm:inline" />
							<span className="text-sky-600">Desa Jadimulya</span>
						</h1>

						<p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
							Menemukan kekuatan desa dari berbagai sektor unggulan yang menjadi
							pilar prioritas pengembangan dan kesejahteraan warga desa.
						</p>
					</div>

					{/* Featured Spotlight Card (Mengadopsi Tata Letak Modern dari Referensi Gambar) */}
					{highlightItem ? (
						<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
							<div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
								<div className="grid lg:grid-cols-12 items-center gap-0">
									<div className="relative h-64 sm:h-80 lg:h-[380px] lg:col-span-7 overflow-hidden bg-slate-100">
										<Image
											src={highlightItem.imageUrl}
											alt={highlightItem.title}
											fill
											className="object-cover transition duration-500 hover:scale-105"
											priority
											sizes="(max-width: 1024px) 100vw, 60vw"
										/>
										<span className="absolute top-4 left-4 rounded-full bg-sky-600 text-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider shadow">
											Potensi Unggulan
										</span>
									</div>

									<div className="p-6 sm:p-8 lg:col-span-5 flex flex-col justify-center">
										<div className="flex items-center gap-2">
											<span
												className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${getCategoryBadgeStyle(highlightItem.category)}`}
											>
												{highlightItem.category}
											</span>
										</div>
										<h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
											{highlightItem.title}
										</h2>
										<p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
											{highlightItem.description}
										</p>
										<div className="mt-6 flex items-center gap-3">
											<button
												type="button"
												onClick={() => setSelectedItem(highlightItem)}
												className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
											>
												Lihat Selengkapnya
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : null}
				</section>

				{/* Filter & Catalog Grid Section */}
				<section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
					{/* Header Controls */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
						<div className="flex flex-wrap items-center gap-2">
							{categoryFilters.map((category) => {
								const isActive = activeFilter === category;
								return (
									<button
										key={category}
										type="button"
										onClick={() => {
											setActiveFilter(category);
											setVisibleCount(6);
										}}
										className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition ${
											isActive
												? "bg-sky-600 text-white shadow-sm"
												: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
										}`}
									>
										{category}
									</button>
								);
							})}
						</div>

						<p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
							Menampilkan{" "}
							<span className="text-sky-600">{filteredItems.length}</span>{" "}
							Potensi Desa
						</p>
					</div>

					{/* Cards Grid Standardized (rounded-[2rem], bg-white, border border-slate-200) */}
					<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{visibleItems.map((item) => (
							<article
								key={item.id}
								className="group flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
							>
								{/* Foto Sampul */}
								<div className="relative h-56 w-full overflow-hidden bg-slate-100">
									<Image
										src={item.imageUrl}
										alt={item.title}
										fill
										className="object-cover transition duration-500 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
									/>
									<span
										className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border backdrop-blur-md shadow-sm ${getCategoryBadgeStyle(item.category)}`}
									>
										{item.category}
									</span>
								</div>

								{/* Detail Konten */}
								<div className="flex flex-1 flex-col justify-between p-6">
									<div>
										<p className="text-[11px] font-bold uppercase tracking-widest text-sky-700">
											{item.tag}
										</p>
										<h3 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition">
											{item.title}
										</h3>
										<p className="mt-2.5 line-clamp-3 text-xs sm:text-sm leading-relaxed text-slate-600">
											{item.description}
										</p>
									</div>

									{/* Tombol Aksi */}
									<div className="mt-6 flex items-center gap-2 pt-4 border-t border-slate-100">
										<button
											type="button"
											onClick={() => setSelectedItem(item)}
											className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700"
										>
											Lihat Detail
										</button>
										<button
											type="button"
											className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-sky-700 transition hover:bg-sky-50"
											aria-label={`Aksi Tambahan ${item.title}`}
										>
											<CardActionIcon />
										</button>
									</div>
								</div>
							</article>
						))}
					</div>

					{/* Tombol Tampilkan Lebih Banyak */}
					<div className="mt-10 flex justify-center">
						<button
							type="button"
							onClick={() => setVisibleCount((count) => count + 3)}
							disabled={!hasMore}
							className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
						>
							{hasMore
								? "Tampilkan Lebih Banyak Potensi"
								: "Semua Data Telah Ditampilkan"}
							<svg
								viewBox="0 0 24 24"
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								aria-hidden="true"
							>
								<path d="m6 9 6 6 6-6" />
							</svg>
						</button>
					</div>
				</section>

				{/* Banner Kerjasama Warga & Mitra */}
				<section className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10 text-center shadow-sm">
						<span className="text-xs font-bold uppercase tracking-widest text-sky-700">
							Peluang Kerjasama Desa
						</span>
						<h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
							Ingin Menjadi Mitra Pengembang Desa?
						</h2>
						<p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed">
							Pemerintah Desa Jadimulya membuka ruang kolaborasi bagi investor,
							pengembang usaha, maupun wisatawan yang ingin berkontribusi
							memajukan potensi lokal.
						</p>
						<div className="mt-6 flex flex-wrap justify-center gap-3">
							<button
								type="button"
								className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
							>
								Hubungi Pemerintah Desa
							</button>
							<button
								type="button"
								onClick={handleDownloadCatalog}
								disabled={isDownloading || sortedAllItems.length === 0}
								className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isDownloading
									? "Menyiapkan PDF..."
									: "Unduh Katalog Potensi (PDF)"}
							</button>
						</div>
						{downloadError ? (
							<p className="mt-3 text-xs font-medium text-rose-600">
								{downloadError}
							</p>
						) : null}
					</div>
				</section>
			</main>

			<Footer />

			<PotensiDetailModal
				item={selectedItem}
				onClose={() => setSelectedItem(null)}
			/>
		</div>
	);
}
