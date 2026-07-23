"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroSlide, HomepageStat } from "@/lib/homepage-store";

type HeroSectionProps = {
	title: string;
	subtitle: string;
	slogan: string;
	ctaLabel: string;
	ctaHref: string;
	logoKabupatenLabel: string;
	logoKabupatenImageUrl?: string;
	slides: HeroSlide[];
	stats: HomepageStat[];
};

export default function HeroSection({
	title,
	subtitle,
	slogan,
	ctaLabel,
	ctaHref,
	logoKabupatenLabel,
	logoKabupatenImageUrl,
	slides = [],
	stats = [],
}: HeroSectionProps) {
	const [activeSlide, setActiveSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	// Otomatis berpindah slide setiap 5 detik (berhenti jika di-hover)
	useEffect(() => {
		if (slides.length <= 1 || isPaused) {
			return;
		}

		const intervalId = window.setInterval(() => {
			setActiveSlide((current) => (current + 1) % slides.length);
		}, 5000);

		return () => window.clearInterval(intervalId);
	}, [slides.length, isPaused]);

	const safeIndex = slides.length > 0 ? activeSlide % slides.length : 0;
	const currentSlide = slides[safeIndex];

	return (
		<section
			className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white shadow-2xl"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			{/* Background Slideshow dengan Animasi Smooth Crossfade */}
			{slides.length > 0 && (
				<div className="absolute inset-0 z-0">
					{slides.map((slide, index) => {
						const isActive = index === safeIndex;
						return (
							<div
								key={slide.id || index}
								className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
									isActive ? "opacity-100 z-10" : "opacity-0 z-0"
								}`}
							>
								<Image
									src={slide.imageUrl}
									alt={slide.caption || title}
									fill
									priority={index === 0}
									className="object-cover contrast-105 saturate-[0.9]"
									sizes="100vw"
								/>
							</div>
						);
					})}
				</div>
			)}

			{/* Dark & Ocean Gradient Overlay */}
			<div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-sky-950/50" />
			<div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

			{/* Container Konten Utama */}
			<div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
				<div className="grid gap-12 lg:grid-cols-12 lg:items-center">
					{/* Sisi Kiri: Teks & Aksi Utama */}
					<div className="lg:col-span-7">
						{/* Badge Slogan */}
						<div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-1.5 backdrop-blur-md">
							<span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
							<span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
								{slogan}
							</span>
						</div>

						{/* Judul Utama */}
						<h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight lg:text-6xl">
							{title}
						</h1>

						{/* Subtitle / Deskripsi Singkat */}
						<p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg sm:leading-8">
							{subtitle}
						</p>

						{/* Tombol CTA dan Kontrol Slide */}
						<div className="mt-8 flex flex-wrap items-center gap-4">
							<Link
								href={ctaHref}
								className="group inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/40 transition-all duration-300 hover:bg-sky-500 hover:shadow-sky-500/25 active:scale-95"
							>
								<span>{ctaLabel}</span>
								<svg
									className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							</Link>

							{/* Slider Navigation Dots */}
							{slides.length > 1 && (
								<div
									className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/50 px-3.5 py-2.5 backdrop-blur-md"
									role="tablist"
									aria-label="Navigasi Galeri Beranda"
								>
									{slides.map((slide, index) => {
										const isActive = safeIndex === index;
										return (
											<button
												key={slide.id || index}
												type="button"
												onClick={() => setActiveSlide(index)}
												className={`h-2.5 rounded-full transition-all duration-300 ${
													isActive
														? "w-7 bg-sky-400 shadow-sm shadow-sky-400/50"
														: "w-2.5 bg-white/40 hover:bg-white/70"
												}`}
												aria-label={`Tampilkan slide ${index + 1}`}
												aria-selected={isActive}
												role="tab"
											/>
										);
									})}
								</div>
							)}
						</div>

						{/* Identitas Daerah / Badge Pemkab */}
						<div className="mt-8 inline-flex items-center gap-3.5 rounded-2xl border border-white/15 bg-slate-900/40 p-2.5 pr-5 backdrop-blur-md">
							{logoKabupatenImageUrl ? (
								<Image
									src={logoKabupatenImageUrl}
									alt={logoKabupatenLabel}
									width={40}
									height={40}
									className="h-10 w-10 rounded-xl border border-white/20 bg-white object-contain p-0.5 shadow-sm"
								/>
							) : (
								<span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-500/20 text-xs font-bold text-sky-200">
									PEMKAB
								</span>
							)}
							<div>
								<p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300/90">
									Identitas Wilayah
								</p>
								<p className="text-xs font-semibold text-white sm:text-sm">
									{logoKabupatenLabel}
								</p>
							</div>
						</div>
					</div>

					{/* Sisi Kanan / Bawah: Grid Statistik Beranda */}
					<div className="lg:col-span-5">
						{stats.length > 0 && (
							<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
								{stats.map((item, idx) => (
									<div
										key={item.label || idx}
										className="group relative overflow-hidden rounded-2xl border border-white/15 bg-slate-900/50 p-5 backdrop-blur-md transition duration-300 hover:border-sky-400/40 hover:bg-slate-900/70"
									>
										<p className="text-xs font-bold uppercase tracking-wider text-slate-300">
											{item.label}
										</p>
										<p className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
											{item.value}
										</p>
										{item.note && (
											<p className="mt-1.5 text-xs text-slate-300">
												{item.note}
											</p>
										)}
									</div>
								))}
							</div>
						)}

						{/* Caption Slide Terpasang jika ada */}
						{currentSlide?.caption && (
							<div className="mt-3 text-right">
								<span className="inline-block rounded-lg bg-slate-950/60 px-3 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-sm border border-white/10">
									📸 {currentSlide.caption}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
