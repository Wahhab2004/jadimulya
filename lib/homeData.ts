export type StatItem = {
  label: string;
  value: string;
  note?: string;
};

export type FeatureItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export type NewsItem = {
  id: string;
  tag: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
};

export const heroData = {
  title: 'Membangun Masa Depan Dari Akar Tradisi',
  subtitle:
    'Desa Jadimulya berkomitmen untuk menyatukan kearifan lokal dengan inovasi digital demi kesejahteraan seluruh lapisan masyarakat.',
  actions: [
    { label: 'Layanan Mandiri', href: '/admin' },
    { label: 'Jelajahi Desa', href: '#potensi' },
  ],
};

export const homepageStats: StatItem[] = [
  { label: 'Total Penduduk', value: '4,285', note: 'Data terbaru 2024' },
  { label: 'Kepala Keluarga', value: '1,120', note: 'Rata-rata 3.7 jiwa/KK' },
  { label: 'Tingkat Literasi', value: '85%', note: 'Semua usia > 7 tahun' },
  { label: 'Lahan Produktif', value: '324 Ha', note: 'Pertanian dan UMKM' },
];

export const homepageFeatures: FeatureItem[] = [
  {
    id: 'potensi-1',
    category: 'UMKM',
    title: 'Anyaman Bambu Kreatif',
    description: 'Produk kerajinan tangan khas Jadimulya yang menggabungkan teknik tradisional dengan desain modern.',
    imageUrl: '/images/potensi-umkm.jpg',
  },
  {
    id: 'potensi-2',
    category: 'Wisata',
    title: 'Curug Jadimulya Permai',
    description: 'Destinasi air terjun alami di tengah pegunungan yang asri dan sejuk.',
    imageUrl: '/images/potensi-wisata.jpg',
  },
  {
    id: 'potensi-3',
    category: 'Pertanian',
    title: 'Kopi Robusta Jadimulya',
    description: 'Kopi pilihan diproses secara tradisional dari lereng perbukitan Desa Jadimulya.',
    imageUrl: '/images/potensi-kopi.jpg',
  },
];

export const homepageNews: NewsItem[] = [
  {
    id: 'news-1',
    tag: 'Pembangunan',
    title: 'Musrenbangdes 2024: Fokus pada Perbaikan Infrastruktur Jalan Tani',
    date: '12 Mei 2024',
    description: 'Pemerintah Desa Jadimulya menggelar Musyawarah Perencanaan Pembangunan Desa guna menyerap aspirasi warga.',
    imageUrl: '/images/potensi-umkm.jpg',
  },
  {
    id: 'news-2',
    tag: 'Kesehatan',
    title: 'Sukseskan Pekan Imunisasi Nasional di Posyandu Melati',
    date: '08 Mei 2024',
    description: 'Lebih dari 200 balita di Desa Jadimulya mendapatkan layanan kesehatan gratis dalam rangka penguatan sistem imun desa.',
    imageUrl: '/images/potensi-wisata.jpg',
  },
  {
    id: 'news-3',
    tag: 'Pendidikan',
    title: 'Peresmian Pojok Baca Digital di Balai Desa',
    date: '02 Mei 2024',
    description: 'Kini warga Jadimulya dapat mengakses ribuan koleksi buku digital secara gratis untuk meningkatkan wawasan.',
    imageUrl: '/images/potensi-kopi.jpg',
  },
];
