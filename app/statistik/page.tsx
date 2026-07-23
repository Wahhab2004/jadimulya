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
                    setErrorMessage("Data statistik kependudukan belum dapat ditampilkan saat ini.");
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

    // Sudut derajat untuk Conic Gradient Gender
    const maleDegrees = summary.totalPopulation > 0
        ? Math.round((summary.male / summary.totalPopulation) * 360)
        : 180;

    const summaryItems = [
        {
            label: "Total Penduduk",
            value: numberFormat(summary.totalPopulation),
            note: sourceYear ? `Data Resmi Tahun ${sourceYear}` : "Sumber Data Terverifikasi",
            noteClass: "text-sky-700 bg-sky-50",
            icon: (
                <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            label: "Kepala Keluarga",
            value: numberFormat(summary.households),
            note: `Rata-rata ${populationDensity} jiwa / KK`,
            noteClass: "text-sky-700 bg-sky-50",
            icon: (
                <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            label: "Laki-laki",
            value: numberFormat(summary.male),
            note: `${malePercent}% dari total warga`,
            noteClass: "text-sky-800 bg-sky-100/60",
            icon: (
                <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            label: "Perempuan",
            value: numberFormat(summary.female),
            note: `${femalePercent}% dari total warga`,
            noteClass: "text-sky-700 bg-sky-50",
            icon: (
                <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                {/* Hero / Header Section */}
                <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700 border border-sky-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-sky-600 animate-pulse" />
                                Data Publik Resmi Desa
                            </div>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                Statistik & Demografi Desa Jadimulya
                            </h1>
                            <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
                                Sajian data kependudukan terpadu Desa Jadimulya secara berkala.
                                Wujud komitmen transparansi tata kelola pemerintahan desa yang akuntabel dan berbasis data mutakhir.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                            >
                                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Cetak Laporan
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                        <span className="rounded-full bg-slate-100 px-3 py-1">Ringkasan Penduduk</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">Sebaran per Dusun</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">Mata Pencaharian</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">Kelompok Usia</span>
                    </div>
                </section>

                {/* State Loading & Error */}
                {isLoading ? (
                    <section className="mt-6 rounded-[2rem] border border-slate-200/80 bg-white p-8 text-center shadow-sm">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-r-transparent" />
                        <p className="mt-3 text-sm font-medium text-slate-600">
                            Memuat data statistik kependudukan...
                        </p>
                    </section>
                ) : null}

                {errorMessage ? (
                    <section className="mt-6 rounded-[2rem] border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-800 shadow-sm flex items-center gap-3">
                        <svg className="h-5 w-5 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{errorMessage}</span>
                    </section>
                ) : null}

                {/* Ringkasan Angka Utama */}
                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {summaryItems.map((item) => (
                        <article
                            key={item.label}
                            className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-sky-200"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {item.label}
                                </p>
                                <div className="rounded-2xl bg-sky-50/80 p-2.5 transition group-hover:bg-sky-100">
                                    {item.icon}
                                </div>
                            </div>
                            <p className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
                                {item.value}
                            </p>
                            <div className="mt-3">
                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.noteClass}`}>
                                    {item.note}
                                </span>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Visualisasi Gender & Usia */}
                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* Distribution Donut Chart */}
                    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Distribusi Gender
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Perbandingan rasio populasi warga laki-laki dan perempuan.
                            </p>
                        </div>

                        <div className="my-8 flex flex-col items-center justify-center">
                            <div
                                className="relative h-48 w-48 rounded-full p-4 transition-transform hover:scale-105"
                                style={{
                                    background: `conic-gradient(#0284c7 0deg ${maleDegrees}deg, #38bdf8 ${maleDegrees}deg 360deg)`,
                                }}
                            >
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center shadow-inner">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Rasio</p>
                                        <p className="text-2xl font-bold text-slate-900">
                                            {malePercent}% : {femalePercent}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-sky-600" />
                                    <p className="font-medium text-slate-700">Laki-laki</p>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-sky-900">{malePercent}%</p>
                                <p className="text-xs text-slate-500">{numberFormat(summary.male)} jiwa</p>
                            </div>
                            <div className="rounded-2xl border border-sky-100 bg-sky-50/30 p-4">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-sky-400" />
                                    <p className="font-medium text-slate-700">Perempuan</p>
                                </div>
                                <p className="mt-2 text-2xl font-bold text-sky-900">{femalePercent}%</p>
                                <p className="text-xs text-slate-500">{numberFormat(summary.female)} jiwa</p>
                            </div>
                        </div>
                    </article>

                    {/* Age Groups Bar Chart */}
                    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Kelompok Usia
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Demografi penduduk berdasarkan rentang kelompok umur.
                            </p>
                        </div>

                        {ageGroups.length === 0 ? (
                            <div className="my-auto rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                                Data kelompok usia sedang disinkronkan oleh Pemerintah Desa.
                            </div>
                        ) : (
                            <div className="my-6 space-y-4">
                                {ageGroups.map((item) => {
                                    const percentage = Math.max(4, Math.round((item.value / maxAgeGroup) * 100));
                                    return (
                                        <div key={item.id}>
                                            <div className="mb-1.5 flex items-center justify-between text-sm">
                                                <span className="font-medium text-slate-700">{item.label}</span>
                                                <span className="font-semibold text-slate-900">
                                                    {numberFormat(item.value)} jiwa
                                                </span>
                                            </div>
                                            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-sky-600 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
                            Kelompok usia membantu perencanaan program kesehatan, pendidikan, dan lansia di Desa Jadimulya.
                        </div>
                    </article>
                </section>

                {/* Dusun & Pekerjaan */}
                <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    {/* Sebaran per Dusun */}
                    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Sebaran Data per Dusun
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Rincian sebaran wilayah kependudukan di setiap dusun.
                                </p>
                            </div>
                        </div>

                        {dusunItems.length === 0 ? (
                            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                                Data per dusun belum tersedia secara rinci.
                            </div>
                        ) : (
                            <div className="mt-6 space-y-4">
                                {dusunItems.map((item) => {
                                    const total = item.male + item.female;
                                    const width = Math.max(
                                        8,
                                        Math.round((total / maxDusunTotal) * 100),
                                    );
                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5 transition hover:border-sky-200 hover:bg-white"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {numberFormat(item.households)} Kepala Keluarga · Total {numberFormat(total)} Jiwa
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                                                    {width}% dari dusun terbesar
                                                </span>
                                            </div>

                                            <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-sky-600 transition-all duration-500"
                                                    style={{ width: `${width}%` }}
                                                />
                                            </div>

                                            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                                                <div className="rounded-xl bg-white p-2 border border-slate-100">
                                                    <p className="text-slate-400">Laki-laki</p>
                                                    <p className="font-bold text-slate-800 mt-0.5">
                                                        {numberFormat(item.male)}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-white p-2 border border-slate-100">
                                                    <p className="text-slate-400">Perempuan</p>
                                                    <p className="font-bold text-slate-800 mt-0.5">
                                                        {numberFormat(item.female)}
                                                    </p>
                                                </div>
                                                <div className="rounded-xl bg-sky-50/60 p-2 border border-sky-100">
                                                    <p className="text-sky-700 font-medium">Total</p>
                                                    <p className="font-bold text-sky-900 mt-0.5">
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

                    {/* Jenis Pekerjaan */}
                    <article className="rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Mata Pencaharian Utama
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Sebaran profesi dan jenis pekerjaan warga Desa Jadimulya.
                            </p>

                            {occupations.length === 0 ? (
                                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                                    Data jenis pekerjaan sedang diinventarisasi.
                                </div>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    {occupations.map((item) => {
                                        const width = Math.max(
                                            6,
                                            Math.round((item.value / maxOccupation) * 100),
                                        );
                                        return (
                                            <div key={item.id}>
                                                <div className="mb-1.5 flex items-center justify-between text-sm">
                                                    <span className="font-medium text-slate-700">{item.label}</span>
                                                    <span className="font-semibold text-slate-900">
                                                        {numberFormat(item.value)} orang
                                                    </span>
                                                </div>
                                                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-sky-500 transition-all duration-500"
                                                        style={{ width: `${width}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50/40 p-4 text-xs leading-relaxed text-slate-600">
                            <p className="font-semibold text-slate-900">Transparansi Data</p>
                            <p className="mt-1">
                                Data disajikan berdasarkan laporan kependudukan resmi Desa Jadimulya secara sistematis.
                            </p>
                        </div>
                    </article>
                </section>
            </main>
            <Footer />
        </div>
    );
}