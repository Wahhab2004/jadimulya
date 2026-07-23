import { initialPotensiItems, type PotensiItem } from '@/lib/potensi-store';

export type HeroSlide = {
  id: string;
  imageUrl: string;
  caption: string;
};

export type HomepageStatKey = 'totalPenduduk' | 'kepalaKeluarga' | 'luasWilayah';

export type HomepageStat = {
  key: HomepageStatKey;
  label: string;
  value: string;
  note?: string;
};

export type HomepageNewsItem = {
  id: string;
  category: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
};

export type HomepageContent = {
  heroTitle: string;
  heroSubtitle: string;
  slogan: string;
  jelajahiLabel: string;
  jelajahiHref: string;
  logoKabupatenLabel: string;
  logoKabupatenImageUrl?: string;
  heroSlides: HeroSlide[];
  stats: HomepageStat[];
  featuredPotensiIds: string[];
  newsCategories: string[];
  news: HomepageNewsItem[];
};

export const HOMEPAGE_STORAGE_KEY = 'jadimulya_homepage_content';

export const initialHomepageContent: HomepageContent = {
  heroTitle: 'Portal Informasi Resmi Desa Jadimulya',
  heroSubtitle:
    'Informasi desa yang terbarui, ringan diakses, dan relevan untuk warga, mitra, serta pemangku kepentingan.',
  slogan: 'Desa Jadimulya anu lewih waluya',
  jelajahiLabel: 'Jelajahi Desa',
  jelajahiHref: '/potensi',
  logoKabupatenLabel: 'Kabupaten Pangandaran',
  logoKabupatenImageUrl: '/images/logo-pangandaran.svg',
  heroSlides: [
    { id: 'slide-1', imageUrl: '/images/karsidi-kades.jpeg', caption: 'Perangkat Desa Jadimulya' },
    { id: 'slide-2', imageUrl: '/images/hero-bg.jpg', caption: 'Kantor Desa Jadimulya' },
    { id: 'slide-3', imageUrl: '/images/potensi-kopi.jpg', caption: 'Potensi Pertanian Desa' },
    { id: 'slide-4', imageUrl: '/images/potensi-wisata.jpg', caption: 'Potensi Pariwisata Desa' },
  ],
  stats: [
    { key: 'totalPenduduk', label: 'Total Penduduk', value: '4,285', note: 'Data terbaru' },
    { key: 'kepalaKeluarga', label: 'Kepala Keluarga', value: '1,120', note: 'Data terbaru' },
    { key: 'luasWilayah', label: 'Luas Wilayah', value: '324 Ha', note: 'Luas administrasi desa' },
  ],
  featuredPotensiIds: initialPotensiItems.slice(0, 3).map((item) => item.id),
  newsCategories: ['Pembangunan', 'Kesehatan', 'Pertanian', 'Wisata'],
  news: [
    {
      id: 'news-1',
      category: 'Pembangunan',
      title: 'Musrenbangdes 2026 Fokus Jalan Tani dan Drainase Dusun',
      date: '12 Juli 2026',
      description:
        'Pemerintah Desa menetapkan prioritas infrastruktur dasar untuk mendukung mobilitas hasil pertanian dan keselamatan warga.',
      imageUrl: '/images/potensi-kopi.jpg',
    },
    {
      id: 'news-2',
      category: 'Kesehatan',
      title: 'Posyandu Bulanan Capai Cakupan Peserta Tinggi',
      date: '08 Juli 2026',
      description:
        'Kegiatan posyandu melibatkan kader desa dan puskesmas untuk pemantauan gizi, imunisasi, serta edukasi kesehatan keluarga.',
      imageUrl: '/images/potensi-wisata.jpg',
    },
    {
      id: 'news-3',
      category: 'Pertanian',
      title: 'Pelatihan Petani: Penguatan Produktivitas Lahan Padi',
      date: '02 Juli 2026',
      description:
        'Kelompok tani mengikuti pelatihan teknis budidaya berkelanjutan dan manajemen panen untuk meningkatkan hasil produksi.',
      imageUrl: '/images/potensi-kopi.jpg',
    },
  ],
};

function isHomepageStatKey(value: unknown): value is HomepageStatKey {
  return value === 'totalPenduduk' || value === 'kepalaKeluarga' || value === 'luasWilayah';
}

function sanitizeSlide(value: unknown): HeroSlide | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as Record<string, unknown>;
  if (typeof item.imageUrl !== 'string' || !item.imageUrl.trim()) {
    return null;
  }

  return {
    id: typeof item.id === 'string' && item.id.trim() ? item.id : `slide-${Date.now()}`,
    imageUrl: item.imageUrl,
    caption: typeof item.caption === 'string' ? item.caption : 'Slide Homepage',
  };
}

