"use client";

import Image from "next/image";
import { useEffect } from "react";
import { getCategoryBadgeStyle, type PotensiItem } from "@/lib/potensi-store";

type PotensiDetailModalProps = {
	item: PotensiItem | null;
	onClose: () => void;
};

// Popup detail potensi — dipanggil dari tombol "Lihat Detail" (kartu) dan
// "Lihat Selengkapnya" (hero spotlight). Sengaja dibuat sebagai komponen
// terpisah supaya halaman katalog utama tetap ringkas dan modal ini bisa
// dipakai ulang di halaman lain kalau perlu.
export default function PotensiDetailModal({
	item,
	onClose,
}: PotensiDetailModalProps) {
	// Kunci scroll halaman & dukung tombol Escape selama modal terbuka.
	useEffect(() => {
		if (!item) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				onClose();
			}
		}

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [item, onClose]);

	if (!item) {
		return null;
	}

	const galleryImages =
		item.images && item.images.length > 0 ? item.images : [item.imageUrl];
	const hasFullDesc = Boolean(item.fullDesc && item.fullDesc.trim());

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-label={`Detail ${item.title}`}
			onClick={onClose}
		>
			<div
				className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
				onClick={(event) => event.stopPropagation()}
			>
				<button
					type="button"
					onClick={onClose}
					aria-label="Tutup detail"
					className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow transition hover:bg-white hover:text-slate-900"
				>
					<svg
						viewBox="0 0 24 24"
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						aria-hidden="true"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</button>

				<div className="relative h-64 w-full overflow-hidden bg-slate-100 sm:h-72">
					<Image
						src={galleryImages[0]}
						alt={item.title}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 640px"
					/>
				</div>

				<div className="p-6 sm:p-8">
					<div className="flex flex-wrap items-center gap-2">
						<span
							className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${getCategoryBadgeStyle(item.category)}`}
						>
							{item.category}
						</span>
						<span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">
							{item.tag}
						</span>
					</div>

					<h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
						{item.title}
					</h2>

					<p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
						{hasFullDesc ? item.fullDesc : item.description}
					</p>

					{galleryImages.length > 1 ? (
						<div className="mt-6">
							<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
								Galeri Foto
							</p>
							<div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
								{galleryImages.slice(1).map((url, index) => (
									<div
										key={`${item.id}-gallery-${index}`}
										className="relative h-20 overflow-hidden rounded-xl bg-slate-100"
									>
										<Image
											src={url}
											alt={`Foto ${item.title} ${index + 2}`}
											fill
											className="object-cover"
											sizes="120px"
										/>
									</div>
								))}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}
