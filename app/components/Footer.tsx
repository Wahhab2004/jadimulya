import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
					{/* Kolom 1: Profil & Alamat Desa */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-lg font-bold text-white shadow-md shadow-sky-900/40">
								J
							</div>
							<div>
								<p className="text-lg font-bold text-white leading-tight">
									Desa Jadimulya
								</p>
								<p className="text-xs font-semibold text-sky-400">
									Kabupaten Pangandaran
								</p>
							</div>
						</div>
						<p className="text-sm leading-relaxed text-slate-400">
							Jl. Raya Pusat Desa No. 01, Kec. Langkaplancar, Kab. Pangandaran,
							Jawa Barat 46391.
						</p>
						<div className="space-y-1.5 text-xs text-slate-400">
							<p>
								<strong className="text-slate-200">Email:</strong>{" "}
								pemdes@jadimulya.desa.id
							</p>
							<p>
								<strong className="text-slate-200">Telepon:</strong> (0265)
								123-4567
							</p>
						</div>
					</div>

					{/* Kolom 2: Tautan Cepat */}
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
							Tautan Cepat
						</p>
						<ul className="mt-4 space-y-2.5 text-sm">
							<li>
								<Link
									href="/sejarah"
									className="transition duration-200 hover:text-sky-300 hover:underline"
								>
									Sejarah Desa
								</Link>
							</li>
							<li>
								<Link
									href="/profil"
									className="transition duration-200 hover:text-sky-300 hover:underline"
								>
									Profil Perangkat Desa
								</Link>
							</li>
							<li>
								<Link
									href="/transparansi"
									className="transition duration-200 hover:text-sky-300 hover:underline"
								>
									Anggaran & APBD Desa
								</Link>
							</li>
							<li>
								<Link
									href="/potensi"
									className="transition duration-200 hover:text-sky-300 hover:underline"
								>
									Potensi & Wisata
								</Link>
							</li>
						</ul>
					</div>

					{/* Kolom 3: Layanan & Informasi Publik */}
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
							Informasi Publik
						</p>
						<ul className="mt-4 space-y-2.5 text-sm">
							<li>
								<Link
									href="/pengaduan"
									className="transition duration-200 hover:text-sky-300 hover:underline"
								>
									Pengaduan Warga
								</Link>
							</li>
							<li>
								<Link
									href="/ppid"
									className="transition duration-200 hover:text-sky-300 hover:underline"
								>
									Portal PPID Desa
								</Link>
							</li>
							<li>
								<Link
									href="/kebijakan-privasi"
									className="transition duration-200 hover:text-sky-300 hover:underline"
								>
									Kebijakan Privasi
								</Link>
							</li>
							<li>
								<Link
									href="/kontak"
									className="transition duration-200 hover:text-sky-300 hover:underline"
								>
									Hubungi Kami
								</Link>
							</li>
						</ul>
					</div>

					{/* Kolom 4: Jam Layanan Operasional Kantor Desa */}
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
							Jam Layanan Kantor
						</p>
						<div className="mt-4 space-y-2 text-xs text-slate-300">
							<div className="flex justify-between border-b border-slate-800/80 pb-1.5">
								<span>Senin – Kamis</span>
								<span className="font-semibold text-white">
									08.00 – 15.30 WIB
								</span>
							</div>
							<div className="flex justify-between border-b border-slate-800/80 pb-1.5">
								<span>Jumat</span>
								<span className="font-semibold text-white">
									08.00 – 11.30 WIB
								</span>
							</div>
							<div className="flex justify-between pb-1">
								<span>Sabtu – Minggu</span>
								<span className="font-semibold text-rose-400">Libur</span>
							</div>
						</div>

						{/* Banner Ringkas Pelayanan */}
						<div className="mt-5 rounded-2xl border border-sky-500/20 bg-sky-950/40 p-3.5 backdrop-blur-sm">
							<div className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
								<p className="text-xs font-bold text-sky-200">
									Pelayanan Prima Warga
								</p>
							</div>
							<p className="mt-1 text-[11px] text-slate-400 leading-normal">
								Siap melayani kebutuhan administrasi dan informasi masyarakat
								Desa Jadimulya secara ramah & transparan.
							</p>
						</div>
					</div>
				</div>

				{/* Bottom Bar: Copyright & Legal */}
				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row text-xs text-slate-500">
					<p>© 2026 Pemerintah Desa Jadimulya. Seluruh Hak Cipta Dilindungi.</p>
					<div className="flex gap-6">
						<Link
							href="/peta-situs"
							className="transition hover:text-slate-300"
						>
							Peta Situs
						</Link>
						<Link
							href="/kebijakan-privasi"
							className="transition hover:text-slate-300"
						>
							Privasi
						</Link>
						<Link
							href="/syarat-ketentuan"
							className="transition hover:text-slate-300"
						>
							Syarat & Ketentuan
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
