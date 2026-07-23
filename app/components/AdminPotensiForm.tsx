"use client";

import { useEffect, useState } from "react";
import {
	loadRemoteMediaItems,
	loadStoredMediaItems,
	subscribeMediaLibraryUpdates,
	type MediaItem,
} from "@/lib/media-store";

export type AdminPotensiCategory = "PERTANIAN" | "PARIWISATA";

export type AdminPotensiFormState = {
	name: string;
	shortDesc: string;
	fullDesc: string;
	category: AdminPotensiCategory;
	coverImage: string;
	isHighlight: boolean;
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
				/>
			</label>

			<label className="block">
				<span className="mb-2 block text-sm font-medium text-slate-700">
					Kategori
				</span>
				<select
					value={formState.category}
					onChange={(event) =>
						onChange({
							...formState,
							category: event.target.value as AdminPotensiCategory,
						})
					}
					className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300"
				>
					<option value="PERTANIAN">Pertanian</option>
					<option value="PARIWISATA">Pariwisata</option>
				</select>
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
					className="rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-800"
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
