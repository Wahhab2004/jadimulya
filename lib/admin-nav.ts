export type AdminNavItem = {
  label: string;
  href: string;
  description?: string;
  shortLabel?: string;
};

export const adminNavItems: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    description: 'Ringkasan aktivitas dan modul utama CMS.',
    shortLabel: 'Dashboard',
  },
  {
    label: 'Statistik Penduduk',
    href: '/admin/statistik',
    description: 'Pantau visualisasi data kependudukan desa.',
    shortLabel: 'Statistik',
  },
  {
    label: 'Demografi',
    href: '/admin/demografi',
    description: 'Kelola ringkasan demografi dan komposisi usia.',
    shortLabel: 'Demografi',
  },
  {
    label: 'Kependudukan',
    href: '/admin/kependudukan',
    description: 'Kelola KK, RT/RW, dan data penduduk per dusun.',
    shortLabel: 'Penduduk',
  },
  {
    label: 'Struktur Organisasi',
    href: '/admin/organisasi',
    description: 'Atur data aparatur dan jabatan pemerintah desa.',
    shortLabel: 'Organisasi',
  },
  {
    label: 'Potensi Desa',
    href: '/admin/potensi',
    description: 'Kelola UMKM, pertanian, wisata, dan peluang usaha.',
    shortLabel: 'Potensi',
  },
  {
    label: 'Sejarah Desa',
    href: '/admin/sejarah',
    description: 'Perbarui narasi sejarah dan milestone desa.',
    shortLabel: 'Sejarah',
  },
  {
    label: 'Pengaturan',
    href: '/admin/pengaturan',
    description: 'Atur preferensi CMS dan publikasi konten.',
    shortLabel: 'Pengaturan',
  },
];