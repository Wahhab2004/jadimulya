import { adminBeFetch } from '@/lib/admin-api-client';

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
export const MEDIA_LIBRARY_UPDATED_EVENT = 'jadimulya:media-library-updated';

export const initialMediaItems: MediaItem[] = [];

type BackendMediaItem = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

type BackendResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export function isAllowedImageType(file: File) {
  return file.type.startsWith('image/');
}

export function isAllowedImageSize(file: File) {
  return file.size <= MEDIA_MAX_FILE_SIZE;
}

function normalizeUnknownMediaItem(item: unknown): MediaItem | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const candidate = item as Record<string, unknown>;
  const id = candidate.id;
  const name = typeof candidate.name === 'string'
    ? candidate.name
    : typeof candidate.fileName === 'string'
      ? candidate.fileName
      : null;
  const url = candidate.url;
  const mimeType = candidate.mimeType;
  const createdAt = candidate.createdAt;
  const size = typeof candidate.size === 'number'
    ? candidate.size
    : typeof candidate.sizeBytes === 'number'
      ? candidate.sizeBytes
      : 0;

  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof url !== 'string' ||
    typeof mimeType !== 'string' ||
    typeof createdAt !== 'string'
  ) {
    return null;
  }

  return {
    id,
    name,
    url,
    size: Number.isFinite(size) ? size : 0,
    mimeType,
    createdAt,
  };
}

function normalizeMediaList(items: unknown): MediaItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => normalizeUnknownMediaItem(item))
    .filter((item): item is MediaItem => item !== null);
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
    const items = normalizeMediaList(parsed);
    return items;
  } catch {
    return initialMediaItems;
  }
}

export async function loadRemoteMediaItems() {
  if (typeof window === 'undefined') {
    return initialMediaItems;
  }

  const fallbackItems = loadStoredMediaItems();

  try {
    const response = await adminBeFetch('media', { method: 'GET' });
    if (!response.ok) {
      return fallbackItems;
    }

    const payload = (await response.json().catch(() => null)) as
      | BackendResponse<BackendMediaItem[]>
      | BackendMediaItem[]
      | null;

    const sourceItems = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

    const normalizedItems = normalizeMediaList(sourceItems);
    saveMediaItems(normalizedItems);
    return normalizedItems;
  } catch {
    return fallbackItems;
  }
}

function dispatchMediaLibraryUpdated() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(MEDIA_LIBRARY_UPDATED_EVENT));
}

export function saveMediaItems(items: MediaItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(items));
  dispatchMediaLibraryUpdated();
}

export function subscribeMediaLibraryUpdates(onUpdate: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === MEDIA_STORAGE_KEY) {
      onUpdate();
    }
  };

  window.addEventListener(MEDIA_LIBRARY_UPDATED_EVENT, onUpdate);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(MEDIA_LIBRARY_UPDATED_EVENT, onUpdate);
    window.removeEventListener('storage', handleStorage);
  };
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
