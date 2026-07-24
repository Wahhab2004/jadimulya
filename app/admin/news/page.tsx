"use client";

import React, { useEffect, useState } from "react";
import {
	Newspaper,
	Plus,
	Pencil,
	Trash2,
	Image as ImageIcon,
	Calendar,
	Tag,
	FileText,
	CheckCircle2,
	XCircle,
	RefreshCw,
	FolderOpen,
	RotateCcw,
	Globe,
	Sparkles,
} from "lucide-react";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch } from "@/lib/admin-api-client";
import {
	loadRemoteMediaItems,
	loadStoredMediaItems,
	subscribeMediaLibraryUpdates,
	type MediaItem,
} from "@/lib/media-store";

// --- Types ---
type NewsCategory =
	| "PEMBANGUNAN"
	| "KESEHATAN"
	| "PERTANIAN"
	| "WISATA"
	| "LAINNYA";

type NewsItem = {
	id: string;
	title: string;
	slug: string;
	category: NewsCategory;
	excerpt: string | null;
	content: string;
	coverImage: string | null;
	isPublished: boolean;
	publishedAt: string;
};

type BackendResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

type NewsFormState = {
	title: string;
	category: NewsCategory;
	excerpt: string;
	content: string;
	coverImage: string;
	isPublished: boolean;
	publishedAt: string;
};

// --- Constants & Helpers ---
const emptyForm: NewsFormState = {
	title: "",
	category: "PEMBANGUNAN",
	excerpt: "",
	content: "",
	coverImage: "",
	isPublished: true,
	publishedAt: "",
};

const categoryLabel: Record<NewsCategory, string> = {
	PEMBANGUNAN: "Pembangunan",
	KESEHATAN: "Kesehatan",
	PERTANIAN: "Pertanian",
	WISATA: "Wisata",
	LAINNYA: "Lainnya",
};

const INPUT_CLS =
	"w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100";
const LABEL_CLS =
	"flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5";

function normalizeUrl(value: string) {
	const trimmed = value.trim();
	if (!trimmed) return undefined;

	if (trimmed.startsWith("/")) {
		if (typeof window !== "undefined") {
			return new URL(trimmed, window.location.origin).toString();
		}
		return undefined;
	}

	try {
		return new URL(trimmed).toString();
	} catch {
		return undefined;
	}
}

function toDateInputValue(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return "";
	}
	return date.toISOString().slice(0, 10);
}

