export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, options);
	if (!res.ok) {
		throw new Error(`API request failed: ${res.status} ${res.statusText}`);
	}
	return res.json();
}

export async function getOrganisasi() {
	return fetchJson("/organisasi");
}

export async function getSejarahNarasi() {
	return fetchJson("/sejarah/narasi");
}

export async function getSejarahMilestone() {
	return fetchJson("/sejarah/milestone");
}

export async function getPotensi() {
	return fetchJson("/potensi");
}

export async function getDemografiRingkasan() {
	return fetchJson("/demografi/ringkasan");
}

export async function getDemografiPerDusun(dataYear?: number) {
	const query = typeof dataYear === "number" ? `?dataYear=${dataYear}` : "";
	return fetchJson(`/demografi/per-dusun${query}`);
}

export async function getNews(params?: {
	category?: string;
	page?: number;
	limit?: number;
}) {
	const query = new URLSearchParams();

	if (params?.category) query.set("category", params.category);
	if (typeof params?.page === "number") query.set("page", String(params.page));
	if (typeof params?.limit === "number")
		query.set("limit", String(params.limit));

	const suffix = query.toString() ? `?${query.toString()}` : "";
	return fetchJson(`/news${suffix}`);
}
