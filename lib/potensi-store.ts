export type PotensiCategory = 'UMKM' | 'Pertanian' | 'Wisata';

export type PotensiItem = {
  id: string;
  title: string;
  description: string;
  category: PotensiCategory;
  tag: string;
  actionLabel: string;
  imageUrl: string;
};

export const POTENSI_STORAGE_KEY = 'jadimulya_potensi_items';

export const initialPotensiItems: PotensiItem[] = [
  {
    id: 'p-1',
    title: 'Anyaman Bambu Kreatif',
    description:
      'Produk kerajinan tangan khas Jadimulya yang menggabungkan teknik tradisional dengan desain modern untuk pasar rumah tangga dan suvenir.',
    category: 'UMKM',
    tag: 'Produk Unggulan',
    actionLabel: 'Lihat Produk',
    imageUrl: '/images/potensi-umkm.jpg',
  },
  {
    id: 'p-2',
    title: 'Curug Jadimulya Permai',
    description:
      'Destinasi alam dengan udara sejuk, aliran air jernih, dan jalur trekking ringan yang cocok untuk wisata keluarga dan komunitas.',
    category: 'Wisata',
    tag: 'Destinasi Alam',
    actionLabel: 'Pesan Tiket',
    imageUrl: '/images/potensi-wisata.jpg',
  },
  {
    id: 'p-3',
    title: 'Kopi Robusta Jadimulya',
    description:
      'Komoditas kopi robusta dari lereng perbukitan yang diproses petani lokal dengan cita rasa cokelat dan aroma rempah lembut.',
    category: 'Pertanian',
    tag: 'Komoditas Organik',
    actionLabel: 'Beli Online',
    imageUrl: '/images/potensi-kopi.jpg',
  },
  {
    id: 'p-4',
    title: 'Batik Tulis Sekar Jagad',
    description:
      'Warisan budaya yang dikerjakan kelompok perajin desa dengan motif lokal, pewarna alami, dan sentuhan kontemporer.',
    category: 'UMKM',
    tag: 'Warisan Budaya',
    actionLabel: 'Lihat Koleksi',
    imageUrl: '/images/potensi-umkm.jpg',
  },
  {
    id: 'p-5',
    title: 'Sentra Buah Tropis',
    description:
      'Kebun buah masyarakat yang menghasilkan manggis, rambutan, dan durian lokal dengan distribusi ke pasar wilayah sekitar.',
    category: 'Pertanian',
    tag: 'Hasil Bumi',
    actionLabel: 'Hubungi Petani',
    imageUrl: '/images/potensi-wisata.jpg',
  },
  {
    id: 'p-6',
    title: 'Kampung Kuliner Tradisional',
    description:
      'Ragam kuliner khas desa dari resep turun-temurun, disajikan dengan pengalaman makan yang hangat dan otentik.',
    category: 'Wisata',
    tag: 'Kuliner Khas',
    actionLabel: 'Eksplorasi Menu',
    imageUrl: '/images/potensi-kopi.jpg',
  },
];

export function loadStoredPotensiItems() {
  if (typeof window === 'undefined') {
    return initialPotensiItems;
  }

  const rawValue = window.localStorage.getItem(POTENSI_STORAGE_KEY);

  if (!rawValue) {
    return initialPotensiItems;
  }

  try {
    const parsed = JSON.parse(rawValue) as PotensiItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialPotensiItems;
  } catch {
    return initialPotensiItems;
  }
}

export function savePotensiItems(items: PotensiItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(POTENSI_STORAGE_KEY, JSON.stringify(items));
}