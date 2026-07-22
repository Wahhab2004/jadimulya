import { HOMEPAGE_STORAGE_KEY } from '@/lib/homepage-store';
import { MEDIA_STORAGE_KEY } from '@/lib/media-store';
import { ORGANISASI_STORAGE_KEY } from '@/lib/organisasi-store';
import { POPULATION_STORAGE_KEY } from '@/lib/population-store';
import { POTENSI_STORAGE_KEY } from '@/lib/potensi-store';
import { SEJARAH_STORAGE_KEY } from '@/lib/sejarah-store';

export const CMS_STORAGE_KEYS = [
  HOMEPAGE_STORAGE_KEY,
  POTENSI_STORAGE_KEY,
  SEJARAH_STORAGE_KEY,
  POPULATION_STORAGE_KEY,
  ORGANISASI_STORAGE_KEY,
  MEDIA_STORAGE_KEY,
] as const;

export type CmsBackupData = {
  exportedAt: string;
  version: 1;
  keys: string[];
  payload: Record<string, unknown>;
};

export function exportCmsBackup(): CmsBackupData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const payload: Record<string, unknown> = {};

  for (const key of CMS_STORAGE_KEYS) {
    const value = window.localStorage.getItem(key);
    if (!value) {
      continue;
    }

    try {
      payload[key] = JSON.parse(value) as unknown;
    } catch {
      payload[key] = value;
    }
  }

  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    keys: [...CMS_STORAGE_KEYS],
    payload,
  };
}

export function importCmsBackup(backupText: string) {
  if (typeof window === 'undefined') {
    return { ok: false as const, message: 'Import hanya bisa dijalankan di browser.' };
  }

  try {
    const parsed = JSON.parse(backupText) as CmsBackupData;
    if (!parsed || typeof parsed !== 'object' || !parsed.payload || typeof parsed.payload !== 'object') {
      return { ok: false as const, message: 'Format backup tidak valid.' };
    }

    const entries = Object.entries(parsed.payload);
    for (const [key, value] of entries) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }

    return { ok: true as const, message: `${entries.length} key berhasil diimport.` };
  } catch {
    return { ok: false as const, message: 'File backup tidak valid (JSON rusak).' };
  }
}
