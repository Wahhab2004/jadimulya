"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HomepageOverview from "./sections/HomepageOverview";
import {
	initialHomepageContent,
	loadStoredHomepageContent,
	type HomepageContent,
} from "@/lib/homepage-store";
import {
	initialPotensiItems,
	loadStoredPotensiItems,
	type PotensiItem,
} from "@/lib/potensi-store";
import { getNews, getPotensi } from "@/lib/api";

function formatDate(value: string) {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return "Tanggal belum tersedia";
	}

	return parsed.toLocaleDateString("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
}

// BARU — category dari backend sekarang object relasi dinamis
// ({ id, name, isPublic, sortOrder }), bukan enum tetap PERTANIAN/PARIWISATA
// lagi. Sebelumnya filter di sini (`item.category === 'PERTANIAN'`) selalu
// false karena dibandingkan dengan objek, bukan string — hasilnya array
// kosong terus dan homepage diam-diam selalu pakai data lokal/dummy.
// Filter kategori publik/tersembunyi juga sudah ditangani di backend
// (listPublicPotensi mensyaratkan category.isPublic: true), jadi di sini
// tidak perlu filter ulang.
function mapApiPotensiToPublic(
	items: Awaited<ReturnType<typeof getPotensi>>,
): PotensiItem[] {
	return items.map((item) => ({
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
	}));
}

export default function HomePage() {
	const [content, setContent] = useState<HomepageContent>(
		initialHomepageContent,
	);
	const [potensiItems, setPotensiItems] = useState(initialPotensiItems);

	useEffect(() => {
		const localPotensi = loadStoredPotensiItems();
		setPotensiItems(localPotensi);
		setContent(loadStoredHomepageContent(localPotensi));

		void (async () => {
			try {
				const [apiPotensiRaw, apiNews] = await Promise.all([
					getPotensi(),
					getNews({ page: 1, limit: 3 }),
				]);

				const apiPotensi = mapApiPotensiToPublic(apiPotensiRaw);
				const nextPotensi = apiPotensi.length > 0 ? apiPotensi : localPotensi;

				setPotensiItems(nextPotensi);
				setContent((current) => ({
					...current,
					featuredPotensiIds: nextPotensi.slice(0, 3).map((item) => item.id),
					news:
						Array.isArray(apiNews.items) && apiNews.items.length > 0
							? apiNews.items.map((item) => ({
									id: item.id,
									category: item.category,
									title: item.title,
									date: formatDate(item.publishedAt),
									description:
										item.excerpt?.trim() || item.content.slice(0, 160),
									imageUrl: item.coverImage ?? "/images/potensi-kopi.jpg",
								}))
							: current.news,
				}));
			} catch {
				// Keep local fallback content when public API is unavailable.
			}
		})();
	}, []);

	const featuredPotensi = useMemo(() => {
		const map = new Map(potensiItems.map((item) => [item.id, item]));
		const selected = content.featuredPotensiIds
			.map((id) => map.get(id))
			.filter((item): item is (typeof initialPotensiItems)[number] =>
				Boolean(item),
			);

		return selected.length > 0 ? selected : potensiItems.slice(0, 3);
	}, [content.featuredPotensiIds, potensiItems]);

	const latestNews = useMemo(() => content.news.slice(0, 3), [content.news]);

	return (
		<main className="min-h-screen bg-slate-50">
			<Header />
			<HeroSection
				title={content.heroTitle}
				subtitle={content.heroSubtitle}
				slogan={content.slogan}
				ctaLabel={content.jelajahiLabel}
				ctaHref={content.jelajahiHref}
				logoKabupatenLabel={content.logoKabupatenLabel}
				logoKabupatenImageUrl={content.logoKabupatenImageUrl}
				slides={content.heroSlides}
				stats={content.stats}
			/>
			<HomepageOverview features={featuredPotensi} news={latestNews} />
			<Footer />
		</main>
	);
}
