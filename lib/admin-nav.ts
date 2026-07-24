export type AdminNavItem = {
	label: string;
	href: string;
	description?: string;
	shortLabel?: string;
	icon:
		| "dashboard"
		| "organisasi"
		| "potensi"
		| "sejarah"
		| "demografi"
		| "news"
		| "media"
		| "statistik";
	phase?: "MVP" | "Next";
	enabled?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
	{
		label: "Dashboard",
		href: "/admin",
		description: "Ringkasan aktivitas dan modul utama CMS.",
		shortLabel: "Dashboard",
		icon: "dashboard",
		phase: "MVP",
		enabled: true,
	},
	{
		label: "Struktur Organisasi",
		href: "/admin/organisasi",
		description: "Kelola aparatur desa, jabatan, dan kontak.",
		shortLabel: "Organisasi",
		icon: "organisasi",
		phase: "MVP",
		enabled: true,
	},
	{
		label: "Potensi Desa",
		href: "/admin/potensi",
		description: "Kelola potensi kategori Pertanian dan Pariwisata.",
		shortLabel: "Potensi",
		icon: "potensi",
		phase: "MVP",
		enabled: true,
	},

	{
		label: "Statistik",
		href: "/admin/statistik",
		description: "Ringkasan statistik desa.",
		shortLabel: "Statistik",
		icon: "statistik",
		phase: "MVP",
		enabled: true,
	},

	{
		label: "Berita",
		href: "/admin/news",
		description: "Kelola kategori dan publikasi berita desa.",
		shortLabel: "Berita",
		icon: "news",
		phase: "MVP",
		enabled: true,
	},
	{
		label: "Media Upload",
		href: "/admin/media",
		description:
			"Upload gambar, validasi file, dan pilih media untuk form konten.",
		shortLabel: "Media",
		icon: "media",
		phase: "MVP",
		enabled: true,
	},

	{
		label: "Demografi",
		href: "/admin/demografi",
		description: "Kelola ringkasan demografi warga desa.",
		shortLabel: "Demografi",
		icon: "demografi",
		phase: "Next",
		enabled: false,
	},
	{
		label: "Sejarah Desa",
		href: "/admin/sejarah",
		description: "Kelola narasi sejarah dan milestone secara mandiri.",
		shortLabel: "Sejarah",
		icon: "sejarah",
		phase: "Next",
		enabled: false,
	},
];
