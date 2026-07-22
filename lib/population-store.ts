export type PopulationSummary = {
  totalPopulation: number;
  households: number;
  male: number;
  female: number;
};

export type AgeGroupItem = {
  id: string;
  label: string;
  value: number;
};

export type OccupationItem = {
  id: string;
  label: string;
  value: number;
};

export type DusunPopulationItem = {
  id: string;
  name: string;
  households: number;
  male: number;
  female: number;
};

export type PopulationDataset = {
  summary: PopulationSummary;
  ageGroups: AgeGroupItem[];
  occupations: OccupationItem[];
  dusun: DusunPopulationItem[];
  updatedAt: string;
};

export const POPULATION_STORAGE_KEY = 'jadimulya_population_dataset';

export const initialPopulationDataset: PopulationDataset = {
  summary: {
    totalPopulation: 4281,
    households: 1142,
    male: 2114,
    female: 2167,
  },
  ageGroups: [
    { id: 'age-1', label: '0-4', value: 320 },
    { id: 'age-2', label: '5-14', value: 580 },
    { id: 'age-3', label: '15-24', value: 710 },
    { id: 'age-4', label: '25-34', value: 840 },
    { id: 'age-5', label: '35-44', value: 690 },
    { id: 'age-6', label: '45-54', value: 520 },
    { id: 'age-7', label: '55-64', value: 390 },
    { id: 'age-8', label: '65+', value: 230 },
  ],
  occupations: [
    { id: 'job-1', label: 'Petani', value: 1028 },
    { id: 'job-2', label: 'Peternak', value: 314 },
    { id: 'job-3', label: 'Pedagang', value: 401 },
    { id: 'job-4', label: 'Buruh', value: 678 },
    { id: 'job-5', label: 'ASN/Guru', value: 167 },
    { id: 'job-6', label: 'Wiraswasta', value: 529 },
    { id: 'job-7', label: 'Lainnya', value: 684 },
  ],
  dusun: [
    { id: 'dusun-1', name: 'Dusun Ciranto', households: 342, male: 612, female: 630 },
    { id: 'dusun-2', name: 'Dusun Cisagu', households: 288, male: 524, female: 541 },
    { id: 'dusun-3', name: 'Dusun Mulyasari', households: 310, male: 568, female: 582 },
    { id: 'dusun-4', name: 'Dusun Sidikmulya', households: 202, male: 410, female: 414 },
  ],
  updatedAt: '2026-07-20',
};

function normalizeNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }

  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.round(parsed));
    }
  }

  return 0;
}

function sanitizeAgeGroup(value: unknown, index: number): AgeGroupItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.label !== 'string' || !candidate.label.trim()) {
    return null;
  }

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : `age-${Date.now()}-${index}`,
    label: candidate.label.trim(),
    value: normalizeNumber(candidate.value),
  };
}

function sanitizeOccupation(value: unknown, index: number): OccupationItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.label !== 'string' || !candidate.label.trim()) {
    return null;
  }

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : `job-${Date.now()}-${index}`,
    label: candidate.label.trim(),
    value: normalizeNumber(candidate.value),
  };
}

function sanitizeDusun(value: unknown, index: number): DusunPopulationItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.name !== 'string' || !candidate.name.trim()) {
    return null;
  }

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : `dusun-${Date.now()}-${index}`,
    name: candidate.name.trim(),
    households: normalizeNumber(candidate.households),
    male: normalizeNumber(candidate.male),
    female: normalizeNumber(candidate.female),
  };
}

export function summarizeFromDusun(dusunItems: DusunPopulationItem[]): PopulationSummary {
  return dusunItems.reduce(
    (acc, item) => {
      acc.households += item.households;
      acc.male += item.male;
      acc.female += item.female;
      acc.totalPopulation += item.male + item.female;
      return acc;
    },
    { totalPopulation: 0, households: 0, male: 0, female: 0 }
  );
}

export function loadStoredPopulationDataset() {
  if (typeof window === 'undefined') {
    return initialPopulationDataset;
  }

  const raw = window.localStorage.getItem(POPULATION_STORAGE_KEY);
  if (!raw) {
    return initialPopulationDataset;
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    const ageGroupsRaw = Array.isArray(parsed.ageGroups)
      ? parsed.ageGroups
          .map((item, index) => sanitizeAgeGroup(item, index))
          .filter((item): item is AgeGroupItem => item !== null)
      : [];

    const occupationsRaw = Array.isArray(parsed.occupations)
      ? parsed.occupations
          .map((item, index) => sanitizeOccupation(item, index))
          .filter((item): item is OccupationItem => item !== null)
      : [];

    const dusunRaw = Array.isArray(parsed.dusun)
      ? parsed.dusun
          .map((item, index) => sanitizeDusun(item, index))
          .filter((item): item is DusunPopulationItem => item !== null)
      : [];

    const fallbackSummary = summarizeFromDusun(dusunRaw);
    const summaryInput = parsed.summary as Record<string, unknown> | undefined;

    const summary: PopulationSummary = {
      totalPopulation: normalizeNumber(summaryInput?.totalPopulation ?? fallbackSummary.totalPopulation),
      households: normalizeNumber(summaryInput?.households ?? fallbackSummary.households),
      male: normalizeNumber(summaryInput?.male ?? fallbackSummary.male),
      female: normalizeNumber(summaryInput?.female ?? fallbackSummary.female),
    };

    return {
      summary,
      ageGroups: ageGroupsRaw.length > 0 ? ageGroupsRaw : initialPopulationDataset.ageGroups,
      occupations: occupationsRaw.length > 0 ? occupationsRaw : initialPopulationDataset.occupations,
      dusun: dusunRaw,
      updatedAt:
        typeof parsed.updatedAt === 'string' && parsed.updatedAt.trim() ? parsed.updatedAt : initialPopulationDataset.updatedAt,
    } satisfies PopulationDataset;
  } catch {
    return initialPopulationDataset;
  }
}

export function savePopulationDataset(dataset: PopulationDataset) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(POPULATION_STORAGE_KEY, JSON.stringify(dataset));
}
