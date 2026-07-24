"use client";

import { useEffect, useState } from "react";
import {
	loadRemoteMediaItems,
	loadStoredMediaItems,
	subscribeMediaLibraryUpdates,
	type MediaItem,
} from "@/lib/media-store";
import { adminBeFetch } from "@/lib/admin-api-client";

// BARU — kategori potensi sekarang data dinamis (tabel PotentialCategory di
// backend), bukan enum tetap PERTANIAN/PARIWISATA lagi. Form ini sekarang
// menyimpan `categoryId` (uuid) dan mengambil daftar kategori dari endpoint
// admin: GET /potensi/admin/kategori.

export type AdminPotensiCategoryOption = {
	id: string;
	name: string;
	isPublic: boolean;
	sortOrder: number;
};

export type AdminPotensiFormState = {
	name: string;
	shortDesc: string;
	fullDesc: string;
	categoryId: string;
	coverImage: string;
	isHighlight: boolean;
};

type BackendResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

type AdminPotensiFormProps = {
	title: string;
	description: string;
	formState: AdminPotensiFormState;
	onChange: (nextState: AdminPotensiFormState) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	submitLabel: string;
	cancelHref: string;
};

export default function AdminPotensiForm({
	title,
	description,
	formState,
	onChange,
	onSubmit,
	submitLabel,
	cancelHref,
}: AdminPotensiFormProps) {
	const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
	const [categories, setCategories] = useState<AdminPotensiCategoryOption[]>(
		[],
	);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);
	const [categoryError, setCategoryError] = useState("");

	useEffect(() => {
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

	useEffect(() => {
		let isMounted = true;

		const loadCategories = async () => {
			setIsLoadingCategories(true);
			setCategoryError("");

			try {
				// Admin butuh semua kategori (termasuk yang isPublic: false),
				// jadi pakai endpoint admin, bukan endpoint publik /potensi/kategori.
				const response = await adminBeFetch("potensi/admin/kategori", {
					method: "GET",
				});

				if (!response.ok) {
					throw new Error("Gagal mengambil kategori potensi");
				}

				const payload = (await response.json()) as BackendResponse<
					AdminPotensiCategoryOption[]
				>;

				if (isMounted) {
					setCategories(Array.isArray(payload.data) ? payload.data : []);
				}
			} catch {
				if (isMounted) {
					setCategoryError("Tidak bisa memuat daftar kategori dari backend.");
				}
			} finally {
				if (isMounted) {
					setIsLoadingCategories(false);
				}
			}
		};

		void loadCategories();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<form
			onSubmit={onSubmit}
			className="space-y-4 rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6"
		>
			<div>
				<h3 className="text-xl font-semibold text-slate-900">{title}</h3>
				<p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
			</div>

			<label className="block">
				<span className="mb-2 block text-sm font-medium text-slate-700">
					Nama Potensi
				</span>
				<input
					type="text"
					value={formState.name}
					onChange={(event) =>
						onChange({ ...formState, name: event.target.value })
					}
					className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300"
					required
					minLength={3}
				/>
			</label>

			<label className="block">
				<span className="mb-2 block text-sm font-medium text-slate-700">
					Kategori
				</span>
				<select
					value={formState.categoryId}
					onChange={(event) =>
						onChange({
							...formState,
							categoryId: event.target.value,
						})
					}
					className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300"
					required
					disabled={isLoadingCategories || categories.length === 0}
				>
					<option value="" disabled>
						{isLoadingCategories ? "Memuat kategori..." : "Pilih kategori"}
					</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
							{category.isPublic ? "" : " (tersembunyi)"}
						</option>
					))}
				</select>
				{categoryError ? (
					<span className="mt-1 block text-xs text-rose-600">
						{categoryError}
					</span>
				) : null}
				{!isLoadingCategories && !categoryError && categories.length === 0 ? (
					<span className="mt-1 block text-xs text-amber-600">
						Belum ada kategori. Tambahkan kategori potensi dulu sebelum membuat
						data potensi.
					</span>
				) : null}
			</label>

			<label className="block">
				<span className="mb-2 block text-sm font-medium text-slate-700">
					Deskripsi Singkat
				</span>
				<textarea
					value={formState.shortDesc}
					onChange={(event) =>
						onChange({ ...formState, shortDesc: event.target.value })
					}
					className="min-h-24 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300"
					required
					minLength={10}
				/>
			</label>

			<label className="block">
				<span className="mb-2 block text-sm font-medium text-slate-700">
					URL Gambar
				</span>
				<input
					type="text"
					value={formState.coverImage}
					onChange={(event) =>
						onChange({ ...formState, coverImage: event.target.value })
					}
					className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300"
				/>
			</label>

			<label className="block">
				<span className="mb-2 block text-sm font-medium text-slate-700">
					Pilih dari Media Library
				</span>
				<select
					value=""
					onChange={(event) => {
						if (!event.target.value) return;
						onChange({ ...formState, coverImage: event.target.value });
					}}
					className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300"
				>
					<option value="">Pilih gambar tersimpan</option>
					{mediaItems.map((item) => (
						<option key={item.id} value={item.url}>
							{item.name}
						</option>
					))}
				</select>
			</label>

			<label className="block">
				<span className="mb-2 block text-sm font-medium text-slate-700">
					Deskripsi Lengkap (opsional)
				</span>
				<textarea
					value={formState.fullDesc}
					onChange={(event) =>
						onChange({ ...formState, fullDesc: event.target.value })
					}
					className="min-h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300"
				/>
			</label>

			<label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
				<input
					type="checkbox"
					checked={formState.isHighlight}
					onChange={(event) =>
						onChange({ ...formState, isHighlight: event.target.checked })
					}
					className="h-4 w-4 rounded border-slate-300 text-sky-700"
				/>
				Tampilkan sebagai highlight di halaman utama
			</label>

			<div className="flex flex-wrap gap-2">
				<button
					type="submit"
					className="rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={!formState.categoryId}
				>
					{submitLabel}
				</button>
				<a
					href={cancelHref}
					className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
				>
					Kembali
				</a>
			</div>
		</form>
	);
}
