import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminTopNav from "@/app/components/AdminTopNav";
import { ADMIN_AUTH_COOKIE } from "@/lib/admin-auth";
import { adminNavItems } from "@/lib/admin-nav";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	async function logoutAction() {
		"use server";

		cookies().delete(ADMIN_AUTH_COOKIE);
		redirect("/admin/login");
	}

	return (
		<div className="min-h-screen bg-[#f5f7f3] text-slate-900">
			<div className="w-full">
				<div className="sticky top-0 z-20 border-b border-slate-200 bg-white/96 px-4 py-4 backdrop-blur sm:px-5 sm:py-5 lg:px-6 lg:py-6">
					<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-6">
						<div className="flex min-w-0 flex-col gap-4 xl:flex-1 xl:flex-row xl:items-center xl:gap-5">
							<Link
								href="/admin"
								className="flex items-center gap-3 text-slate-900"
							>
								<span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_16px_28px_-16px_rgba(5,150,105,0.75)]">
									<svg
										viewBox="0 0 24 24"
										className="h-6 w-6"
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
									<p className="text-xl font-semibold text-slate-900">
										Lumina Desa
									</p>
									<p className="text-xs uppercase tracking-[0.18em] text-slate-500">
										CMS Jadimulya
									</p>
								</div>
							</Link>

							<AdminTopNav items={adminNavItems} />
						</div>

						<div className="flex items-center gap-1.5 self-end xl:self-auto">
							<Link
								href="/"
								className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100/80 bg-white/90 text-slate-600 shadow-[0_10px_20px_-18px_rgba(15,23,42,0.22)] transition hover:border-emerald-200 hover:text-emerald-700"
								title="Lihat situs publik"
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
							</Link>
							<button
								type="button"
								className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100/80 bg-white/90 text-slate-600 shadow-[0_10px_20px_-18px_rgba(15,23,42,0.22)] transition hover:border-emerald-200 hover:text-emerald-700"
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
							<form action={logoutAction}>
								<button
									type="submit"
									className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-700 to-teal-700 px-4 py-2.5 text-sm font-medium text-white shadow-[0_14px_24px_-18px_rgba(5,150,105,0.75)] transition hover:from-emerald-800 hover:to-teal-800"
								>
									Keluar
								</button>
							</form>
						</div>
					</div>
				</div>

				<main className="px-4 py-5 sm:px-5 sm:py-6 lg:px-6 lg:py-7">
					{children}
				</main>
			</div>
		</div>
	);
}
