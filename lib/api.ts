export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

export type OrganisasiTier = "KEPALA_DESA" | "SEKDES_BPD" | "STAFF";

export type BackendOrganisasiItem = {
	id: string;
	fullName: string;
	position: string;
	tier: OrganisasiTier;
	photoUrl: string | null;
	email: string | null;
	phone: string | null;
	facebookUrl: string | null;
	sortOrder: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

export type PotensiCategory = "PERTANIAN" | "PARIWISATA" | "UMKM";

export type BackendPotensiItem = {
	id: string;
	name: string;
	category: PotensiCategory;
	shortDesc: string;
	coverImage: string | null;
	isHighlight: boolean;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
};

export type BackendSejarahNarasi = {
	id: string;
	title?: string;
	subtitle?: string;
	content?: string;
	body?: string;
	description?: string;
	sortOrder?: number;
	createdAt?: string;
	updatedAt?: string;
};

export type BackendSejarahMilestone = {
	id: string;
	year?: string | number;
	event?: string;
	description?: string;
	content?: string;
	imageUrl?: string | null;
	sortOrder?: number;
	createdAt?: string;
	updatedAt?: string;
};

export type BackendDemografiRingkasan = {
	totalPopulation?: number;
	households?: number;
	male?: number;
	female?: number;
	dataYear?: number;
	occupations?: Array<{
		label?: string;
		value?: number;
	}>;
	mainOccupations?: Array<{
		label?: string;
		value?: number;
	}>;
	[key: string]: unknown;
};

export type BackendDemografiPerDusunItem = {
	id?: string;
	name?: string;
	dusunName?: string;
	households?: number;
	kk?: number;
	male?: number;
	female?: number;
	totalPopulation?: number;
	dataYear?: number;
	[key: string]: unknown;
};

export type BackendNewsItem = {
	id: string;
	title: string;
	slug: string;
	category: "PEMBANGUNAN" | "KESEHATAN" | "PERTANIAN" | "WISATA" | "LAINNYA";
	excerpt: string | null;
	content: string;
	coverImage: string | null;
	isPublished: boolean;
	publishedAt: string;
	authorId?: string;
	createdAt?: string;
	updatedAt?: string;
};

export type NewsPagination = {
	page: number;
	limit: number;
	totalItems: number;
	totalPages: number;
};

export type NewsListResponse = {
	items: BackendNewsItem[];
	pagination: NewsPagination;
};

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		cache: "no-store",
		...options,
	});

	if (!res.ok) {
		throw new Error(`API request failed: ${res.status} ${res.statusText}`);
	}

	return res.json();
}

async function fetchApiData<T>(path: string, options?: RequestInit): Promise<T> {
	const payload = await fetchJson<ApiResponse<T>>(path, options);
	return payload.data;
}

export async function getOrganisasi(params?: { tier?: OrganisasiTier }) {
	const query = new URLSearchParams();
	if (params?.tier) {
		query.set("tier", params.tier);
	}

	const suffix = query.toString() ? `?${query.toString()}` : "";
	return fetchApiData<BackendOrganisasiItem[]>(`/organisasi${suffix}`);
}

export async function getSejarahNarasi() {
	return fetchApiData<BackendSejarahNarasi[]>("/sejarah/narasi");
}

export async function getSejarahMilestone(params?: { year?: string | number }) {
	const query = new URLSearchParams();
	if (params?.year !== undefined) {
		query.set("year", String(params.year));
	}

	const suffix = query.toString() ? `?${query.toString()}` : "";
	return fetchApiData<BackendSejarahMilestone[]>(`/sejarah/milestone${suffix}`);
}

export async function getPotensi(params?: {
	category?: PotensiCategory;
	highlightOnly?: boolean;
}) {
	const query = new URLSearchParams();
	if (params?.category) {
		query.set("category", params.category);
	}
	if (typeof params?.highlightOnly === "boolean") {
		query.set("highlightOnly", String(params.highlightOnly));
	}

	const suffix = query.toString() ? `?${query.toString()}` : "";
	return fetchApiData<BackendPotensiItem[]>(`/potensi${suffix}`);
}

export async function getDemografiRingkasan() {
	return fetchApiData<BackendDemografiRingkasan>("/demografi/ringkasan");
}

export async function getDemografiPerDusun(dataYear?: number) {
	const query = typeof dataYear === "number" ? `?dataYear=${dataYear}` : "";
	return fetchApiData<BackendDemografiPerDusunItem[]>(`/demografi/per-dusun${query}`);
}

export type BackendDemografiDusunAdmin = {
	id: string;
	name: string;
	households: number;
	male: number;
	female: number;
	dataYear?: number;
	createdAt?: string;
	updatedAt?: string;
};

export type BackendDemografiAgeGroup = {
	id: string;
	label: string;
	value: number;
	sortOrder?: number;
	createdAt?: string;
	updatedAt?: string;
};

export type BackendDemografiOccupation = {
	id: string;
	label: string;
	value: number;
	sortOrder?: number;
	createdAt?: string;
	updatedAt?: string;
};

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
	return fetchApiData<NewsListResponse>(`/news${suffix}`);
}