// --- Main Component ---
export default function AdminNewsPage() {
	const [items, setItems] = useState<NewsItem[]>([]);
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
	const [form, setForm] = useState<NewsFormState>(emptyForm);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		void loadNews();

		let isMounted = true;

		const syncMediaItems = async () => {
			const initialItems = loadStoredMediaItems();
			if (isMounted) {
				setMediaItems(initialItems);
			}

			const remoteItems = await loadRemoteMediaItems();
			if (isMounted) {
				setMediaItems(remoteItems);
			}
		};

		void syncMediaItems();
		const unsubscribe = subscribeMediaLibraryUpdates(() => {
			setMediaItems(loadStoredMediaItems());
		});

		return () => {
			isMounted = false;
			unsubscribe();
		};
	}, []);

	async function loadNews() {
		setIsLoading(true);
		try {
			const response = await adminBeFetch("news/admin/all", {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error("Gagal mengambil berita");
			}

			const payload = (await response.json()) as BackendResponse<NewsItem[]>;
			setItems(Array.isArray(payload.data) ? payload.data : []);
		} catch {
			showAdminToast("Tidak bisa memuat data berita dari backend.", "error");
		} finally {
			setIsLoading(false);
		}
	}

	function startEdit(item: NewsItem) {
		setEditingId(item.id);
		setForm({
			title: item.title,
			category: item.category,
			excerpt: item.excerpt ?? "",
			content: item.content,
			coverImage: item.coverImage ?? "",
			isPublished: item.isPublished,
			publishedAt: toDateInputValue(item.publishedAt),
		});
	}

	function resetForm() {
		setEditingId(null);
		setForm(emptyForm);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (form.title.trim().length < 5) {
			showAdminToast("Judul minimal 5 karakter.", "info");
			return;
		}

		if (form.content.trim().length < 20) {
			showAdminToast("Konten minimal 20 karakter.", "info");
			return;
		}

		if (!form.coverImage.trim()) {
			showAdminToast("Cover berita wajib diisi.", "info");
			return;
		}

		const normalizedCoverImage = normalizeUrl(form.coverImage);
		if (!normalizedCoverImage) {
			showAdminToast("URL cover berita tidak valid.", "info");
			return;
		}

		setIsSaving(true);
		const path = editingId ? `news/admin/${editingId}` : "news/admin";
		const method = editingId ? "PATCH" : "POST";

		try {
			const response = await adminBeFetch(path, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: form.title.trim(),
					category: form.category,
					excerpt: form.excerpt.trim() || undefined,
					content: form.content.trim(),
					coverImage: normalizedCoverImage,
					isPublished: form.isPublished,
					publishedAt: form.publishedAt
						? new Date(form.publishedAt).toISOString()
						: undefined,
				}),
			});

			if (!response.ok) {
				throw new Error("Gagal menyimpan berita");
			}

			await loadNews();
			resetForm();
			showAdminToast(
				editingId
					? "Berita berhasil diperbarui."
					: "Berita berhasil ditambahkan.",
				"success",
			);
		} catch {
			showAdminToast("Gagal menyimpan berita. Periksa format input.", "error");
		} finally {
			setIsSaving(false);
		}
	}

	async function removeNews(id: string) {
		const confirmed = window.confirm(
			"Hapus berita ini? Tindakan ini tidak bisa dibatalkan.",
		);
		if (!confirmed) {
			return;
		}

		try {
			const response = await adminBeFetch(`news/admin/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("Gagal menghapus berita");
			}

			await loadNews();
			if (editingId === id) {
				resetForm();
			}
			showAdminToast("Berita berhasil dihapus.", "success");
		} catch {
			showAdminToast("Gagal menghapus berita.", "error");
		}
	}

	return (
		<div className="space-y-6 font-sans text-slate-800">
			{/* Header Module */}
			<section className="rounded-[1.8rem] border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-7">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<div>
						<div className="flex items-center gap-2">
							<Newspaper className="h-5 w-5 text-sky-700" />
							<p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
								Modul Berita
							</p>
						</div>
						<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
							Kelola Berita Desa
						</h2>
						<p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
							Modul ini terhubung langsung ke backend untuk CRUD berita kategori
							Pembangunan, Kesehatan, Pertanian, Wisata, dan Lainnya.
						</p>
					</div>
					<button
						type="button"
						onClick={() => void loadNews()}
						disabled={isLoading}
						className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
					>
						<RefreshCw
							className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
						/>
						{isLoading ? "Memuat..." : "Refresh Data"}
					</button>
				</div>
			</section>

			{/* Main Content Layout */}
			<section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
				{/* Form Section */}
				<form
					onSubmit={(e) => void handleSubmit(e)}
					className="rounded-[1.8rem] border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-7"
				>
					<div className="flex items-center justify-between border-b border-slate-100 pb-4">
						<div className="flex items-center gap-2">
							{editingId ? (
								<Pencil className="h-5 w-5 text-amber-600" />
							) : (
								<Plus className="h-5 w-5 text-sky-600" />
							)}
							<h3 className="text-xl font-semibold text-slate-900">
								{editingId ? "Edit Berita" : "Tambah Berita"}
							</h3>
						</div>
						{editingId && (
							<span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
								Mode Edit
							</span>
						)}
					</div>

					<div className="mt-5 space-y-4">
						{/* Title */}
						<div>
							<label className={LABEL_CLS}>
								<FileText className="h-3.5 w-3.5 text-slate-500" /> Judul Berita
								*
							</label>
							<input
								type="text"
								value={form.title}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										title: event.target.value,
									}))
								}
								placeholder="Masukkan judul berita yang informatif"
								className={INPUT_CLS}
								required
							/>
						</div>

						{/* Category & Date Grid */}
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<label className={LABEL_CLS}>
									<Tag className="h-3.5 w-3.5 text-slate-500" /> Kategori
								</label>
								<select
									value={form.category}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											category: event.target.value as NewsCategory,
										}))
									}
									className={INPUT_CLS}
								>
									{(Object.keys(categoryLabel) as NewsCategory[]).map(
										(category) => (
											<option key={category} value={category}>
												{categoryLabel[category]}
											</option>
										),
									)}
								</select>
							</div>

							<div>
								<label className={LABEL_CLS}>
									<Calendar className="h-3.5 w-3.5 text-slate-500" /> Tanggal
									Terbit
								</label>
								<input
									type="date"
									value={form.publishedAt}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											publishedAt: event.target.value,
										}))
									}
									className={INPUT_CLS}
								/>
							</div>
						</div>

						{/* Cover Image Input & Selector */}
						<div>
							<label className={LABEL_CLS}>
								<ImageIcon className="h-3.5 w-3.5 text-slate-500" /> Cover Image
								URL *
							</label>
							<div className="space-y-2">
								<input
									type="text"
									value={form.coverImage}
									onChange={(event) =>
										setForm((current) => ({
											...current,
											coverImage: event.target.value,
										}))
									}
									placeholder="https://domain.com/gambar.jpg"
									className={INPUT_CLS}
									required
								/>

								<div className="relative">
									<FolderOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
									<select
										value=""
										onChange={(event) => {
											if (!event.target.value) return;
											setForm((current) => ({
												...current,
												coverImage: event.target.value,
											}));
										}}
										className={`${INPUT_CLS} pl-9 text-slate-600`}
									>
										<option value="">Pilih cover dari media library...</option>
										{mediaItems.map((item) => (
											<option key={item.id} value={item.url}>
												{item.name}
											</option>
										))}
									</select>
								</div>
							</div>

							{/* Preview Cover Image */}
							{form.coverImage.trim() && (
								<div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-1">
									<p className="px-2 py-1 text-[11px] font-medium text-slate-500">
										Preview Cover:
									</p>
									<img
										src={form.coverImage}
										alt="Preview"
										className="h-36 w-full rounded-lg object-cover"
										onError={(e) => {
											(e.target as HTMLElement).style.display = "none";
										}}
									/>
								</div>
							)}
						</div>

						{/* Excerpt */}
						<div>
							<label className={LABEL_CLS}>
								<Sparkles className="h-3.5 w-3.5 text-slate-500" /> Ringkasan
								(Excerpt)
							</label>
							<textarea
								value={form.excerpt}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										excerpt: event.target.value,
									}))
								}
								placeholder="Ringkasan singkat berita untuk kartu/situs depan (opsional)"
								className={`${INPUT_CLS} min-h-[70px] resize-y`}
							/>
						</div>

						{/* Content */}
						<div>
							<label className={LABEL_CLS}>
								<FileText className="h-3.5 w-3.5 text-slate-500" /> Konten
								Lengkap *
							</label>
							<textarea
								value={form.content}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										content: event.target.value,
									}))
								}
								placeholder="Tuliskan isi konten berita secara lengkap di sini..."
								className={`${INPUT_CLS} min-h-[160px] resize-y`}
								required
							/>
						</div>

						{/* Publish Status Checkbox */}
						<label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
							<input
								type="checkbox"
								checked={form.isPublished}
								onChange={(event) =>
									setForm((current) => ({
										...current,
										isPublished: event.target.checked,
									}))
								}
								className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
							/>
							<span className="flex items-center gap-2">
								{form.isPublished ? (
									<Globe className="h-4 w-4 text-emerald-600" />
								) : (
									<XCircle className="h-4 w-4 text-slate-400" />
								)}
								Langsung terbitkan berita
							</span>
						</label>
					</div>

					{/* Submit & Reset Buttons */}
					<div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
						<button
							type="submit"
							disabled={isSaving}
							className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-sky-800 active:scale-95 disabled:opacity-50"
						>
							{isSaving ? (
								<RefreshCw className="h-4 w-4 animate-spin" />
							) : editingId ? (
								<Pencil className="h-4 w-4" />
							) : (
								<Plus className="h-4 w-4" />
							)}
							{isSaving
								? "Menyimpan..."
								: editingId
									? "Simpan Perubahan"
									: "Tambah Berita"}
						</button>

						{editingId && (
							<button
								type="button"
								onClick={resetForm}
								className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-95"
							>
								<RotateCcw className="h-4 w-4 text-slate-500" />
								Batal
							</button>
						)}
					</div>
				</form>

				{/* List Section */}
				<section className="flex flex-col rounded-[1.8rem] border border-white/80 bg-white/90 p-6 shadow-sm backdrop-blur sm:p-7">
					<div className="flex items-center justify-between border-b border-slate-100 pb-4">
						<div className="flex items-center gap-2">
							<Newspaper className="h-5 w-5 text-sky-700" />
							<h3 className="text-xl font-semibold text-slate-900">
								Daftar Berita
							</h3>
						</div>
						<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
							Total: {items.length}
						</span>
					</div>

					<div className="mt-5 space-y-3.5">
						{isLoading && (
							<div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-500">
								<RefreshCw className="h-4 w-4 animate-spin text-sky-600" />
								Memuat data berita...
							</div>
						)}

						{!isLoading && items.length === 0 && (
							<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
								<Newspaper className="mx-auto mb-2 h-8 w-8 text-slate-300" />
								Belum ada berita tersimpan. Gunakan formulir di samping untuk
								menambah berita baru.
							</div>
						)}

						{!isLoading &&
							items.map((item) => (
								<article
									key={item.id}
									className={`group rounded-2xl border transition ${
										editingId === item.id
											? "border-sky-300 bg-sky-50/50"
											: "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white"
									} p-4 shadow-sm`}
								>
									<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
										<div className="flex items-start gap-3">
											{item.coverImage ? (
												<img
													src={item.coverImage}
													alt={item.title}
													className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
													onError={(e) => {
														(e.target as HTMLElement).style.display = "none";
													}}
												/>
											) : (
												<div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-400">
													<ImageIcon className="h-6 w-6" />
												</div>
											)}

											<div className="space-y-1">
												<div className="flex flex-wrap items-center gap-2">
													<span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-sky-700">
														<Tag className="h-3 w-3" />
														{categoryLabel[item.category] ?? item.category}
													</span>
													<span>•</span>
													<span
														className={`inline-flex items-center gap-1 text-xs font-semibold ${
															item.isPublished
																? "text-emerald-700"
																: "text-amber-700"
														}`}
													>
														{item.isPublished ? (
															<CheckCircle2 className="h-3.5 w-3.5" />
														) : (
															<XCircle className="h-3.5 w-3.5" />
														)}
														{item.isPublished ? "Published" : "Draft"}
													</span>
												</div>

												<h4 className="font-semibold leading-snug text-slate-900 group-hover:text-sky-700">
													{item.title}
												</h4>

												<p className="text-xs text-slate-500">/{item.slug}</p>

												<div className="flex items-center gap-1 text-xs text-slate-400 pt-1">
													<Calendar className="h-3 w-3" />
													{item.publishedAt
														? new Date(item.publishedAt).toLocaleDateString(
																"id-ID",
																{
																	day: "numeric",
																	month: "short",
																	year: "numeric",
																},
															)
														: "Tanggal tidak diset"}
												</div>
											</div>
										</div>

										<div className="flex items-center gap-2 self-end sm:self-start">
											<button
												type="button"
												onClick={() => startEdit(item)}
												className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
											>
												<Pencil className="h-3.5 w-3.5 text-slate-500" />
												Edit
											</button>
											<button
												type="button"
												onClick={() => void removeNews(item.id)}
												className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
											>
												<Trash2 className="h-3.5 w-3.5" />
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
