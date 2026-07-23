"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import SectionHeader from "@/app/components/SectionHeader";
import {
	initialSejarahContent,
	loadStoredSejarahContent,
	type SejarahContent,
} from "@/lib/sejarah-store";
import { getSejarahMilestone, getSejarahNarasi } from "@/lib/api";

const daftarIsi = [
	{ id: "asal-usul", label: "Asal-usul Desa" },
	{ id: "pemekaran", label: "Pemekaran Wilayah" },
	{ id: "dusun-kini", label: "Wilayah Dusun Kini" },
];

const liniMasaUtama = [
	{ year: "1928", label: "Pembentukan Desa" },
	{ year: "1979", label: "Pemekaran Tahap I" },
	{ year: "1997", label: "Pemekaran Tahap II" },
	{ year: "Kini", label: "5 Dusun Aktif" },
];

function pickText(...values: Array<string | undefined>) {
	for (const value of values) {
		if (typeof value === "string" && value.trim()) {
			return value.trim();
		}
	}

	return "";
}

export default function SejarahPage() {
	const [content, setContent] = useState<SejarahContent>(initialSejarahContent);
	const [activeSection, setActiveSection] = useState(daftarIsi[0].id);

	useEffect(() => {
		const localContent = loadStoredSejarahContent();
		setContent(localContent);

		void (async () => {
			try {
				const [narasiItems, milestoneItems] = await Promise.all([
					getSejarahNarasi(),
					getSejarahMilestone(),
				]);

				const sortedNarasi = [...narasiItems].sort(
					(a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999),
				);
				const originParagraphs = sortedNarasi
					.map((item) => pickText(item.content, item.body, item.description))
					.filter(Boolean);

				const sortedMilestones = [...milestoneItems].sort(
					(a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999),
				);
				const milestones = sortedMilestones
					.map((item) => {
						const yearValue = pickText(
							typeof item.year === "number" ? String(item.year) : item.year,
							"Kini",
						);
						const eventValue = pickText(
							item.event,
							item.description,
							item.content,
						);

						if (!eventValue) {
							return null;
						}

						return {
							year: yearValue,
							event: eventValue,
							imageUrl: item.imageUrl ?? undefined,
						};
					})
					.filter((item): item is NonNullable<typeof item> => item !== null);

				setContent((current) => ({
					...current,
					heroTitle: pickText(sortedNarasi[0]?.title, current.heroTitle),
					heroDescription: pickText(
						sortedNarasi[0]?.subtitle,
						originParagraphs[0],
						current.heroDescription,
					),
					originParagraphs:
						originParagraphs.length > 0
							? originParagraphs
							: current.originParagraphs,
					milestones: milestones.length > 0 ? milestones : current.milestones,
				}));
			} catch {
				// Menjaga konten lokal fallback ketika koneksi API mengalami penyesuaian
			}
		})();
	}, []);

	useEffect(() => {
		const sectionIds = daftarIsi.map((item) => item.id);
		const sections = sectionIds
			.map((id) => document.getElementById(id))
			.filter((section): section is HTMLElement => section !== null);

		if (!sections.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visibleEntries = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);

				if (visibleEntries.length > 0) {
					setActiveSection(visibleEntries[0].target.id);
				}
			},
			{
				root: null,
				rootMargin: "-22% 0px -58% 0px",
				threshold: [0.1, 0.25, 0.4, 0.6],
			},
		);

		sections.forEach((section) => observer.observe(section));

		return () => {
			sections.forEach((section) => observer.unobserve(section));
			observer.disconnect();
		};
	}, []);

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
			<Header />

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
				<div className="grid gap-6 sm:gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
					{/* Mobile Table of Contents */}
					<section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:hidden">
						<p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-700">
							Daftar Isi
						</p>
						<nav className="mt-3 flex flex-wrap gap-2">
							{daftarIsi.map((item) => {
								const isActive = activeSection === item.id;

								return (
									<a
										key={item.id}
										href={`#${item.id}`}
										className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
											isActive
												? "border-sky-300 bg-sky-50 text-sky-800"
												: "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
										}`}
									>
										{item.label}
									</a>
								);
							})}
						</nav>
					</section>

					{/* Desktop Sidebar Table of Contents & Timeline */}
					<aside className="hidden lg:block">
						<div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
							<p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
								Daftar Isi
							</p>
							<nav className="mt-4 space-y-1">
								{daftarIsi.map((item) => {
									const isActive = activeSection === item.id;

									return (
										<a
											key={item.id}
											href={`#${item.id}`}
											className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
												isActive
													? "bg-sky-50 font-semibold text-sky-700"
													: "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
											}`}
											aria-current={isActive ? "location" : undefined}
										>
											{item.label}
										</a>
									);
								})}
							</nav>

							<div className="mt-6 border-t border-slate-200 pt-5">
								<p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
									Lini Masa Utama
								</p>
								<ol className="mt-4 space-y-4">
									{liniMasaUtama.map((item) => (
										<li key={item.year} className="flex gap-3">
											<span
												className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-600 shrink-0"
												aria-hidden="true"
											/>
											<div>
												<p className="text-sm font-semibold text-slate-900">
													{item.year}
												</p>
												<p className="text-xs text-slate-600">{item.label}</p>
											</div>
										</li>
									))}
								</ol>
							</div>
						</div>
					</aside>

					{/* Main Content Area */}
					<div className="space-y-6 sm:space-y-8">
						{/* Hero Section */}
						<section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
							<span className="inline-block rounded-full bg-sky-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-sky-800 border border-sky-200">
								Napak Tilas Jadimulya
							</span>
							<h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
								{content.heroTitle}
							</h1>
							<p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
								{content.heroDescription}
							</p>

							<div className="mt-6 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 p-4 sm:p-5">
								<p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700">
									{content.visiTitle}
								</p>
								<p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">
									{content.visiDescription}
								</p>
							</div>
						</section>

						{/* Asal Usul Section */}
						<section
							id="asal-usul"
							className="scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
						>
							<SectionHeader
								title={content.originTitle}
								subtitle={content.originSubtitle}
							/>
							<div className="mt-4 space-y-4">
								{content.originParagraphs.map((paragraph, index) => (
									<p
										key={`${index}-${paragraph.slice(0, 24)}`}
										className="text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8"
									>
										{paragraph}
									</p>
								))}
							</div>
						</section>

						{/* Pemekaran Wilayah Section */}
						<section
							id="pemekaran"
							className="scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
						>
							<SectionHeader
								title={content.expansionTitle}
								subtitle={content.expansionSubtitle}
							/>

							{/* Diagram Sederhana Sejarah Pemekaran */}
							<div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
								<div className="mx-auto grid max-w-4xl gap-4 text-center">
									<div className="grid gap-3 sm:grid-cols-2">
										<div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
											Lembur Jumleng
										</div>
										<div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
											Lembur Jajaway
										</div>
									</div>

									<div
										className="mx-auto h-8 w-px bg-slate-300"
										aria-hidden="true"
									/>

									<div className="mx-auto rounded-2xl border border-sky-200 bg-sky-50 px-6 py-3 text-sm font-bold text-sky-800 sm:text-base">
										1928 - Desa Jadimulya
									</div>

									<div
										className="mx-auto h-8 w-px bg-slate-300"
										aria-hidden="true"
									/>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
											<p className="font-bold text-slate-900">
												Desa Jadimulya (Induk)
											</p>
											<p className="mt-1 text-xs text-slate-600">
												Jumleng, Cigintung, Ciranto
											</p>
										</div>
										<div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
											<p className="font-bold text-slate-900">
												1979 - Desa Jadikarya
											</p>
											<p className="mt-1 text-xs text-slate-600">
												Jajaway, Wangkalronyok
											</p>
										</div>
									</div>

									<div
										className="mx-auto h-8 w-px bg-slate-300"
										aria-hidden="true"
									/>

									<div className="grid gap-3 sm:grid-cols-2">
										<div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
											<p className="font-bold text-slate-900">
												1997 - Desa Sukamulya
											</p>
											<p className="mt-1 text-xs text-slate-600">Cigintung</p>
										</div>
										<div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
											<p className="font-bold text-slate-900">
												Desa Jadimulya (Induk)
											</p>
											<p className="mt-1 text-xs text-slate-600">
												Jumleng, Ciranto
											</p>
										</div>
									</div>

									<div
										className="mx-auto h-8 w-px bg-slate-300"
										aria-hidden="true"
									/>

									<div className="rounded-2xl border border-slate-300 bg-white px-4 py-4">
										<p className="text-sm font-bold text-slate-900">
											Struktur Dusun Desa Jadimulya Saat Ini
										</p>
										<div className="mt-3 flex flex-wrap justify-center gap-2">
											{content.dusunSaatIni.map((dusun) => (
												<span
													key={dusun}
													className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800"
												>
													{dusun}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Milestone Cards Grid */}
							<div className="mt-6 grid gap-4 md:grid-cols-2">
								{content.milestones.map((item, index) => (
									<article
										key={`${item.year}-${index}`}
										className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
									>
										<p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
											{item.year}
										</p>
										<p className="mt-2 text-[15px] leading-7 text-slate-700 sm:text-base">
											{item.event}
										</p>
										{item.imageUrl ? (
											<div className="relative mt-4 h-44 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
												<Image
													src={item.imageUrl}
													alt={`Foto peristiwa ${item.year}`}
													fill
													className="object-cover transition duration-300 hover:scale-105"
													sizes="(max-width: 768px) 100vw, 50vw"
												/>
											</div>
										) : null}
									</article>
								))}
							</div>
						</section>

						{/* Dusun Saat Ini Section */}
						<section
							id="dusun-kini"
							className="scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
						>
							<SectionHeader
								title={content.currentDusunTitle}
								subtitle={content.currentDusunSubtitle}
							/>
							<div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{content.dusunSaatIni.map((dusun) => (
									<div
										key={dusun}
										className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 transition hover:bg-sky-100/60"
									>
										<span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white shadow-sm">
											✓
										</span>
										<span className="text-sm font-semibold text-sky-900">
											{dusun}
										</span>
									</div>
								))}
							</div>
						</section>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}
