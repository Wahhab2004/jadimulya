export default function Footer() {
	return (
		<footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
			<div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
				<div>
					<p className="text-lg font-semibold text-white">Desa Jadimulya</p>
					<p className="mt-4 text-sm leading-7 text-slate-400">
						Jl. Raya Pusat Desa No. 01, Kec. Jadimulya, Kab. Makmur Jaya, Jawa
						Barat 40552.
					</p>
					<p className="mt-4 text-sm text-slate-500">
						© 2026 Pemerintah Desa Jadimulya. Seluruh Hak Cipta Dilindungi.
					</p>
				</div>
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
						Tautan Cepat
					</p>
					<ul className="mt-5 space-y-3 text-sm text-slate-300">
						<li>
							<a href="#" className="transition hover:text-white">
								Peta Situs
							</a>
						</li>
						<li>
							<a href="#" className="transition hover:text-white">
								Profil Perangkat Desa
							</a>
						</li>
						<li>
							<a href="#" className="transition hover:text-white">
								Anggaran Pendapatan
							</a>
						</li>
						<li>
							<a href="#" className="transition hover:text-white">
								Portal PPID
							</a>
						</li>
					</ul>
				</div>
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
						Informasi Publik
					</p>
					<ul className="mt-5 space-y-3 text-sm text-slate-300">
						<li>
							<a href="#" className="transition hover:text-white">
								Kebijakan Privasi
							</a>
						</li>
						<li>
							<a href="#" className="transition hover:text-white">
								Syarat & Ketentuan
							</a>
						</li>
						<li>
							<a href="#" className="transition hover:text-white">
								Kontak Kami
							</a>
						</li>
						<li>
							<a href="#" className="transition hover:text-white">
								Pengaduan Warga
							</a>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	);
}
