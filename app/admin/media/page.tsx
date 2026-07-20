"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
	MEDIA_MAX_FILE_SIZE,
	isAllowedImageSize,
	isAllowedImageType,
} from "@/lib/media-store";
import { showAdminToast } from "@/lib/admin-toast";
import { buildAdminBeUrl } from "@/lib/admin-api-client";

// ─── Types ──────────────────────────────────────────────────────────────────
// Bentuk data ini sengaja mengikuti persis model `Media` di Prisma
// (fileName/sizeBytes, bukan name/size) supaya tidak ada lapisan mapping
// tambahan antara response backend dan state di sini.

type MediaItem = {
	id: string;
	fileName: string;
	url: string;
	mimeType: string;
	sizeBytes: number;
	createdAt: string;
};

type BackendResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

// Kalau file yang diunggah disajikan dari origin backend yang berbeda dari
// frontend (bukan lewat rewrite/proxy Next.js untuk path /uploads), set
// NEXT_PUBLIC_BACKEND_URL ke origin backend (mis. https://api.jadimulya.id).
// Kalau kosong, url dari backend dipakai apa adanya seperti sebelumnya.
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

function resolveMediaUrl(url: string) {
	if (/^https?:\/\//i.test(url)) return url;
	return `${BACKEND_ORIGIN}${url}`;
}

function formatFileSize(bytes: number) {
	if (bytes < 1024) {
		return `${bytes} B`;
	}

	const kb = bytes / 1024;
	if (kb < 1024) {
		return `${kb.toFixed(1)} KB`;
	}

	return `${(kb / 1024).toFixed(2)} MB`;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(buildAdminBeUrl(path), {
		cache: "no-store",
		...options,
	});
	const json = (await res
		.json()
		.catch(() => null)) as BackendResponse<T> | null;
	if (!res.ok) {
		throw new Error(json?.message || `API error: ${res.status}`);
	}
	return (json as BackendResponse<T>).data;
}

export default function AdminMediaPage() {
	const [items, setItems] = useState<MediaItem[]>([]);
	const [notice, setNotice] = useState("");
	const [filter, setFilter] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	useEffect(() => {
		void fetchMedia();
	}, []);

	async function fetchMedia() {
		setIsLoading(true);
		try {
			const data = await apiFetch<MediaItem[]>("media");
			setItems(Array.isArray(data) ? data : []);
		} catch {
			showAdminToast("Gagal memuat daftar media dari backend.", "error");
		} finally {
			setIsLoading(false);
		}
	}

	const filteredItems = useMemo(() => {
		const keyword = filter.trim().toLowerCase();
		if (!keyword) {
			return items;
		}

		return items.filter((item) =>
			item.fileName.toLowerCase().includes(keyword),
		);
	}, [items, filter]);

	async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
		const files = Array.from(event.target.files ?? []);
		if (files.length === 0) {
			return;
		}

		const validFiles: File[] = [];
		let rejectedCount = 0;

		for (const file of files) {
			if (!isAllowedImageType(file) || !isAllowedImageSize(file)) {
				rejectedCount += 1;
				continue;
			}
			validFiles.push(file);
		}

		if (validFiles.length === 0) {
			const message =
				"Tidak ada file yang diunggah. Pastikan file adalah gambar dan ukuran maksimal 2 MB.";
			setNotice(message);
			showAdminToast(message, "error");
			event.target.value = "";
			return;
		}

		setIsUploading(true);
		let successCount = 0;

		// Backend hanya menerima satu file per request (`upload.single('file')`),
		// jadi tiap file dikirim sebagai request terpisah.
		for (const file of validFiles) {
			try {
				const formData = new FormData();
				formData.append("file", file);
				await apiFetch<MediaItem>("media", { method: "POST", body: formData });
				successCount += 1;
			} catch {
				rejectedCount += 1;
			}
		}

		setIsUploading(false);
		event.target.value = "";
		await fetchMedia();

		if (successCount === 0) {
			const message = "Semua file gagal diunggah ke server.";
			setNotice(message);
			showAdminToast(message, "error");
		} else if (rejectedCount > 0) {
			const message = `${successCount} file berhasil diunggah, ${rejectedCount} file ditolak/gagal.`;
			setNotice(message);
			showAdminToast(message, "info");
		} else {
			const message = `${successCount} file berhasil diunggah.`;
			setNotice(message);
			showAdminToast(message, "success");
		}
	}

	async function removeItem(id: string, fileName: string) {
		const confirmed = window.confirm(
			`Hapus "${fileName}" dari library? Tindakan ini tidak bisa dibatalkan.`,
		);
		if (!confirmed) {
			return;
		}

		try {
			await apiFetch(`media/${id}`, { method: "DELETE" });
			showAdminToast("Media berhasil dihapus.", "success");
			await fetchMedia();
		} catch {
			showAdminToast("Gagal menghapus media.", "error");
		}
	}

	return (
		<div className="space-y-4">
			<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
					Modul Media
				</p>
				<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
					Media Upload Dasar
				</h2>
				<p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
					Upload gambar untuk konten homepage, potensi, sejarah, dan organisasi.
					Data diambil langsung dari backend — sistem memvalidasi format gambar
					dan ukuran file maksimal 2 MB.
				</p>
				{notice ? (
					<div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
						{notice}
					</div>
				) : null}
			</section>

			<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h3 className="text-xl font-semibold text-slate-900">
							Unggah Gambar
						</h3>
						<p className="text-sm text-slate-600">
							Format yang didukung: JPG, PNG, WEBP, SVG. Maksimal{" "}
							{formatFileSize(MEDIA_MAX_FILE_SIZE)} per file.
						</p>
					</div>
					<label
						className={`inline-flex items-center rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:from-sky-700 hover:to-blue-800 ${isUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
					>
						{isUploading ? "Mengunggah..." : "Pilih File"}
						<input
							type="file"
							accept="image/*"
							multiple
							className="hidden"
							onChange={handleFiles}
							disabled={isUploading}
						/>
					</label>
				</div>
			</section>

			<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
					<h3 className="text-xl font-semibold text-slate-900">Daftar Media</h3>
					<div className="flex items-center gap-2">
						<input
							type="search"
							value={filter}
							onChange={(event) => setFilter(event.target.value)}
							placeholder="Cari nama file..."
							className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-300"
						/>
						<button
							type="button"
							onClick={() => void fetchMedia()}
							disabled={isLoading}
							className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
						>
							{isLoading ? "Memuat..." : "Refresh"}
						</button>
					</div>
				</div>

				{filteredItems.length === 0 ? (
					<div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
						{isLoading ? "Memuat media..." : "Belum ada media tersimpan."}
					</div>
				) : (
					<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{filteredItems.map((item) => (
							<article
								key={item.id}
								className="rounded-2xl border border-slate-200 bg-white p-3"
							>
								<div className="relative h-36 w-full overflow-hidden rounded-xl border border-slate-200">
									<Image
										src={resolveMediaUrl(item.url)}
										alt={item.fileName}
										fill
										className="object-cover"
										sizes="(max-width: 1280px) 50vw, 33vw"
									/>
								</div>
								<p
									className="mt-3 line-clamp-1 text-sm font-semibold text-slate-900"
									title={item.fileName}
								>
									{item.fileName}
								</p>
								<p className="mt-1 text-xs text-slate-500">
									{formatFileSize(item.sizeBytes)} •{" "}
									{new Date(item.createdAt).toLocaleDateString("id-ID")}
								</p>
								<div className="mt-3 flex justify-end">
									<button
										type="button"
										onClick={() => void removeItem(item.id, item.fileName)}
										className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
									>
										Hapus
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
