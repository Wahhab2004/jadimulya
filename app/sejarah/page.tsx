"use client";

import { useEffect, useState } from 'react';
import Footer from '@/app/components/Footer';
import Header from '@/app/components/Header';
import SectionHeader from '@/app/components/SectionHeader';

const sejarahMilestones = [
  {
    year: '1928',
    event:
      'Desa Jadimulya dibentuk dari penyatuan Lembur Jajaway dan Lembur Jumleng melalui kesepakatan tokoh masyarakat. Kuwu pertama: Bp. Marta Sasmita (1928-1931).',
  },
  {
    year: '1979',
    event:
      'Pemekaran tahap pertama: Dusun Jajaway dan Dusun Wangkalronyok membentuk Desa Jadikarya. Dusun Jumleng, Cigintung, dan Ciranto tetap di Desa Jadimulya sebagai desa induk.',
  },
  {
    year: '1997',
    event:
      'Pemekaran tahap kedua: Dusun Cigintung menjadi wilayah Desa Sukamulya. Dusun Jumleng dan Dusun Ciranto tetap dalam wilayah Desa Jadimulya.',
  },
  {
    year: 'Kini',
    event:
      'Wilayah dusun terus ditata: dari wilayah induk berkembang menjadi 5 dusun aktif, yaitu Ciranto, Cisagu, Mulyasari, Sidikmulya, dan Parinenggang.',
  },
];

const dusunSaatIni = ['Dusun Ciranto', 'Dusun Cisagu', 'Dusun Mulyasari', 'Dusun Sidikmulya', 'Dusun Parinenggang'];

const kepalaDesa = [
  { no: 1, nama: 'Marta Sasmita', masaJabatan: '1928-1931', keterangan: '-' },
  { no: 2, nama: 'Pura Sasmita', masaJabatan: '1931-1946', keterangan: '-' },
  { no: 3, nama: 'Suminta', masaJabatan: '1946-1955', keterangan: '-' },
  { no: 4, nama: 'D. Sumarno', masaJabatan: '1955-1967', keterangan: '-' },
  { no: 5, nama: 'Marta Dipura', masaJabatan: '1967-1974', keterangan: '-' },
  { no: 6, nama: 'H. Aceng Thoha', masaJabatan: '1974-1993', keterangan: '-' },
  { no: 7, nama: 'H. Naryo Suparyo', masaJabatan: '1993-2001', keterangan: '-' },
  { no: 8, nama: 'H. Idi Sutardi', masaJabatan: '2001-2011', keterangan: '-' },
  { no: 9, nama: 'Apan', masaJabatan: '2011-2018', keterangan: '-' },
  { no: 10, nama: 'Karsadi Sudrajat, S.IP', masaJabatan: '2018-2019', keterangan: 'Penjabat Sementara' },
  { no: 11, nama: 'Sori Somantri', masaJabatan: '2019-2019', keterangan: 'Penjabat Sementara' },
  { no: 12, nama: 'H. Karsidi, S.Pd., M.Pd', masaJabatan: '2019-sekarang', keterangan: '-' },
];

const daftarIsi = [
  { id: 'asal-usul', label: 'Asal-usul Desa' },
  { id: 'pemekaran', label: 'Pemekaran Wilayah' },
  { id: 'dusun-kini', label: 'Wilayah Dusun Kini' },
  { id: 'kepala-desa', label: 'Kepala Desa' },
];

const liniMasaUtama = [
  { year: '1928', label: 'Pembentukan Desa' },
  { year: '1979', label: 'Pemekaran Tahap I' },
  { year: '1997', label: 'Pemekaran Tahap II' },
  { year: 'Kini', label: '5 Dusun Aktif' },
];

