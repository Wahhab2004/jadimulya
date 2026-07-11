export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getOrganisasi() {
  return fetchJson('/api/organisasi');
}

export async function getSejarah() {
  return fetchJson('/api/sejarah');
}

export async function getPotensi() {
  return fetchJson('/api/potensi');
}

export async function getDemografi() {
  return fetchJson('/api/demografi');
}

export async function getKependudukan() {
  return fetchJson('/api/kependudukan');
}
