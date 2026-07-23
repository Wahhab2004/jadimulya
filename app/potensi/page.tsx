"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import {
	initialPotensiItems,
	loadStoredPotensiItems,
	type PotensiCategory,
	type PotensiItem,
} from "@/lib/potensi-store";
import { getPotensi } from "@/lib/api";

const categoryFilters = ["Semua Potensi", "Pertanian", "Wisata"] as const;
type CategoryFilter = (typeof categoryFilters)[number];

// Kategori warna konsisten mengikuti nuansa sky/blue Pangandaran
const categoryBadgeStyles: Record<PotensiCategory, string> = {
	Pertanian: "bg-sky-100 text-sky-800 border-sky-200",
	Wisata: "bg-blue-100 text-blue-800 border-blue-200",
};

const categoryOrderWeight: Record<PotensiCategory, number> = {
	Pertanian: 1,
	Wisata: 2,
};

const cardActionIcons: Record<PotensiCategory, JSX.Element> = {
	Pertanian: (
		<svg
			viewBox="0 0 24 24"
			className="h-4 w-4"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			aria-hidden="true"
		>
			<path d="M7 13c0 3 2 5 5 5" />
			<path d="M17 11c0 4-2 8-5 8V6c2 0 5 2 5 5Z" />
			<path d="M12 10c-2 0-5 2-5 5" />
		</svg>
	),
	Wisata: (
		<svg
			viewBox="0 0 24 24"
			className="h-4 w-4"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			aria-hidden="true"
		>
			<path d="M7 21h10" />
			<path d="M12 21V10" />
			<path d="M5 5h7l2 3H5V5Z" />
			<path d="m14 8 2 3h3" />
		</svg>
	),
};

export default function PotensiPage() {
	const [potensiItems, setPotensiItems] =
		useState<PotensiItem[]>(initialPotensiItems);
	const [activeFilter, setActiveFilter] =
		useState<CategoryFilter>("Semua Potensi");
	const [visibleCount, setVisibleCount] = useState(6);

	useEffect(() => {
		const localItems = loadStoredPotensiItems();
		setPotensiItems(localItems);

		void (async () => {
			try {
				const apiItems = await getPotensi();
				const mappedItems = apiItems
					.filter(
						(item) =>
							item.category === "PERTANIAN" || item.category === "PARIWISATA",
					)
					.map(
						(item) =>
							({
								id: item.id,
								title: item.name,
								description: item.shortDesc,
								category:
									item.category === "PARIWISATA" ? "Wisata" : "Pertanian",
								tag: item.isHighlight ? "Highlight" : "Reguler",
								imageUrl: item.coverImage ?? "/images/potensi-wisata.jpg",
							}) satisfies PotensiItem,
					);

				if (mappedItems.length > 0) {
					setPotensiItems(mappedItems);
				}
			} catch {
				// Menyimpan data lokal secara tenang jika koneksi sedang disesuaikan
			}
		})();
	}, []);

	const filteredItems = useMemo(() => {
		const base =
			activeFilter === "Semua Potensi"
				? potensiItems
				: potensiItems.filter((item) => item.category === activeFilter);

		return [...base].sort((a, b) => {
			if (categoryOrderWeight[a.category] !== categoryOrderWeight[b.category]) {
				return (
					categoryOrderWeight[a.category] - categoryOrderWeight[b.category]
				);
			}
			return a.title.localeCompare(b.title);
		});
	}, [activeFilter, potensiItems]);

	const visibleItems = filteredItems.slice(0, visibleCount);
	const hasMore = visibleCount < filteredItems.length;

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
							Menemukan kekuatan desa dari sektor pertanian dan pariwisata yang
							menjadi pilar prioritas pengembangan dan kesejahteraan warga desa.
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
												className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${categoryBadgeStyles[highlightItem.category]}`}
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
										className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border backdrop-blur-md shadow-sm ${categoryBadgeStyles[item.category]}`}
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
											className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700"
										>
											Lihat Detail
										</button>
										<button
											type="button"
											className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-sky-700 transition hover:bg-sky-50"
											aria-label={`Aksi Tambahan ${item.title}`}
										>
											{cardActionIcons[item.category]}
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
								className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
							>
								Unduh Katalog Potensi (PDF)
							</button>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
