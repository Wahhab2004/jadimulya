import Link from 'next/link';

export default function AdminKependudukanPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Kelola Kependudukan</h1>
              <p className="mt-3 text-slate-600">Update data KK, RT/RW, dan kategori umur penduduk.</p>
            </div>
            <Link href="/admin" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-white">
              Kembali ke Admin
            </Link>
          </div>
          <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-slate-600">Halaman admin kependudukan sudah siap sebagai struktur. Backend integration dapat ditambahkan selanjutnya.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
