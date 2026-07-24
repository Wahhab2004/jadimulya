// BARU — kategori sekarang nama dinamis dari tabel PotentialCategory di
// backend (bukan union tetap 'Pertanian' | 'Wisata' lagi), supaya kategori
// baru yang dibuat admin lewat CRUD kategori otomatis ikut tampil di sini
// tanpa perlu perubahan kode.
export type PotensiCategory = string;

export type PotensiItem = {
	id: string;
	title: string;
	description: string;
	// Deskripsi lengkap & galeri foto — opsional karena data lokal (dummy)
	// tidak selalu punya ini, tapi data dari backend biasanya punya.
	fullDesc?: string;
	images?: string[];
	category: PotensiCategory;
	tag: string;
	imageUrl: string;
};

// Palet warna badge kategori — dipilih otomatis per nama kategori (hash
// string) supaya warnanya tetap konsisten untuk kategori yang sama di setiap
// render, tanpa perlu daftar warna per-kategori yang di-hardcode.
const CATEGORY_BADGE_PALETTE = [
	"bg-sky-100 text-sky-800 border-sky-200",
	"bg-blue-100 text-blue-800 border-blue-200",
	"bg-emerald-100 text-emerald-800 border-emerald-200",
	"bg-amber-100 text-amber-800 border-amber-200",
	"bg-rose-100 text-rose-800 border-rose-200",
	"bg-violet-100 text-violet-800 border-violet-200",
];

function hashCategoryName(value: string): number {
	let hash = 0;
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

export function getCategoryBadgeStyle(categoryName: string): string {
	if (!categoryName) {
		return CATEGORY_BADGE_PALETTE[0];
	}
	return CATEGORY_BADGE_PALETTE[
		hashCategoryName(categoryName) % CATEGORY_BADGE_PALETTE.length
	];
}

export const POTENSI_STORAGE_KEY = "jadimulya_potensi_items";

export const initialPotensiItems: PotensiItem[] = [
	{
		id: "p-1",
		title: "Kelompok Tani Sawah Lembur",
		description:
			"Kelompok tani desa yang mengelola lahan padi secara gotong royong dengan fokus peningkatan kualitas panen dan distribusi lokal.",
		category: "Pertanian",
		tag: "Highlight",
		imageUrl: "/images/potensi-kopi.jpg",
	},
	{
		id: "p-2",
		title: "Curug Jadimulya Permai",
		description:
			"Destinasi alam dengan udara sejuk, aliran air jernih, dan jalur trekking ringan yang cocok untuk wisata keluarga dan komunitas.",
		category: "Wisata",
		tag: "Highlight",
		imageUrl: "/images/potensi-wisata.jpg",
	},
	{
		id: "p-3",
		title: "Kampung Domba Jadimulya",
		description:
			"Wisata edukasi peternakan domba dengan aktivitas interaktif untuk keluarga, sekolah, dan komunitas.",
		category: "Wisata",
		tag: "Prioritas",
		imageUrl: "/images/potensi-wisata.jpg",
	},
	{
		id: "p-4",
		title: "Sentra Padi Organik",
		description:
			"Komoditas pertanian andalan dengan praktik budidaya berkelanjutan dan pendampingan kelompok tani.",
		category: "Pertanian",
		tag: "Unggulan",
		imageUrl: "/images/potensi-kopi.jpg",
	},
];

function isPotensiCategory(value: unknown): value is PotensiCategory {
	return typeof value === "string" && value.trim().length > 0;
}

function sanitizeItem(item: unknown): PotensiItem | null {
	if (!item || typeof item !== "object") {
		return null;
	}

	const candidate = item as Record<string, unknown>;
	if (!isPotensiCategory(candidate.category)) {
		return null;
	}

	const id =
		typeof candidate.id === "string" && candidate.id.trim()
			? candidate.id
			: `p-${Date.now()}`;
	const title =
		typeof candidate.title === "string" && candidate.title.trim()
			? candidate.title
			: "Potensi Desa";
	const description =
		typeof candidate.description === "string" ? candidate.description : "";
	const fullDesc =
		typeof candidate.fullDesc === "string" && candidate.fullDesc.trim()
			? candidate.fullDesc
			: undefined;
	const images = Array.isArray(candidate.images)
		? candidate.images.filter(
				(url): url is string =>
					typeof url === "string" && url.trim().length > 0,
			)
		: undefined;
	const tag =
		typeof candidate.tag === "string" && candidate.tag.trim()
			? candidate.tag
			: "Highlight";
	const imageUrl =
		typeof candidate.imageUrl === "string" && candidate.imageUrl.trim()
			? candidate.imageUrl
			: "/images/potensi-wisata.jpg";

	return {
		id,
		title,
		description,
		fullDesc,
		images,
		category: candidate.category,
		tag,
		imageUrl,
	};
}

export function loadStoredPotensiItems() {
	if (typeof window === "undefined") {
		return initialPotensiItems;
	}

	const rawValue = window.localStorage.getItem(POTENSI_STORAGE_KEY);

	if (!rawValue) {
		return initialPotensiItems;
	}

	try {
		const parsed = JSON.parse(rawValue) as unknown;
		if (!Array.isArray(parsed)) {
			return initialPotensiItems;
		}

		const nextItems = parsed
			.map((item) => sanitizeItem(item))
			.filter((item): item is PotensiItem => item !== null);

		return nextItems.length > 0 ? nextItems : initialPotensiItems;
	} catch {
		return initialPotensiItems;
	}
}

export function savePotensiItems(items: PotensiItem[]) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(POTENSI_STORAGE_KEY, JSON.stringify(items));
}
