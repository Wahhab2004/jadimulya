"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch } from "@/lib/admin-api-client";

// Halaman CRUD Kategori Potensi — melengkapi endpoint backend:
//   GET    /potensi/admin/kategori
//   POST   /potensi/admin/kategori
//   PATCH  /potensi/admin/kategori/:id
//   DELETE /potensi/admin/kategori/:id
//
// Sengaja dibuat satu file (tambah + edit + hapus jadi satu halaman) karena
// datanya kecil (cuma name/isPublic/sortOrder) dan supaya admin bisa lihat
// semua kategori sambil langsung mengedit/menghapus tanpa pindah halaman.

type CategoryItem = {
	id: string;
	name: string;
	isPublic: boolean;
	sortOrder: number;
};

type BackendResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

type NewCategoryForm = {
	name: string;
	isPublic: boolean;
	sortOrder: string; // simpan sebagai string di form, di-convert saat submit
};

type EditCategoryForm = {
	name: string;
	isPublic: boolean;
	sortOrder: string;
};

const emptyNewForm: NewCategoryForm = {
	name: "",
	isPublic: true,
	sortOrder: "0",
};

async function extractErrorMessage(response: Response, fallback: string) {
	try {
		const payload = (await response.json()) as { message?: string };
		if (payload?.message) {
			return payload.message;
		}
	} catch {
		// respons bukan JSON valid — pakai pesan fallback
	}
	return fallback;
}

