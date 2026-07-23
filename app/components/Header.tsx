"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/", label: "Beranda" },
	{ href: "/struktur", label: "Struktur" },
	{ href: "/sejarah", label: "Sejarah" },
	{ href: "/potensi", label: "Potensi" },
	{ href: "/statistik", label: "Statistik" },
];

export default function Header() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	return (
		<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
			<div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
				<Link href="/" className="flex items-center gap-3 text-slate-900">
					<span className="grid h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
						<Image
							src="/images/logo-pangandaran.svg"
							alt="Kabupaten Pangandaran"
							width={48}
							height={48}
							className="h-full w-full object-cover"
							priority
						/>
					</span>
					<div>
						<p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900/70">
							Desa Jadimulya
						</p>
						<p className="text-base font-semibold text-slate-900">
							Portal Desa
						</p>
					</div>
				</Link>

				<nav className="hidden items-center gap-2 text-sm font-medium md:flex">
					{navItems.map((item) => {
						const isActive =
							item.href === "/"
								? pathname === "/"
								: pathname.startsWith(item.href);

						return (
							<Link
								key={item.href}
								href={item.href}
								aria-current={isActive ? "page" : undefined}
								className={`group relative rounded-full px-4 py-2 transition ${
									isActive
										? "bg-sky-50 text-sky-800 shadow-[inset_0_0_0_1px_rgba(56,189,248,0.24)]"
										: "text-slate-700 hover:bg-sky-50 hover:text-sky-800"
								}`}
							>
								{item.label}
								<span
									className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-sky-600 transition ${
										isActive
											? "scale-x-100"
											: "scale-x-0 group-hover:scale-x-100"
									}`}
								/>
							</Link>
						);
					})}
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					<Link
						href="/admin"
						className="inline-flex h-11 items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500"
					>
						Masuk Aparatur
					</Link>
				</div>

				<div className="ml-auto flex items-center gap-2 md:hidden">
					<button
						type="button"
						onClick={() => setIsMenuOpen((value) => !value)}
						className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
						aria-expanded={isMenuOpen}
						aria-label="Buka menu navigasi"
					>
						<svg
							viewBox="0 0 24 24"
							className="h-5 w-5"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.9"
							aria-hidden="true"
						>
							{isMenuOpen ? (
								<path d="M6 6l12 12M18 6 6 18" />
							) : (
								<path d="M4 7h16M4 12h16M4 17h16" />
							)}
						</svg>
					</button>
				</div>

				<div className={`w-full md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
					<div className="mt-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.28)]">
						<nav className="grid gap-1">
							{navItems.map((item) => {
								const isActive =
									item.href === "/"
										? pathname === "/"
										: pathname.startsWith(item.href);

								return (
									<Link
										key={item.href}
										href={item.href}
										aria-current={isActive ? "page" : undefined}
										className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
											isActive
												? "bg-sky-50 text-sky-800"
												: "text-slate-700 hover:bg-sky-50 hover:text-sky-800"
										}`}
									>
										<span>{item.label}</span>
										<span
											className={`h-2 w-2 rounded-full bg-sky-600 transition ${isActive ? "opacity-100" : "opacity-0"}`}
											aria-hidden="true"
										/>
									</Link>
								);
							})}
							<Link
								href="/admin"
								className="mt-1 inline-flex items-center justify-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500"
							>
								Masuk Aparatur
							</Link>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
}
