import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/app/components/AdminSidebar";
import AdminToastHost from "@/app/components/AdminToastHost";
import {
	ADMIN_ACCESS_TOKEN_COOKIE,
	ADMIN_CLIENT_ACCESS_TOKEN_COOKIE,
	ADMIN_REFRESH_TOKEN_COOKIE,
} from "@/lib/admin-auth";
import { adminNavItems } from "@/lib/admin-nav";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	async function logoutAction() {
		"use server";

		cookies().delete(ADMIN_ACCESS_TOKEN_COOKIE);
		cookies().delete(ADMIN_CLIENT_ACCESS_TOKEN_COOKIE);
		cookies().delete(ADMIN_REFRESH_TOKEN_COOKIE);
		redirect("/admin/login");
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100 text-slate-900">
			<AdminToastHost />
			<div className="mx-auto flex w-full max-w-[1700px] gap-4 p-4 sm:p-5 lg:gap-5 lg:p-6">
				<aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[320px] shrink-0 rounded-[2rem] border border-sky-100 bg-white/95 p-4 shadow-[0_28px_50px_-30px_rgba(30,64,175,0.35)] backdrop-blur lg:flex lg:flex-col">
					<Link
						href="/admin"
						className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 p-3"
					>
						<span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-[0_16px_28px_-16px_rgba(37,99,235,0.9)]">
							<svg
								viewBox="0 0 24 24"
								className="h-5 w-5"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.9"
								aria-hidden="true"
							>
								<path d="M4 20h16" />
								<path d="M6 20V9l6-5 6 5v11" />
								<path d="M9 20v-5h6v5" />
							</svg>
						</span>
						<div>
							<p className="text-lg font-semibold text-slate-900">
								CMS Jadimulya
							</p>
							<p className="text-xs uppercase tracking-[0.18em] text-slate-500">
								Admin Panel
							</p>
						</div>
					</Link>

					<p className="mt-5 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
						Menu Admin
					</p>
					<div className="mt-3 flex-1 overflow-y-auto pr-1">
						<AdminSidebar items={adminNavItems} />
					</div>

					<div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
						<Link
							href="/"
							className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
						>
							<svg
								viewBox="0 0 24 24"
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.9"
								aria-hidden="true"
							>
								<path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
							</svg>
							Lihat Situs Publik
						</Link>
						<form action={logoutAction}>
							<button
								type="submit"
								className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:from-sky-700 hover:to-blue-800"
							>
								Keluar
							</button>
						</form>
					</div>
				</aside>

				<div className="min-w-0 flex-1 space-y-4">
					<header className="rounded-[1.7rem] border border-sky-100 bg-white/95 px-4 py-4 shadow-[0_18px_36px_-28px_rgba(30,64,175,0.35)] backdrop-blur sm:px-5 sm:py-5 lg:px-6">
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
									Tahap 1 Aktif
								</p>
								<h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
									Kelola Potensi dan Sejarah Desa
								</h1>
							</div>
							<div className="flex items-center gap-2">
								<button
									type="button"
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
									title="Notifikasi"
								>
									<svg
										viewBox="0 0 24 24"
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.9"
										aria-hidden="true"
									>
										<path d="M6 8a6 6 0 0 1 12 0v4l2 3H4l2-3V8Z" />
										<path d="M10 18a2 2 0 0 0 4 0" />
									</svg>
								</button>
								<form action={logoutAction} className="lg:hidden">
									<button
										type="submit"
										className="rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-medium text-white"
									>
										Keluar
									</button>
								</form>
							</div>
						</div>
					</header>

					<AdminSidebar items={adminNavItems} mode="mobile" />

					<main>{children}</main>
				</div>
			</div>
		</div>
	);
}
