"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminPotensiForm, {
	type AdminPotensiFormState,
} from "@/app/components/AdminPotensiForm";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch } from "@/lib/admin-api-client";

type BackendCategory = {
	id: string;
	name: string;
	isPublic: boolean;
	sortOrder: number;
};

type BackendPotential = {
	id: string;
	name: string;
	shortDesc: string;
	fullDesc: string | null;
	categoryId: string;
	category: BackendCategory;
	coverImage: string | null;
	isHighlight: boolean;
};

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

export default function AdminPotensiEditPage() {
	const params = useParams<{ id: string }>();
	const router = useRouter();

	const [formState, setFormState] = useState<AdminPotensiFormState>(emptyForm);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [initialName, setInitialName] = useState<string>("");

	const loadDetail = useCallback(async () => {
		if (!params?.id) return;

		setIsLoading(true);
		try {
			const response = await adminBeFetch(`potensi/${params.id}`, {
				method: "GET",
			});

			if (!response.ok) {
				showAdminToast("Data potensi tidak ditemukan.", "error");
				router.push("/admin/potensi");
				return;
			}

			const payload = (await response.json()) as {
				success?: boolean;
				data?: BackendPotential;
			};

			const data = payload?.data;
			if (!data) {
				showAdminToast("Data potensi tidak ditemukan.", "error");
				router.push("/admin/potensi");
				return;
			}

			setFormState({
				name: data.name,
				shortDesc: data.shortDesc,
				fullDesc: data.fullDesc ?? "",
				categoryId: data.categoryId ?? data.category?.id ?? "",
				coverImage: data.coverImage ?? "",
				isHighlight: data.isHighlight,
			});
			setInitialName(data.name);
		} catch {
			showAdminToast("Gagal mengambil detail potensi.", "error");
			router.push("/admin/potensi");
		} finally {
			setIsLoading(false);
		}
	}, [params?.id, router]);

	useEffect(() => {
		void loadDetail();
	}, [loadDetail]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

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
			const response = await adminBeFetch(`potensi/admin/${params.id}`, {
				method: "PATCH",
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
				throw new Error(errorPayload?.message || "Gagal memperbarui potensi.");
			}

			showAdminToast("Potensi berhasil diperbarui.", "success");
			router.push("/admin/potensi");
		} catch (err) {
			const errorMsg =
				err instanceof Error
					? err.message
					: "Gagal memperbarui potensi. Periksa format input.";
			showAdminToast(errorMsg, "error");
		} finally {
			setIsSaving(false);
		}
	}

	// State Pemuatan Data (Skeleton Loader)
	if (isLoading) {
		return (
			<div className="space-y-6 animate-pulse">
				<div className="h-32 rounded-[1.6rem] bg-slate-200/80 lg:rounded-[2rem]" />
				<div className="h-96 rounded-[1.6rem] bg-slate-200/80 lg:rounded-[2rem]" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Top Header Card */}
			<section className="relative overflow-hidden rounded-[1.6rem] border border-white/80 bg-gradient-to-r from-white/90 via-amber-50/40 to-white/90 p-5 shadow-[0_20px_40px_-15px_rgba(15,23,42,0.07)] backdrop-blur-md lg:rounded-[2rem] lg:p-7">
				{/* Breadcrumb Nav */}
				<nav className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500">
					<Link href="/admin/potensi" className="transition hover:text-sky-700">
						Modul Potensi
					</Link>
					<span>/</span>
					<span className="text-slate-800 font-semibold">Edit Data</span>
				</nav>

				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
							<span className="h-2 w-2 rounded-full bg-amber-500" />
							Mode Sunting
						</div>
						<h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
							Edit: {initialName || "Potensi Desa"}
						</h2>
						<p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
							Perbarui informasi potensi desa ini untuk menjaga ketersediaan
							data publik tetap mutakhir.
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

			{/* Form Section */}
			<section className="relative">
				<AdminPotensiForm
					title="Formulir Sunting Potensi"
					description="Ubah data sesuai kebutuhan lalu tekan tombol Simpan Perubahan."
					formState={formState}
					onChange={setFormState}
					onSubmit={handleSubmit}
					submitLabel={isSaving ? "Menyimpan..." : "Simpan Perubahan"}
					cancelHref="/admin/potensi"
				/>
			</section>
		</div>
	);
}
