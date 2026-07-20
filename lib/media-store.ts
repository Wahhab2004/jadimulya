export type MediaItem = {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
};

export const MEDIA_STORAGE_KEY = 'jadimulya_media_library';
export const MEDIA_MAX_FILE_SIZE = 2 * 1024 * 1024;

export const initialMediaItems: MediaItem[] = [];

export function isAllowedImageType(file: File) {
  return file.type.startsWith('image/');
}

export function isAllowedImageSize(file: File) {
  return file.size <= MEDIA_MAX_FILE_SIZE;
}

export function loadStoredMediaItems() {
  if (typeof window === 'undefined') {
    return initialMediaItems;
  }

  const rawValue = window.localStorage.getItem(MEDIA_STORAGE_KEY);
  if (!rawValue) {
    return initialMediaItems;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return initialMediaItems;
    }

    const items = parsed
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null;
        }

        const candidate = item as Record<string, unknown>;
        if (
          typeof candidate.id !== 'string' ||
          typeof candidate.name !== 'string' ||
          typeof candidate.url !== 'string' ||
          typeof candidate.mimeType !== 'string' ||
          typeof candidate.createdAt !== 'string'
        ) {
          return null;
        }

        return {
          id: candidate.id,
          name: candidate.name,
          url: candidate.url,
          size: typeof candidate.size === 'number' && Number.isFinite(candidate.size) ? candidate.size : 0,
          mimeType: candidate.mimeType,
          createdAt: candidate.createdAt,
        } satisfies MediaItem;
      })
      .filter((item): item is MediaItem => item !== null);

    return items;
  } catch {
    return initialMediaItems;
  }
}

export function saveMediaItems(items: MediaItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result);
        return;
      }

      reject(new Error('Gagal membaca file.'));
    };
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsDataURL(file);
  });
}
