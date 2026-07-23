"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import {
	getDemografiPekerjaan,
	getDemografiPerDusun,
	getDemografiRingkasan,
	getDemografiUsia,
} from "@/lib/api";
import type { PopulationDataset } from "@/lib/population-store";

type PopulationSummary = PopulationDataset["summary"];
type AgeGroupItem = PopulationDataset["ageGroups"][number];
type OccupationItem = PopulationDataset["occupations"][number];
type DusunItem = PopulationDataset["dusun"][number];

const emptySummary: PopulationSummary = {
	totalPopulation: 0,
	households: 0,
	male: 0,
	female: 0,
};

function numberFormat(value: number) {
	return value.toLocaleString("id-ID");
}

function toSafeNumber(value: unknown) {
	if (typeof value === "number" && Number.isFinite(value)) {
		return Math.max(0, Math.round(value));
	}

	if (typeof value === "string") {
		const parsed = Number(value.replace(/[^\d.-]/g, ""));
		if (Number.isFinite(parsed)) {
			return Math.max(0, Math.round(parsed));
		}
	}

	return 0;
}

function getStringField(record: Record<string, unknown>, keys: string[]) {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) {
			return value.trim();
		}
	}

	return "";
}

function pickArrayField(record: Record<string, unknown>, keys: string[]) {
	for (const key of keys) {
		const value = record[key];
		if (Array.isArray(value)) {
			return value;
		}
	}

	return [];
}

function parseAgeGroups(source: unknown): AgeGroupItem[] {
	if (!Array.isArray(source)) {
		return [];
	}

	return source
		.map((item, index) => {
			const asRecord = item as Record<string, unknown>;
			const label = getStringField(asRecord, ["label", "name", "range"]);
			if (!label) {
				return null;
			}

			return {
				id:
					typeof asRecord.id === "string" && asRecord.id.trim()
						? asRecord.id
						: `age-api-${index + 1}`,
				label,
				value: toSafeNumber(asRecord.value ?? asRecord.count ?? asRecord.total),
			};
		})
		.filter((item): item is AgeGroupItem => item !== null);
}

function mapOccupations(source: unknown): OccupationItem[] {
	if (!Array.isArray(source)) {
		return [];
	}

	return source
		.map((item, index) => {
			const asRecord = item as Record<string, unknown>;
			const label = getStringField(asRecord, ["label", "name", "occupation"]);
			if (!label) {
				return null;
			}

			return {
				id:
					typeof asRecord.id === "string" && asRecord.id.trim()
						? asRecord.id
						: `job-api-${index + 1}`,
				label,
				value: toSafeNumber(asRecord.value ?? asRecord.count ?? asRecord.total),
			};
		})
		.filter((item): item is OccupationItem => item !== null);
}

function mapDusun(source: unknown): DusunItem[] {
	if (!Array.isArray(source)) {
		return [];
	}

	return source
		.map((item, index) => {
			const asRecord = item as Record<string, unknown>;
			const name = getStringField(asRecord, [
				"name",
				"dusunName",
				"dusun",
				"villageName",
			]);
			if (!name) {
				return null;
			}

			// Field dari API per-dusun (demografi.schema.ts) memakai maleCount/femaleCount/totalKK.
			const male = toSafeNumber(
				asRecord.maleCount ??
					asRecord.male ??
					asRecord.lakiLaki ??
					asRecord.totalMale,
			);
			const female = toSafeNumber(
				asRecord.femaleCount ??
					asRecord.female ??
					asRecord.perempuan ??
					asRecord.totalFemale,
			);
			const households = toSafeNumber(
				asRecord.totalKK ??
					asRecord.households ??
					asRecord.kk ??
					asRecord.totalHouseholds,
			);

			return {
				id:
					typeof asRecord.id === "string" && asRecord.id.trim()
						? asRecord.id
						: `dusun-api-${index + 1}`,
				name,
				households,
				male,
				female,
			};
		})
		.filter((item): item is DusunItem => item !== null);
}

