"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminPotensiForm, {
	type AdminPotensiFormState,
} from "@/app/components/AdminPotensiForm";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch } from "@/lib/admin-api-client";

const emptyForm: AdminPotensiFormState = {
	name: "",
	shortDesc: "",
	fullDesc: "",
	categoryId: "",
	coverImage: "",
	isHighlight: false,
};

function normalizeUrl(value: string) {
	const trimmed = value.trim();
	if (!trimmed) {
		return undefined;
	}

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

export default function AdminPotensiTambahPage() {
	const router = useRouter();
	const [formState, setFormState] = useState(emptyForm);
	const [isSaving, setIsSaving] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Validasi Sederhana Klien
		if (!formState.name.trim()) {
			showAdminToast("Nama potensi wajib diisi.", "error");
			return;
		}

		if (!formState.categoryId) {
			showAdminToast("Pilih kategori potensi terlebih dahulu.", "error");
			return;
		}

		setIsSaving(true);

		try {
			const response = await adminBeFetch("potensi/admin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formState.name.trim(),
					shortDesc: formState.shortDesc.trim(),
					fullDesc: formState.fullDesc.trim() || undefined,
					categoryId: formState.categoryId,
					coverImage: normalizeUrl(formState.coverImage),
					isHighlight: formState.isHighlight,
				}),
			});

			if (!response.ok) {
				const errorPayload = (await response.json().catch(() => null)) as {
					message?: string;
				} | null;
				throw new Error(
					errorPayload?.message || "Gagal menambah data potensi.",
				);
			}

			showAdminToast("Potensi baru berhasil ditambahkan.", "success");
			router.push("/admin/potensi");
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: "Gagal menambah potensi. Periksa format input.";
			showAdminToast(errorMsg, "error");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div className="space-y-6">
			{/* Top Header Card */}
			<section className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-gradient-to-r from-white/90 via-sky-50/50 to-white/90 p-5 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.07)] backdrop-blur-md lg:rounded-[2rem] lg:p-7">
				{/* Breadcrumb Nav */}
				<nav className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
					<Link href="/admin/potensi" className="transition hover:text-sky-700">
						Modul Potensi
					</Link>
					<span>/</span>
					<span className="text-slate-800 font-semibold">Tambah Data</span>
				</nav>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-800">
							<span className="h-2 w-2 rounded-full bg-sky-500" />
							Formulir Data Baru
						</div>
						<h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Tambah Potensi Desa
						</h2>
						<p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
							Isi informasi potensi desa secara lengkap dan fokus agar tampilan
							di halaman utama publik terlihat menarik.
						</p>
					</div>

					<Link
						href="/admin/potensi"
						className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow"
					>
						<svg
							className="h-4 w-4 text-slate-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						<span>Kembali ke Daftar</span>
					</Link>
				</div>
			</section>

			{/* Main Form Section */}
			<section className="relative">
				<AdminPotensiForm
					title="Formulir Detail Potensi"
					description="Lengkapi input di bawah ini. Tanda bintang (*) menunjukkan kolom yang wajib diisi."
					formState={formState}
					onChange={setFormState}
					onSubmit={handleSubmit}
					submitLabel={isSaving ? "Menyimpan..." : "Simpan Potensi"}
					cancelHref="/admin/potensi"
				/>
			</section>
		</div>
	);
}
