import type { StatItem } from "@/lib/homeData";

type HeroSectionProps = {
	title: string;
	subtitle: string;
	actions: { label: string; href: string }[];
	stats: StatItem[];
};

export default function HeroSection({
	title,
	subtitle,
	actions,
	stats,
}: HeroSectionProps) {
	return (
		<section className="relative overflow-hidden bg-[url('/images/hero-bg.jpg')] bg-cover bg-center text-white shadow-inner">
			<div className="absolute inset-0 bg-slate-900/60" />
			<div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
				<div className="max-w-3xl">
					<span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/90">
						Selamat Datang di Portal Resmi
					</span>
					<h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
						{title}
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100/90">
						{subtitle}
					</p>
					<div className="mt-10 flex flex-col gap-3 sm:flex-row">
						{actions.map((action) => (
							<a
								key={action.label}
								href={action.href}
								className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-800/30 transition hover:bg-emerald-500"
							>
								{action.label}
							</a>
						))}
					</div>
				</div>
				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{stats.map((item) => (
						<div
							key={item.label}
							className="rounded-3xl border border-white/20 bg-slate-950/50 p-6 backdrop-blur-sm"
						>
							<p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200/80">
								{item.label}
							</p>
							<p className="mt-4 text-3xl font-semibold text-white">
								{item.value}
							</p>
							{item.note ? (
								<p className="mt-2 text-sm text-slate-200/80">{item.note}</p>
							) : null}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
