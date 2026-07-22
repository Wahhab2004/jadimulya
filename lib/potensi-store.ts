export type PotensiCategory = 'Pertanian' | 'Wisata';

export type PotensiItem = {
  id: string;
  title: string;
  description: string;
  category: PotensiCategory;
  tag: string;
  imageUrl: string;
};

export const POTENSI_STORAGE_KEY = 'jadimulya_potensi_items';

export const initialPotensiItems: PotensiItem[] = [
  {
    id: 'p-1',
    title: 'Kelompok Tani Sawah Lembur',
    description:
      'Kelompok tani desa yang mengelola lahan padi secara gotong royong dengan fokus peningkatan kualitas panen dan distribusi lokal.',
    category: 'Pertanian',
    tag: 'Highlight',
    imageUrl: '/images/potensi-kopi.jpg',
  },
  {
    id: 'p-2',
    title: 'Curug Jadimulya Permai',
    description:
      'Destinasi alam dengan udara sejuk, aliran air jernih, dan jalur trekking ringan yang cocok untuk wisata keluarga dan komunitas.',
    category: 'Wisata',
    tag: 'Highlight',
    imageUrl: '/images/potensi-wisata.jpg',
  },
  {
    id: 'p-3',
    title: 'Kampung Domba Jadimulya',
    description:
      'Wisata edukasi peternakan domba dengan aktivitas interaktif untuk keluarga, sekolah, dan komunitas.',
    category: 'Wisata',
    tag: 'Prioritas',
    imageUrl: '/images/potensi-wisata.jpg',
  },
  {
    id: 'p-4',
    title: 'Sentra Padi Organik',
    description:
      'Komoditas pertanian andalan dengan praktik budidaya berkelanjutan dan pendampingan kelompok tani.',
    category: 'Pertanian',
    tag: 'Unggulan',
    imageUrl: '/images/potensi-kopi.jpg',
  },
];

function isPotensiCategory(value: unknown): value is PotensiCategory {
  return value === 'Pertanian' || value === 'Wisata';
}

function sanitizeItem(item: unknown): PotensiItem | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const candidate = item as Record<string, unknown>;
  if (!isPotensiCategory(candidate.category)) {
    return null;
  }

  const id = typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : `p-${Date.now()}`;
  const title = typeof candidate.title === 'string' && candidate.title.trim() ? candidate.title : 'Potensi Desa';
  const description = typeof candidate.description === 'string' ? candidate.description : '';
  const tag = typeof candidate.tag === 'string' && candidate.tag.trim() ? candidate.tag : 'Highlight';
  const imageUrl = typeof candidate.imageUrl === 'string' && candidate.imageUrl.trim() ? candidate.imageUrl : '/images/potensi-wisata.jpg';

  return {
    id,
    title,
    description,
    category: candidate.category,
    tag,
    imageUrl,
  };
}

export function loadStoredPotensiItems() {
  if (typeof window === 'undefined') {
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
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(POTENSI_STORAGE_KEY, JSON.stringify(items));
}