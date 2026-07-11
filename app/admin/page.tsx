import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Admin Panel Desa Jadimulya</h1>
          <p className="mt-3 text-slate-600">Kelola konten halaman publik: organisasi, sejarah, potensi, demografi, dan kependudukan.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/organisasi" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-base font-semibold text-slate-900 transition hover:bg-white">
              Struktur Organisasi
            </Link>
            <Link href="/admin/sejarah" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-base font-semibold text-slate-900 transition hover:bg-white">
              Sejarah Desa
            </Link>
            <Link href="/admin/potensi" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-base font-semibold text-slate-900 transition hover:bg-white">
              Potensi Desa
            </Link>
            <Link href="/admin/demografi" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-base font-semibold text-slate-900 transition hover:bg-white">
              Demografi
            </Link>
            <Link href="/admin/kependudukan" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-base font-semibold text-slate-900 transition hover:bg-white">
              Kependudukan
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