export default function SejarahPage() {
  const [activeSection, setActiveSection] = useState(daftarIsi[0].id);

  useEffect(() => {
    const sectionIds = daftarIsi.map((item) => item.id);
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-22% 0px -58% 0px',
        threshold: [0.1, 0.25, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:hidden">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">Daftar Isi</p>
            <nav className="mt-3 flex flex-wrap gap-2">
              {daftarIsi.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Daftar Isi</p>
              <nav className="mt-4 space-y-1">
                {daftarIsi.map((item) => {
                  const isActive = activeSection === item.id;

                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block rounded-xl px-3 py-2 text-sm transition ${
                        isActive
                          ? 'bg-emerald-50 font-medium text-emerald-700'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                      aria-current={isActive ? 'location' : undefined}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Lini Masa Utama</p>
                <ol className="mt-4 space-y-4">
                  {liniMasaUtama.map((item) => (
                    <li key={item.year} className="flex gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.year}</p>
                        <p className="text-xs text-slate-600">{item.label}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>

          <div className="space-y-5 sm:space-y-6">
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Napak Tilas Jadimulya</p>
              <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Dari Dua Lembur Menjadi Desa yang Tangguh dan Terus Bertumbuh
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 sm:text-base sm:leading-8">
                Sejarah Desa Jadimulya bukan sekadar catatan tahun. Ini adalah kisah kesepakatan, kerja bersama, dan
                semangat warga yang menjaga identitas desa sambil menata masa depan. Dari pembentukan tahun 1928 hingga
                pemekaran wilayah, setiap fase menjadi pijakan untuk pelayanan publik yang lebih kuat hari ini.
              </p>
            </section>

            <section id="asal-usul" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <SectionHeader
                title="Asal-usul Desa Jadimulya"
                subtitle="Terbentuk dari musyawarah masyarakat yang menyatukan Lembur Jajaway dan Lembur Jumleng."
              />
              <p className="text-[15px] leading-7 text-slate-600 sm:text-base">
                Pada masa pendudukan Belanda, tokoh masyarakat dari dua wilayah bersepakat membentuk satu entitas
                pemerintahan desa. Tahun 1928 menjadi tonggak resmi lahirnya Desa Jadimulya dengan kepemimpinan awal
                oleh Bp. Marta Sasmita sebagai Kuwu pertama.
              </p>
              <p className="mt-4 text-[15px] leading-7 text-slate-600 sm:text-base">
                Pada awal pembentukannya, wilayah Desa Jadimulya meliputi Dusun Jumleng, Dusun Cigintung, Dusun
                Ciranto, Dusun Jajaway, dan Dusun Wangkalronyok.
              </p>
            </section>

            <section id="pemekaran" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <SectionHeader
                title="Infografik Pemekaran Wilayah"
                subtitle="Visual ringkas perkembangan wilayah berdasarkan dokumen sejarah Desa Jadimulya."
              />

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="mx-auto grid max-w-4xl gap-4 text-center">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Lembur Jumleng</div>
                    <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700">Lembur Jajaway</div>
                  </div>

                  <div className="mx-auto h-8 w-px bg-slate-300" aria-hidden="true" />

                  <div className="mx-auto rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 sm:text-base">
                    1928 - Desa Jadimulya
                  </div>

                  <div className="mx-auto h-8 w-px bg-slate-300" aria-hidden="true" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Desa Jadimulya (Induk)</p>
                      <p className="mt-1 text-xs text-slate-600">Jumleng, Cigintung, Ciranto</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">1979 - Desa Jadikarya</p>
                      <p className="mt-1 text-xs text-slate-600">Jajaway, Wangkalronyok</p>
                    </div>
                  </div>

                  <div className="mx-auto h-8 w-px bg-slate-300" aria-hidden="true" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">1997 - Desa Sukamulya</p>
                      <p className="mt-1 text-xs text-slate-600">Cigintung</p>
                    </div>
                    <div className="rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Desa Jadimulya (Induk)</p>
                      <p className="mt-1 text-xs text-slate-600">Jumleng, Ciranto</p>
                    </div>
                  </div>

                  <div className="mx-auto h-8 w-px bg-slate-300" aria-hidden="true" />

                  <div className="rounded-2xl border border-slate-300 bg-white px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">Struktur Dusun Desa Jadimulya Saat Ini</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {dusunSaatIni.map((dusun) => (
                        <span key={dusun} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                          {dusun}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {sejarahMilestones.map((item) => (
                  <article key={item.year} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">{item.year}</p>
                    <p className="mt-2 text-[15px] leading-7 text-slate-700 sm:text-base">{item.event}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="dusun-kini" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <SectionHeader
                title="Wilayah Dusun Saat Ini"
                subtitle="Lima wilayah dusun aktif sebagai ruang pelayanan, pembinaan, dan pengembangan masyarakat."
              />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dusunSaatIni.map((dusun) => (
                  <div key={dusun} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm font-medium text-emerald-800">
                    {dusun}
                  </div>
                ))}
              </div>
            </section>

            <section id="kepala-desa" className="scroll-mt-24 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-8">
              <SectionHeader
                title="Pejabat Kepala Desa Dari Masa ke Masa"
                subtitle="Rangkaian kepemimpinan desa sebagai jejak keberlanjutan pembangunan Jadimulya."
              />
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-slate-100 text-left text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold">No</th>
                      <th className="px-4 py-3 font-semibold">Nama</th>
                      <th className="px-4 py-3 font-semibold">Masa Jabatan</th>
                      <th className="px-4 py-3 font-semibold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kepalaDesa.map((item) => (
                      <tr key={item.no} className="border-t border-slate-200 bg-white text-slate-700">
                        <td className="px-4 py-3">{item.no}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{item.nama}</td>
                        <td className="px-4 py-3">{item.masaJabatan}</td>
                        <td className="px-4 py-3">{item.keterangan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