function sanitizeStat(value: unknown): HomepageStat | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as Record<string, unknown>;
  if (!isHomepageStatKey(item.key)) {
    return null;
  }

  return {
    key: item.key,
    label: typeof item.label === 'string' && item.label.trim() ? item.label : initialHomepageContent.stats.find((stat) => stat.key === item.key)?.label ?? 'Statistik',
    value: typeof item.value === 'string' && item.value.trim() ? item.value : '0',
    note: typeof item.note === 'string' ? item.note : '',
  };
}

function sanitizeNews(value: unknown): HomepageNewsItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const item = value as Record<string, unknown>;
  if (typeof item.title !== 'string' || !item.title.trim()) {
    return null;
  }

  return {
    id: typeof item.id === 'string' && item.id.trim() ? item.id : `news-${Date.now()}`,
    category: typeof item.category === 'string' && item.category.trim() ? item.category : 'Pembangunan',
    title: item.title,
    date: typeof item.date === 'string' && item.date.trim() ? item.date : 'Belum diisi',
    description: typeof item.description === 'string' ? item.description : '',
    imageUrl: typeof item.imageUrl === 'string' && item.imageUrl.trim() ? item.imageUrl : '/images/potensi-kopi.jpg',
  };
}

function mergeStats(stats: HomepageStat[]): HomepageStat[] {
  const fallback = initialHomepageContent.stats;
  return fallback.map((base) => stats.find((item) => item.key === base.key) ?? base);
}

function uniqueStringArray(values: unknown): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  const seen = new Set<string>();
  const nextValues: string[] = [];
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    nextValues.push(trimmed);
  }

  return nextValues;
}

export function loadStoredHomepageContent(potensiItems: PotensiItem[] = initialPotensiItems) {
  if (typeof window === 'undefined') {
    return initialHomepageContent;
  }

  const rawValue = window.localStorage.getItem(HOMEPAGE_STORAGE_KEY);
  if (!rawValue) {
    return initialHomepageContent;
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;

    const heroSlides = Array.isArray(parsed.heroSlides)
      ? parsed.heroSlides.map((item) => sanitizeSlide(item)).filter((item): item is HeroSlide => item !== null)
      : initialHomepageContent.heroSlides;

    const stats = Array.isArray(parsed.stats)
      ? mergeStats(parsed.stats.map((item) => sanitizeStat(item)).filter((item): item is HomepageStat => item !== null))
      : initialHomepageContent.stats;

    const featuredPotensiIdsRaw = uniqueStringArray(parsed.featuredPotensiIds);
    const validPotensiIds = new Set(potensiItems.map((item) => item.id));
    const featuredPotensiIds = featuredPotensiIdsRaw.filter((id) => validPotensiIds.has(id));

    const newsCategories = uniqueStringArray(parsed.newsCategories);

    const news = Array.isArray(parsed.news)
      ? parsed.news.map((item) => sanitizeNews(item)).filter((item): item is HomepageNewsItem => item !== null)
      : initialHomepageContent.news;

    return {
      heroTitle: typeof parsed.heroTitle === 'string' && parsed.heroTitle.trim() ? parsed.heroTitle : initialHomepageContent.heroTitle,
      heroSubtitle:
        typeof parsed.heroSubtitle === 'string' && parsed.heroSubtitle.trim() ? parsed.heroSubtitle : initialHomepageContent.heroSubtitle,
      slogan: typeof parsed.slogan === 'string' && parsed.slogan.trim() ? parsed.slogan : initialHomepageContent.slogan,
      jelajahiLabel:
        typeof parsed.jelajahiLabel === 'string' && parsed.jelajahiLabel.trim() ? parsed.jelajahiLabel : initialHomepageContent.jelajahiLabel,
      jelajahiHref:
        typeof parsed.jelajahiHref === 'string' && parsed.jelajahiHref.trim() ? parsed.jelajahiHref : initialHomepageContent.jelajahiHref,
      logoKabupatenLabel:
        typeof parsed.logoKabupatenLabel === 'string' && parsed.logoKabupatenLabel.trim()
          ? parsed.logoKabupatenLabel
          : initialHomepageContent.logoKabupatenLabel,
      logoKabupatenImageUrl:
        typeof parsed.logoKabupatenImageUrl === 'string' ? parsed.logoKabupatenImageUrl : initialHomepageContent.logoKabupatenImageUrl,
      heroSlides: heroSlides.length > 0 ? heroSlides : initialHomepageContent.heroSlides,
      stats,
      featuredPotensiIds: featuredPotensiIds.length > 0 ? featuredPotensiIds : initialHomepageContent.featuredPotensiIds,
      newsCategories: newsCategories.length > 0 ? newsCategories : initialHomepageContent.newsCategories,
      news: news.length > 0 ? news : initialHomepageContent.news,
    } satisfies HomepageContent;
  } catch {
    return initialHomepageContent;
  }
}

export function saveHomepageContent(content: HomepageContent) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(HOMEPAGE_STORAGE_KEY, JSON.stringify(content));
}