export default function StatistikPage() {
	const [dataset, setDataset] = useState<PopulationDataset | null>(null);
	const [sourceYear, setSourceYear] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		let isMounted = true;

		void (async () => {
			setIsLoading(true);
			setErrorMessage("");

			let nextSummary: PopulationSummary | null = null;
			let nextAgeGroups: AgeGroupItem[] = [];
			let nextOccupations: OccupationItem[] = [];
			let nextDusun: DusunItem[] = [];
			let nextSourceYear: number | null = null;
			let hadApiError = false;

			const [ringkasanResult, dusunResult, usiaResult, pekerjaanResult] =
				await Promise.allSettled([
					getDemografiRingkasan(),
					getDemografiPerDusun(),
					getDemografiUsia(),
					getDemografiPekerjaan(),
				]);

			if (ringkasanResult.status === "fulfilled") {
				const ringkasan = ringkasanResult.value as Record<string, unknown> & {
					totalPopulation?: unknown;
					totalFamilies?: unknown;
					maleCount?: unknown;
					femaleCount?: unknown;
					dataYear?: unknown;
				};

				// Field dari API (demografi.schema.ts / Prisma DemographicSummary) memakai
				// nama totalFamilies/maleCount/femaleCount — bukan households/male/female.
				nextSummary = {
					totalPopulation: toSafeNumber(ringkasan.totalPopulation),
					households: toSafeNumber(ringkasan.totalFamilies),
					male: toSafeNumber(ringkasan.maleCount),
					female: toSafeNumber(ringkasan.femaleCount),
				};

				nextSourceYear =
					typeof ringkasan.dataYear === "number" ? ringkasan.dataYear : null;
			} else {
				hadApiError = true;
			}

			if (dusunResult.status === "fulfilled") {
				nextDusun = mapDusun(dusunResult.value);
			} else {
				hadApiError = true;
			}

			if (usiaResult.status === "fulfilled") {
				nextAgeGroups = parseAgeGroups(usiaResult.value);
			} else {
				hadApiError = true;
			}

			if (pekerjaanResult.status === "fulfilled") {
				nextOccupations = mapOccupations(pekerjaanResult.value);
			} else {
				hadApiError = true;
			}

			const totalFromDusun = nextDusun.reduce<PopulationSummary>(
				(acc, item) => {
					acc.households += item.households;
					acc.male += item.male;
					acc.female += item.female;
					acc.totalPopulation += item.male + item.female;
					return acc;
				},
				{ totalPopulation: 0, households: 0, male: 0, female: 0 },
			);

			const hasSummary =
				nextSummary !== null &&
				(nextSummary.totalPopulation > 0 ||
					nextSummary.households > 0 ||
					nextSummary.male > 0 ||
					nextSummary.female > 0);

			const resolvedSummary: PopulationSummary =
				hasSummary && nextSummary !== null ? nextSummary : totalFromDusun;

			const nextDataset: PopulationDataset = {
				summary: resolvedSummary,
				ageGroups: nextAgeGroups,
				occupations: nextOccupations,
				dusun: nextDusun,
				updatedAt:
					nextSourceYear !== null
						? String(nextSourceYear)
						: new Date().toISOString().slice(0, 10),
			};

			if (isMounted) {
				setDataset(nextDataset);
				setSourceYear(nextSourceYear);
				if (hadApiError && !hasSummary && nextDusun.length === 0) {
					setErrorMessage("Data statistik belum tersedia dari API.");
				}
			}

			if (isMounted) {
				setIsLoading(false);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	const summary = dataset?.summary ?? emptySummary;
	const ageGroups = dataset?.ageGroups ?? [];
	const occupations = dataset?.occupations ?? [];
	const dusunItems = dataset?.dusun ?? [];

	const maxDusunTotal = useMemo(
		() => Math.max(1, ...dusunItems.map((item) => item.male + item.female)),
		[dusunItems],
	);
	const maxOccupation = useMemo(
		() => Math.max(1, ...occupations.map((item) => item.value)),
		[occupations],
	);
	const maxAgeGroup = useMemo(
		() => Math.max(1, ...ageGroups.map((item) => item.value)),
		[ageGroups],
	);

	const malePercent = summary.totalPopulation
		? Math.round((summary.male / summary.totalPopulation) * 1000) / 10
		: 0;
	const femalePercent = summary.totalPopulation
		? Math.round((summary.female / summary.totalPopulation) * 1000) / 10
		: 0;
	const populationDensity =
		summary.households > 0
			? (summary.totalPopulation / summary.households).toFixed(1)
			: "0.0";

	const summaryItems = [
		{
			label: "Total Penduduk",
			value: numberFormat(summary.totalPopulation),
			note: sourceYear ? `Data tahun ${sourceYear}` : "Ringkasan dari API",
			noteClass: "text-sky-700",
		},
		{
			label: "Kepala Keluarga",
			value: numberFormat(summary.households),
			note: `Rata-rata ${populationDensity} jiwa/KK`,
			noteClass: "text-sky-700",
		},
		{
			label: "Laki-laki",
			value: numberFormat(summary.male),
			note: `${malePercent}% dari total`,
			noteClass: "text-amber-700",
		},
		{
			label: "Perempuan",
			value: numberFormat(summary.female),
			note: `${femalePercent}% dari total`,
			noteClass: "text-sky-700",
		},
	];

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />
			<main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
				<section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
					<p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
						Data Publik Desa
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
						Statistik Real Desa Jadimulya
					</h1>
					<p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
						Halaman ini menampilkan semua data yang tersedia dari API publik:
						ringkasan penduduk, sebaran per dusun, jenis pekerjaan, dan kelompok
						usia jika backend menyediakannya.
					</p>
					<div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-sky-700">
						<span className="rounded-full bg-sky-50 px-3 py-1">
							API ringkasan
						</span>
						<span className="rounded-full bg-sky-50 px-3 py-1">
							API per dusun
						</span>
						<span className="rounded-full bg-sky-50 px-3 py-1">
							API pekerjaan
						</span>
						<span className="rounded-full bg-sky-50 px-3 py-1">
							API usia jika ada
						</span>
					</div>
				</section>

				{isLoading ? (
					<section className="mt-6 rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
						<p className="text-sm text-slate-600">
							Memuat data statistik dari API...
						</p>
					</section>
				) : null}

				{errorMessage ? (
					<section className="mt-6 rounded-[1.8rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 shadow-sm">
						{errorMessage}
					</section>
				) : null}

				<section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{summaryItems.map((item) => (
						<article
							key={item.label}
							className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm"
						>
							<p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
								{item.label}
							</p>
							<p className="mt-2 text-4xl font-semibold leading-none text-slate-900">
								{item.value}
							</p>
							<p className={`mt-2 text-xs font-medium ${item.noteClass}`}>
								{item.note}
							</p>
						</article>
					))}
				</section>

				<section className="mt-6 grid gap-4 lg:grid-cols-2">
					<article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-slate-900">
							Distribusi Gender
						</h2>
						<div className="mx-auto mt-6 h-48 w-48 rounded-full bg-[conic-gradient(#0ea5e9_0deg_177.84deg,#60a5fa_177.84deg_360deg)] p-5">
							<div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center">
								<div>
									<p className="text-sm text-slate-500">Komposisi</p>
									<p className="text-2xl font-semibold text-slate-900">
										{malePercent}:{femalePercent}
									</p>
								</div>
							</div>
						</div>
						<div className="mt-6 grid grid-cols-2 gap-4 text-sm">
							<div className="rounded-2xl bg-sky-50 px-4 py-3">
								<p className="font-semibold text-slate-900">Laki-laki</p>
								<p className="mt-1 text-sky-700">{malePercent}%</p>
							</div>
							<div className="rounded-2xl bg-sky-50 px-4 py-3">
								<p className="font-semibold text-slate-900">Perempuan</p>
								<p className="mt-1 text-sky-700">{femalePercent}%</p>
							</div>
						</div>
					</article>

					<article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-slate-900">
							Kelompok Usia
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							Ditampilkan jika backend mengirim data usia pada endpoint
							ringkasan.
						</p>
						{ageGroups.length === 0 ? (
							<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
								Tidak ada data kelompok usia dari API saat ini.
							</div>
						) : (
							<div className="mt-5 space-y-4">
								{ageGroups.map((item) => (
									<div key={item.id}>
										<div className="mb-1 flex items-center justify-between text-sm">
											<span className="text-slate-700">{item.label}</span>
											<span className="font-medium text-slate-900">
												{numberFormat(item.value)}
											</span>
										</div>
										<div className="h-2 rounded-full bg-slate-200">
											<div
												className="h-2 rounded-full bg-sky-600"
												style={{
													width: `${Math.max(4, Math.round((item.value / maxAgeGroup) * 100))}%`,
												}}
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</article>
				</section>

				<section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
					<article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-slate-900">
							Sebaran Data per Dusun
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							Data ini diambil langsung dari API per dusun dan dipakai sebagai
							sumber utama ringkasan.
						</p>
						{dusunItems.length === 0 ? (
							<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
								Data dusun belum tersedia. Admin desa dapat menambah rincian
								dusun dari menu Kependudukan.
							</div>
						) : (
							<div className="mt-5 space-y-4">
								{dusunItems.map((item) => {
									const total = item.male + item.female;
									const width = Math.max(
										8,
										Math.round((total / maxDusunTotal) * 100),
									);
									return (
										<div
											key={item.id}
											className="rounded-2xl border border-slate-200 p-4"
										>
											<div className="flex flex-wrap items-start justify-between gap-3">
												<div>
													<p className="text-base font-semibold text-slate-900">
														{item.name}
													</p>
													<p className="mt-1 text-sm text-slate-500">
														KK {numberFormat(item.households)} · Total{" "}
														{numberFormat(total)}
													</p>
												</div>
												<p className="text-sm font-semibold text-sky-700">
													{width}% dari dusun terbesar
												</p>
											</div>
											<div className="mt-4 h-3 rounded-full bg-slate-100">
												<div
													className="h-3 rounded-full bg-sky-600"
													style={{ width: `${width}%` }}
												/>
											</div>
											<div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
												<div className="rounded-xl bg-sky-50 px-3 py-2">
													<p className="text-xs text-slate-500">Laki-laki</p>
													<p className="font-semibold text-slate-900">
														{numberFormat(item.male)}
													</p>
												</div>
												<div className="rounded-xl bg-sky-50 px-3 py-2">
													<p className="text-xs text-slate-500">Perempuan</p>
													<p className="font-semibold text-slate-900">
														{numberFormat(item.female)}
													</p>
												</div>
												<div className="rounded-xl bg-sky-50 px-3 py-2">
													<p className="text-xs text-slate-500">Total</p>
													<p className="font-semibold text-slate-900">
														{numberFormat(total)}
													</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</article>

					<article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
						<h2 className="text-lg font-semibold text-slate-900">
							Jenis Pekerjaan
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							Data ini diambil langsung dari API ringkasan. Jika backend tidak
							mengirimnya, bagian ini tetap tampil dengan status kosong.
						</p>
						{occupations.length === 0 ? (
							<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
								Data jenis pekerjaan belum tersedia dari API saat ini.
							</div>
						) : (
							<div className="mt-5 space-y-4">
								{occupations.map((item) => {
									const width = Math.max(
										6,
										Math.round((item.value / maxOccupation) * 100),
									);
									return (
										<div key={item.id}>
											<div className="mb-1 flex items-center justify-between text-sm">
												<span className="text-slate-700">{item.label}</span>
												<span className="font-medium text-slate-900">
													{numberFormat(item.value)}
												</span>
											</div>
											<div className="h-2 rounded-full bg-slate-200">
												<div
													className="h-2 rounded-full bg-amber-500"
													style={{ width: `${width}%` }}
												/>
											</div>
										</div>
									);
								})}
							</div>
						)}
						<div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
							<p className="font-medium text-slate-900">Catatan data</p>
							<p className="mt-1">
								Halaman ini hanya menampilkan data yang benar-benar tersedia
								dari API. Tidak ada fallback lokal yang diprioritaskan.
							</p>
						</div>
					</article>
				</section>
			</main>
            <Footer />
		</div>
	);
}
