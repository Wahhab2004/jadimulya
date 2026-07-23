import Link from "next/link";
import { adminNavItems } from "@/lib/admin-nav";

const topSummary = [
	{
		label: "Konten Terbit",
		value: "32",
		note: "5 pembaruan minggu ini",
		accent: "from-sky-400 to-blue-500",
	},
	{
		label: "Potensi Aktif",
		value: "12",
		note: "2 item baru terdaftar",
		accent: "from-sky-400 to-blue-500",
	},
	{
		label: "Data Kependudukan",
		value: "4.281",
		note: "Sinkron per 2024",
		accent: "from-cyan-400 to-sky-500",
	},
	{
		label: "Draft Modul",
		value: "45",
		note: "Menunggu review editor",
		accent: "from-amber-400 to-orange-500",
	},
];

const monthlyActivity = [18, 42, 28, 22, 39, 20, 31, 34, 18, 12, 30, 26];
const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"Mei",
	"Jun",
	"Jul",
	"Agu",
	"Sep",
	"Okt",
	"Nov",
	"Des",
];
const moduleHealth = [
	{ label: "Aktif", value: 68, color: "bg-sky-500" },
	{ label: "Review", value: 22, color: "bg-sky-500" },
	{ label: "Draft", value: 10, color: "bg-amber-400" },
];

export default function AdminHomePage() {
	const maxActivity = Math.max(...monthlyActivity);

	return (
		<div className="space-y-4">
			<section className="flex flex-col gap-5 rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6 lg:rounded-[2rem] lg:p-8">
				<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
							Dashboard
						</p>
						<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.7rem]">
							Selamat Datang di CMS Jadimulya
						</h2>
						<p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
							Pantau performa konten, pembaruan data desa, dan modul layanan
							dalam satu workspace yang lebih visual, cepat, dan nyaman dipakai
							harian.
						</p>
					</div>

					<button
						type="button"
						className="inline-flex items-center self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_rgba(15,23,42,0.85)] transition hover:bg-slate-800 xl:self-auto"
					>
						+ Buat Update Baru
					</button>
				</div>

				<div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
					{topSummary.map((item) => (
						<article
							key={item.label}
							className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_34px_-28px_rgba(15,23,42,0.4)]"
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-slate-500">
										{item.label}
									</p>
									<p className="mt-3 text-4xl font-semibold leading-none text-slate-900">
										{item.value}
									</p>
								</div>
								<span
									className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${item.accent}`}
								/>
							</div>
							<p className="mt-4 text-xs text-slate-500">{item.note}</p>
						</article>
					))}
				</div>
			</section>

			<section className="grid gap-4 2xl:grid-cols-[1.9fr_1fr]">
				<article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6 lg:rounded-[2rem] lg:p-7">
					<div className="flex items-center justify-between gap-4">
						<div>
							<h3 className="text-2xl font-semibold text-slate-900">
								Aktivitas Konten
							</h3>
							<p className="mt-1 text-sm text-slate-500">
								Tren update modul dan publikasi per bulan
							</p>
						</div>
						<div className="flex items-center gap-4 text-xs text-slate-500">
							<span className="inline-flex items-center gap-2">
								<span className="h-2.5 w-2.5 rounded-full bg-sky-500" />{" "}
								Terbit
							</span>
							<span className="inline-flex items-center gap-2">
								<span className="h-2.5 w-2.5 rounded-full bg-sky-100" />{" "}
								Draft
							</span>
						</div>
					</div>

					<div className="mt-8 grid h-[290px] grid-cols-12 items-end gap-2 sm:gap-3">
						{monthlyActivity.map((value, index) => {
							const height = Math.max(28, (value / maxActivity) * 180);
							const draftHeight = Math.max(height + 30, 100);

							return (
								<div
									key={months[index]}
									className="flex h-full flex-col items-center justify-end gap-2"
								>
									<div className="flex h-[220px] items-end gap-1.5">
										<div
											className="w-4 rounded-full bg-sky-500/20"
											style={{ height: `${draftHeight}px` }}
										/>
										<div
											className="w-7 rounded-full bg-sky-500 shadow-[0_14px_26px_-18px_rgba(56,189,248,0.85)]"
											style={{ height: `${height}px` }}
										/>
									</div>
									<span className="text-[11px] text-slate-500">
										{months[index]}
									</span>
								</div>
							);
						})}
					</div>
				</article>

				<article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6 lg:rounded-[2rem] lg:p-7">
					<div className="flex items-center justify-between gap-4">
						<h3 className="text-2xl font-semibold text-slate-900">
							Kesehatan Modul
						</h3>
						<span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
							Juli 2026
						</span>
					</div>

					<div className="mx-auto mt-8 h-56 w-56 rounded-full bg-[conic-gradient(#22c55e_0deg_244.8deg,#38bdf8_244.8deg_324deg,#fbbf24_324deg_360deg)] p-5 shadow-[0_24px_40px_-28px_rgba(15,23,42,0.5)]">
						<div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center">
							<p className="text-4xl font-semibold text-slate-900">120</p>
							<p className="mt-1 text-sm text-slate-500">Total Modul</p>
						</div>
					</div>

					<div className="mt-8 space-y-3">
						{moduleHealth.map((item) => (
							<div
								key={item.label}
								className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm"
							>
								<span className="inline-flex items-center gap-2 text-slate-700">
									<span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
									{item.label}
								</span>
								<span className="font-semibold text-slate-900">
									{item.value}%
								</span>
							</div>
						))}
					</div>
				</article>
			</section>

			<section className="grid gap-4 xl:grid-cols-3">
				<article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
					<h3 className="text-xl font-semibold text-slate-900">
						Publikasi Cepat
					</h3>
					<p className="mt-2 text-sm text-slate-500">
						Akses cepat ke modul yang paling sering dipakai.
					</p>
					<div className="mt-5 space-y-3">
						{adminNavItems
							.filter((item) => item.href !== "/admin" && item.enabled)
							.slice(0, 4)
							.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="block rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-sm"
								>
									<p className="font-semibold text-slate-900">{item.label}</p>
									<p className="mt-1 text-sm text-slate-500">
										{item.description}
									</p>
								</Link>
							))}
					</div>
				</article>

				<article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
					<h3 className="text-xl font-semibold text-slate-900">
						Progress Pengembangan
					</h3>
					<div className="mt-5 space-y-4">
						{[
							["Dashboard Admin", 86],
							["Modul Potensi", 74],
							["Statistik Internal", 68],
							["Editor Sejarah", 42],
						].map(([label, value]) => (
							<div key={label}>
								<div className="mb-2 flex items-center justify-between text-sm">
									<span className="text-slate-700">{label}</span>
									<span className="font-semibold text-slate-900">{value}%</span>
								</div>
								<div className="h-2.5 rounded-full bg-slate-200">
									<div
										className="h-2.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
										style={{ width: `${value}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</article>

				<article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
					<h3 className="text-xl font-semibold text-slate-900">
						Ringkasan Tugas
					</h3>
					<div className="mt-5 grid gap-3">
						{[
							["Review 3 potensi baru", "Hari ini"],
							["Sinkron data statistik", "Besok"],
							["Perbarui struktur organisasi", "Minggu ini"],
						].map(([label, due]) => (
							<div key={label} className="rounded-2xl bg-slate-50 px-4 py-4">
								<p className="font-semibold text-slate-900">{label}</p>
								<p className="mt-1 text-sm text-slate-500">Target: {due}</p>
							</div>
						))}
					</div>
				</article>
			</section>
		</div>
	);
}
