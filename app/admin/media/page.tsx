"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import {
	FileImageIcon,
	UploadCloud,
	Search,
	RefreshCw,
	Trash2,
	Copy,
	Check,
	FileImage,
	AlertCircle,
	Info,
	Sparkles,
} from "lucide-react";
import {
	MEDIA_MAX_FILE_SIZE,
	isAllowedImageSize,
	isAllowedImageType,
	saveMediaItems,
} from "@/lib/media-store";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch, buildAdminBeUrl } from "@/lib/admin-api-client";

// ─── Types ──────────────────────────────────────────────────────────────────
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

// ─── Constants & Helpers ────────────────────────────────────────────────────
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const API_BASE_ORIGIN = (() => {
	try {
		return new URL(buildAdminBeUrl("")).origin;
	} catch {
		return "";
	}
})();

function resolveMediaUrl(url: string) {
	if (/^https?:\/\//i.test(url)) return url;
	if (url.startsWith("/")) {
		return url;
	}
	const origin = BACKEND_ORIGIN || API_BASE_ORIGIN;
	if (!origin) {
		return url;
	}
	const normalizedPath = url.startsWith("/") ? url : `/${url}`;
	return `${origin}${normalizedPath}`;
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
	const res = await adminBeFetch(path, options);
	const json = (await res
		.json()
		.catch(() => null)) as BackendResponse<T> | null;
	if (!res.ok) {
		throw new Error(json?.message || `API error: ${res.status}`);
	}
	return (json as BackendResponse<T>).data;
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function AdminMediaPage() {
	const [items, setItems] = useState<MediaItem[]>([]);
	const [notice, setNotice] = useState("");
	const [filter, setFilter] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	useEffect(() => {
		void fetchMedia();
	}, []);

	async function fetchMedia() {
		setIsLoading(true);
		try {
			const data = await apiFetch<MediaItem[]>("media");
			const nextItems = Array.isArray(data) ? data : [];
			setItems(nextItems);
			saveMediaItems(
				nextItems.map((item) => ({
					id: item.id,
					name: item.fileName,
					url: item.url,
					size: item.sizeBytes,
					mimeType: item.mimeType,
					createdAt: item.createdAt,
				})),
			);
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

		for (const file of validFiles) {
			try {
				const formData = new FormData();
				formData.append("file", file);
				await apiFetch<MediaItem>("media", {
					method: "POST",
					body: formData,
				});
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

	function handleCopyUrl(id: string, url: string) {
		const fullUrl = resolveMediaUrl(url);
		void navigator.clipboard.writeText(fullUrl);
		setCopiedId(id);
		showAdminToast("URL media berhasil disalin ke clipboard!", "success");
		setTimeout(() => setCopiedId(null), 2000);
	}

	return (
		<div className="space-y-6 font-sans text-slate-800">
			{/* Header Banner */}
			<section className="rounded-[1.8rem] border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-7">
				<div className="flex items-center gap-2">
					<FileImageIcon className="h-5 w-5 text-sky-700" />
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
						Modul Media
					</p>
				</div>
				<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
					Media Library & Asset Upload
				</h2>
				<p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600 sm:text-base">
					Upload dan kelola berkas gambar untuk konten berita, potensi desa,
					sejarah, dan organisasi. Gambar yang diunggah divalidasi langsung oleh
					server (Maks. {formatFileSize(MEDIA_MAX_FILE_SIZE)}).
				</p>

				{notice && (
					<div className="mt-4 flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
						<Info className="h-4 w-4 flex-shrink-0 text-sky-600" />
						<span>{notice}</span>
					</div>
				)}
			</section>

			{/* Upload Section */}
			<section className="rounded-[1.8rem] border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-7">
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
					<div>
						<h3 className="text-xl font-semibold text-slate-900">
							Unggah Gambar Baru
						</h3>
						<p className="mt-1 text-xs text-slate-500">
							Format yang didukung: JPG, PNG, WEBP, SVG • Maksimal{" "}
							{formatFileSize(MEDIA_MAX_FILE_SIZE)} per file.
						</p>
					</div>

					<label
						className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:from-sky-700 hover:to-blue-800 active:scale-95 ${
							isUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"
						}`}
					>
						{isUploading ? (
							<RefreshCw className="h-4 w-4 animate-spin" />
						) : (
							<UploadCloud className="h-4 w-4" />
						)}
						<span>{isUploading ? "Mengunggah..." : "Pilih File Gambar"}</span>
						<input
							type="file"
							accept="image/*"
							multiple
							className="hidden"
							onChange={(e) => void handleFiles(e)}
							disabled={isUploading}
						/>
					</label>
				</div>
			</section>

			{/* Media Gallery Section */}
			<section className="rounded-[1.8rem] border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-7">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
					<div className="flex items-center gap-2">
						<FileImage className="h-5 w-5 text-sky-700" />
						<h3 className="text-xl font-semibold text-slate-900">
							Daftar Media
						</h3>
						<span className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
							{filteredItems.length} File
						</span>
					</div>

					<div className="flex items-center gap-2">
						{/* Search Filter */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
							<input
								type="search"
								value={filter}
								onChange={(event) => setFilter(event.target.value)}
								placeholder="Cari nama file..."
								className="h-10 rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
							/>
						</div>

						{/* Refresh Button */}
						<button
							type="button"
							onClick={() => void fetchMedia()}
							disabled={isLoading}
							className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
						>
							<RefreshCw
								className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
							/>
							<span className="hidden sm:inline">
								{isLoading ? "Memuat..." : "Refresh"}
							</span>
						</button>
					</div>
				</div>

				{/* Grid Media Display */}
				{filteredItems.length === 0 ? (
					<div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center text-sm text-slate-500">
						<FileImageIcon className="mb-2 h-10 w-10 text-slate-300" />
						{isLoading ? (
							<p>Memuat media library...</p>
						) : filter ? (
							<p>Tidak ditemukan media dengan kata kunci &quot;{filter}&quot;.</p>
						) : (
							<p>
								Belum ada media tersimpan. Silakan unggah berkas gambar pertama
								Anda.
							</p>
						)}
					</div>
				) : (
					<div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
						{filteredItems.map((item) => (
							<article
								key={item.id}
								className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:border-sky-300 hover:shadow-md"
							>
								<div>
									{/* Image Container */}
									<div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-100">
										<Image
											src={resolveMediaUrl(item.url)}
											alt={item.fileName}
											unoptimized
											fill
											className="object-cover transition duration-300 group-hover:scale-105"
											sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
										/>
									</div>

									{/* File Info */}
									<div className="mt-3 space-y-1">
										<p
											className="line-clamp-1 text-sm font-semibold text-slate-900 group-hover:text-sky-700"
											title={item.fileName}
										>
											{item.fileName}
										</p>
										<p className="text-xs text-slate-500">
											{formatFileSize(item.sizeBytes)} •{" "}
											{new Date(item.createdAt).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "short",
												year: "numeric",
											})}
										</p>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
									<button
										type="button"
										onClick={() => handleCopyUrl(item.id, item.url)}
										className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 active:scale-95"
										title="Salin URL Gambar"
									>
										{copiedId === item.id ? (
											<Check className="h-3.5 w-3.5 text-emerald-600" />
										) : (
											<Copy className="h-3.5 w-3.5 text-slate-500" />
										)}
										<span>
											{copiedId === item.id ? "Tersalin!" : "Salin URL"}
										</span>
									</button>

									<button
										type="button"
										onClick={() => void removeItem(item.id, item.fileName)}
										className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 active:scale-95"
										title="Hapus Media"
									>
										<Trash2 className="h-3.5 w-3.5" />
										<span>Hapus</span>
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
