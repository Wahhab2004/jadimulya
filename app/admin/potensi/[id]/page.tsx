"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminPotensiForm, {
	type AdminPotensiFormState,
} from "@/app/components/AdminPotensiForm";
import { showAdminToast } from "@/lib/admin-toast";
import { adminBeFetch } from "@/lib/admin-api-client";

// BARU — category enum tetap diganti categoryId (uuid). Response detail
// (GET /potensi/:id) tetap meng-include object `category` penuh, tapi model
// Potential juga punya kolom `categoryId` langsung — dipakai di sini supaya
// tidak perlu ambil category.id secara tidak langsung.
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
	const [formState, setFormState] = useState(emptyForm);
	const [isSaving, setIsSaving] = useState(false);

	const loadDetail = useCallback(async () => {
		try {
			const response = await adminBeFetch(`potensi/${params.id}`, {
				method: "GET",
			});

			if (!response.ok) {
				router.push("/admin/potensi");
				return;
			}

			const payload = (await response.json()) as {
				success?: boolean;
				data?: BackendPotential;
			};

			const data = payload?.data;
			if (!data) {
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
		} catch {
			router.push("/admin/potensi");
		}
	}, [params.id, router]);

	useEffect(() => {
		void loadDetail();
	}, [loadDetail]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

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
				throw new Error("Gagal memperbarui potensi");
			}

			showAdminToast("Potensi berhasil diperbarui.", "success");
			router.push("/admin/potensi");
		} catch {
			showAdminToast("Gagal memperbarui potensi.", "error");
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div className="space-y-4">
			<section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
				<p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
					Potensi Desa
				</p>
				<h2 className="mt-2 text-2xl font-semibold text-slate-900">
					Edit Potensi
				</h2>
				<p className="mt-2 text-sm leading-6 text-slate-600">
					Ubah data potensi yang dipilih tanpa bercampur dengan daftar item
					lain.
				</p>
			</section>

			<AdminPotensiForm
				title="Form Edit Potensi"
				description="Perbarui data agar halaman publik selalu sesuai kondisi terbaru."
				formState={formState}
				onChange={setFormState}
				onSubmit={handleSubmit}
				submitLabel={isSaving ? "Menyimpan..." : "Simpan Perubahan"}
				cancelHref="/admin/potensi"
			/>
		</div>
	);
}