export default function AdminPotensiKategoriPage() {
	const [categories, setCategories] = useState<CategoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [notice, setNotice] = useState("");

	const [newForm, setNewForm] = useState<NewCategoryForm>(emptyNewForm);
	const [isCreating, setIsCreating] = useState(false);

	const [editingId, setEditingId] = useState<string | null>(null);
	const [editForm, setEditForm] = useState<EditCategoryForm>({
		name: "",
		isPublic: true,
		sortOrder: "0",
	});
	const [isSavingEdit, setIsSavingEdit] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	useEffect(() => {
		void fetchCategories();
	}, []);

	async function fetchCategories() {
		setIsLoading(true);
		try {
			const response = await adminBeFetch("potensi/admin/kategori", {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error("Gagal mengambil kategori potensi");
			}

			const payload = (await response.json()) as BackendResponse<
				CategoryItem[]
			>;
			setCategories(Array.isArray(payload.data) ? payload.data : []);
		} catch {
			const message = "Tidak bisa memuat data kategori dari backend.";
			setNotice(message);
			showAdminToast(message, "error");
		} finally {
			setIsLoading(false);
		}
	}

	async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const trimmedName = newForm.name.trim();
		if (trimmedName.length < 2) {
			showAdminToast("Nama kategori minimal 2 karakter.", "error");
			return;
		}

		setIsCreating(true);
		try {
			const response = await adminBeFetch("potensi/admin/kategori", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: trimmedName,
					isPublic: newForm.isPublic,
					sortOrder: Number.parseInt(newForm.sortOrder, 10) || 0,
				}),
			});

			if (!response.ok) {
				// 409 kalau nama kategori sudah dipakai (unique constraint di backend)
				const message = await extractErrorMessage(
					response,
					"Gagal membuat kategori baru.",
				);
				throw new Error(message);
			}

			setNewForm(emptyNewForm);
			showAdminToast("Kategori potensi berhasil dibuat.", "success");
			await fetchCategories();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Gagal membuat kategori baru.";
			showAdminToast(message, "error");
		} finally {
			setIsCreating(false);
		}
	}

	function startEdit(category: CategoryItem) {
		setEditingId(category.id);
		setEditForm({
			name: category.name,
			isPublic: category.isPublic,
			sortOrder: String(category.sortOrder),
		});
	}

	function cancelEdit() {
		setEditingId(null);
	}

	async function handleUpdate(id: string) {
		const trimmedName = editForm.name.trim();
		if (trimmedName.length < 2) {
			showAdminToast("Nama kategori minimal 2 karakter.", "error");
			return;
		}

		setIsSavingEdit(true);
		try {
			const response = await adminBeFetch(`potensi/admin/kategori/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: trimmedName,
					isPublic: editForm.isPublic,
					sortOrder: Number.parseInt(editForm.sortOrder, 10) || 0,
				}),
			});

			if (!response.ok) {
				const message = await extractErrorMessage(
					response,
					"Gagal memperbarui kategori.",
				);
				throw new Error(message);
			}

			showAdminToast("Kategori potensi berhasil diperbarui.", "success");
			setEditingId(null);
			await fetchCategories();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Gagal memperbarui kategori.";
			showAdminToast(message, "error");
		} finally {
			setIsSavingEdit(false);
		}
	}

	async function handleDelete(category: CategoryItem) {
		const confirmed = window.confirm(
			`Hapus kategori "${category.name}"? Tindakan ini tidak bisa dibatalkan.`,
		);
		if (!confirmed) {
			return;
		}

		setDeletingId(category.id);
		try {
			const response = await adminBeFetch(
				`potensi/admin/kategori/${category.id}`,
				{
					method: "DELETE",
				},
			);

			if (!response.ok) {
				// Backend menolak (409) kalau kategori masih dipakai data potensi —
				// tampilkan pesan aslinya (berisi jumlah data yang masih memakai).
				const message = await extractErrorMessage(
					response,
					"Gagal menghapus kategori.",
				);
				throw new Error(message);
			}

			showAdminToast("Kategori potensi berhasil dihapus.", "success");
			await fetchCategories();
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Gagal menghapus kategori.";
			showAdminToast(message, "error");
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="space-y-4">
			<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
					Modul Potensi
				</p>
				<h2 className="mt-2 text-2xl font-semibold text-slate-900">
					Kelola Kategori Potensi
				</h2>
				<p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
					Kategori bersifat dinamis — tambah, ubah, atau sembunyikan kategori
					sendiri di sini. Kategori dengan status &quot;tersembunyi&quot; tidak
					akan muncul di dropdown filter halaman publik, tapi tetap bisa dipakai
					admin saat menambah data potensi.
				</p>
				<div className="mt-4">
					<Link
						href="/admin/potensi"
						className="text-sm font-medium text-sky-700 underline underline-offset-2 hover:text-sky-800"
					>
						&larr; Kembali ke Daftar Potensi
					</Link>
				</div>
				{notice ? (
					<div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
						{notice}
					</div>
				) : null}
			</section>

			<section className="grid gap-4 xl:grid-cols-[0.62fr_1.38fr]">
				<section className="space-y-4 rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
					<div>
						<h3 className="text-xl font-semibold text-slate-900">
							Tambah Kategori
						</h3>
						<p className="mt-1 text-sm text-slate-600">
							Kategori baru langsung bisa dipakai saat membuat/mengedit data
							potensi.
						</p>
					</div>

					<form onSubmit={handleCreate} className="space-y-4">
						<label className="block">
							<span className="mb-2 block text-sm font-medium text-slate-700">
								Nama Kategori
							</span>
							<input
								type="text"
								value={newForm.name}
								onChange={(event) =>
									setNewForm({ ...newForm, name: event.target.value })
								}
								className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300"
								placeholder="cth. Perikanan"
								required
								minLength={2}
							/>
						</label>

						<label className="block">
							<span className="mb-2 block text-sm font-medium text-slate-700">
								Urutan Tampil
							</span>
							<input
								type="number"
								value={newForm.sortOrder}
								onChange={(event) =>
									setNewForm({ ...newForm, sortOrder: event.target.value })
								}
								className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-300"
							/>
						</label>

						<label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
							<input
								type="checkbox"
								checked={newForm.isPublic}
								onChange={(event) =>
									setNewForm({ ...newForm, isPublic: event.target.checked })
								}
								className="h-4 w-4 rounded border-slate-300 text-sky-700"
							/>
							Tampilkan di halaman publik
						</label>

						<button
							type="submit"
							disabled={isCreating}
							className="w-full rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isCreating ? "Menyimpan..." : "Tambah Kategori"}
						</button>
					</form>
				</section>

				<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
					<div className="flex items-center justify-between gap-3">
						<div>
							<h3 className="text-xl font-semibold text-slate-900">
								Daftar Kategori
							</h3>
							<p className="mt-1 text-sm text-slate-600">
								{categories.length} kategori terdaftar.
							</p>
						</div>
					</div>

					<div className="mt-6 space-y-3">
						{isLoading ? (
							<article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
								Memuat data kategori...
							</article>
						) : null}
						{!isLoading && categories.length === 0 ? (
							<article className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
								Belum ada kategori. Tambahkan lewat form di sebelah kiri.
							</article>
						) : null}

						{categories.map((category) => {
							const isEditing = editingId === category.id;

							if (isEditing) {
								return (
									<article
										key={category.id}
										className="space-y-3 rounded-3xl border border-sky-200 bg-sky-50/60 p-5"
									>
										<label className="block">
											<span className="mb-1 block text-xs font-medium text-slate-700">
												Nama Kategori
											</span>
											<input
												type="text"
												value={editForm.name}
												onChange={(event) =>
													setEditForm({ ...editForm, name: event.target.value })
												}
												className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-300"
												minLength={2}
												required
											/>
										</label>

										<div className="flex flex-wrap items-end gap-3">
											<label className="block">
												<span className="mb-1 block text-xs font-medium text-slate-700">
													Urutan Tampil
												</span>
												<input
													type="number"
													value={editForm.sortOrder}
													onChange={(event) =>
														setEditForm({
															...editForm,
															sortOrder: event.target.value,
														})
													}
													className="h-10 w-28 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-sky-300"
												/>
											</label>

											<label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700">
												<input
													type="checkbox"
													checked={editForm.isPublic}
													onChange={(event) =>
														setEditForm({
															...editForm,
															isPublic: event.target.checked,
														})
													}
													className="h-4 w-4 rounded border-slate-300 text-sky-700"
												/>
												Publik
											</label>
										</div>

										<div className="flex flex-wrap gap-2 pt-1">
											<button
												type="button"
												onClick={() => void handleUpdate(category.id)}
												disabled={isSavingEdit}
												className="rounded-full bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
											>
												{isSavingEdit ? "Menyimpan..." : "Simpan"}
											</button>
											<button
												type="button"
												onClick={cancelEdit}
												disabled={isSavingEdit}
												className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
											>
												Batal
											</button>
										</div>
									</article>
								);
							}

							return (
								<article
									key={category.id}
									className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5"
								>
									<div>
										<div className="flex items-center gap-2">
											<h4 className="text-lg font-semibold text-slate-900">
												{category.name}
											</h4>
											<span
												className={`rounded-full px-3 py-1 text-xs font-medium ${
													category.isPublic
														? "bg-emerald-50 text-emerald-700"
														: "bg-slate-200 text-slate-600"
												}`}
											>
												{category.isPublic ? "Publik" : "Tersembunyi"}
											</span>
										</div>
										<p className="mt-1 text-xs text-slate-500">
											Urutan tampil: {category.sortOrder}
										</p>
									</div>

									<div className="flex gap-2">
										<button
											type="button"
											onClick={() => startEdit(category)}
											className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
										>
											Edit
										</button>
										<button
											type="button"
											onClick={() => void handleDelete(category)}
											disabled={deletingId === category.id}
											className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
										>
											{deletingId === category.id ? "Menghapus..." : "Hapus"}
										</button>
									</div>
								</article>
							);
						})}
					</div>
				</section>
			</section>
		</div>
	);
}
