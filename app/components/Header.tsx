import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-slate-900">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/10">🏡</span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900/70">Desa Jadimulya</p>
            <p className="text-base font-semibold text-slate-900">Portal Desa</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <Link href="/" className="transition hover:text-slate-900">Beranda</Link>
          <Link href="/struktur" className="transition hover:text-slate-900">Struktur</Link>
          <Link href="/sejarah" className="transition hover:text-slate-900">Sejarah</Link>
          <Link href="/potensi" className="transition hover:text-slate-900">Potensi</Link>
          <Link href="/statistik" className="transition hover:text-slate-900">Statistik</Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button type="button" className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
            <span className="mr-2">🔍</span>
            Cari
          </button>
          <Link href="/admin" className="inline-flex h-11 items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-500">
            Masuk Aparatur
          </Link>
        </div>
      </div>
    </header>
  );
}
