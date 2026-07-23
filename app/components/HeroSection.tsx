"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { HeroSlide, HomepageStat } from '@/lib/homepage-store';

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
	slides,
	stats,
}: HeroSectionProps) {
	const [activeSlide, setActiveSlide] = useState(0);

	useEffect(() => {
		if (slides.length <= 1) {
			return;
		}

		const intervalId = window.setInterval(() => {
			setActiveSlide((current) => (current + 1) % slides.length);
		}, 4500);

		return () => window.clearInterval(intervalId);
	}, [slides.length]);

	const safeIndex = slides.length > 0 ? activeSlide % slides.length : 0;
	const currentSlide = slides[safeIndex];

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white shadow-inner">
			{currentSlide ? (
				<Image
					src={currentSlide.imageUrl}
					alt={currentSlide.caption}
					fill
					className="object-cover sepia-[0.28] contrast-110 saturate-[0.85]"
					sizes="100vw"
				/>
			) : null}
			<div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-sky-950/55 to-sky-900/35" />
			<div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
				<div className="max-w-3xl">
					<span className="inline-flex rounded-full border border-sky-200/40 bg-sky-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
						{slogan}
					</span>
					<h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
						{title}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100/90">
						{subtitle}
					</p>
					<div className="mt-8 flex flex-wrap items-center gap-3">
						<a
							href={ctaHref}
							className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-sky-500"
						>
							{ctaLabel}
						</a>
						{slides.length > 1 ? (
							<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2">
								{slides.map((slide, index) => (
									<button
										type="button"
										key={slide.id}
										onClick={() => setActiveSlide(index)}
										className={`h-2.5 w-2.5 rounded-full transition ${safeIndex === index ? 'bg-sky-300' : 'bg-white/45 hover:bg-white/75'}`}
										aria-label={`Pilih slide ${index + 1}`}
									/>
								))}
							</div>
						) : null}
					</div>
				</div>

				<div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/30 p-3 text-sm text-slate-100/90 backdrop-blur-sm sm:max-w-fit">
					{logoKabupatenImageUrl ? (
						<Image src={logoKabupatenImageUrl} alt={logoKabupatenLabel} width={36} height={36} className="h-9 w-9 rounded-full border border-white/20 bg-white object-cover" />
					) : (
						<span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-sky-500/30 text-[11px] font-semibold text-sky-100">
							Logo
						</span>
					)}
					<div>
						<p className="text-xs uppercase tracking-[0.14em] text-slate-200/80">Identitas Daerah</p>
						<p className="font-semibold text-white">{logoKabupatenLabel}</p>
					</div>
				</div>

				<div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{stats.map((item) => (
						<div
							key={item.label}
							className="rounded-3xl border border-white/20 bg-slate-950/50 p-6 backdrop-blur-sm"
						>
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/80">
								{item.label}
							</p>
							<p className="mt-4 text-3xl font-semibold text-white">
								{item.value}
							</p>
							{item.note ? (
								<p className="mt-2 text-sm text-slate-200/80">{item.note}</p>
							) : null}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
