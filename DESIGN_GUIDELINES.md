# Desa Jadimulya Frontend Design Guideline

## Tujuan

Dokumen ini menjelaskan standar desain dan coding untuk frontend proyek Desa Jadimulya. Tujuannya agar semua pengembangan selanjutnya konsisten dan mudah di-scale.

## Palet Warna

- Primer: Biru Pangandaran / sky-600
- Sekunder: blue-700
- Netral Gelap: #0f172a
- Netral Terang: #f8fafc
- Aksen: #ffffff
- Bayangan: rgba(15, 23, 42, 0.08)

## Tipografi

- Font utama: Inter, system-ui, sans-serif
- Heading: berat font `semibold` atau `bold`
- Body: berat font `normal`
- Spasi antar paragraf: `leading-7` atau `leading-8`

## Komponen UI

- Semua kartu menggunakan: `rounded-[2rem]`, `border`, `shadow-sm`, `bg-white`
- Tombol utama: `rounded-full`, `bg-sky-600`, `text-white`
- Tombol sekunder: `rounded-full`, `border border-slate-200`, `bg-white`
- Section header: judul besar + subtitle kecil + tautan aksi

## Arah Visual PRD V3

- Seluruh tampilan mengikuti palet biru muda Pangandaran secara konsisten.
- Elemen aksen publik dan admin memakai nuansa sky/blue, bukan hijau.
- Fitur newsletter email dihapus dari desain.

## Struktur Folder

- `app/`: halaman utama dan routing
- `app/components/`: komponen UI reusable
- `app/sections/`: section halaman untuk home dan konten utama
- `lib/`: tipe data dan helper
- `public/images/`: aset gambar statis

## Pola Coding

- Gunakan TypeScript dengan tipe eksplisit
- Pisahkan data dummy ke `lib/*` atau `data/*`
- Komponen presentasi hanya menerima props dan tidak memiliki side effect
- Section dan page menggunakan komponen kecil yang dapat diuji secara terpisah

## Kriteria Scalable

- Komponen harus reusable, misalnya `FeatureCard`, `NewsCard`, `SectionHeader`
- Data halaman dipisah dari logika presentasi
- Komponen admin panel dibuat dengan struktur `app/admin/*`
- Nilai style ditampung di Tailwind utility dan hanya custom CSS minimal di `globals.css`

## Standar Desain

- Prioritaskan konsistensi margin/padding: `px-4 sm:px-6 lg:px-8`
- Gunakan layout grid untuk section multi-kolom
- Pastikan semua teks mudah dibaca dengan kontras yang baik
- Tambahkan button call-to-action di section utama

## Notes

Jika ingin fitur baru, buat dulu `lib/types.ts` dan `lib/api.ts` sebelum menambahkan komponen baru.

## Peningkatan Guidelines UI/UX (Revisi V3 - Pangandaran Theme)

### 1. Prinsip Copywriting Publik (Citizen-Centric Tone)

- **Hindari Jargon Pengembang**: Dilarang menampilkan istilah teknis seperti "API", "Backend", "Endpoint", atau "Fallback" di antarmuka publik.
- **Pesan Status Ramah**:
  - _Salah_: "Data tidak dikirim oleh API."
  - _Benar_: "Data sedang dalam proses pembaruan oleh Pemerintah Desa."
- **Nomenklatur Resmi**: Gunakan istilah kependudukan baku Indonesia (contoh: _Kepala Keluarga, Jiwa, Mata Pencaharian, Sebaran Dusun_).

### 2. Standar Kartu Ringkasan (Metric Cards)

- Setiap kartu metrik statistik **wajib dilengkapi**:
  1. Ikon visual SVG minimalis dengan latar `bg-sky-50`.
  2. Label kategori dalam huruf kapital tipis (`text-xs font-bold uppercase tracking-wider`).
  3. Badge penjelasan tambahan berbentuk _pill badge_ (`rounded-full px-2.5 py-0.5`).

### 3. Visualisasi Data & Chart Dynamic Fallback

- **Aturan Grafis Gender (Conic Gradient)**: Sudut kemiringan _pie/donut chart_ wajib dihitung dinamis dari rasio data riil, bukan nilai statis.
- **Warna Progress Bar**: Gunakan `bg-sky-600` untuk data kependudukan utama, dan `bg-sky-500` untuk data sekunder (pekerjaan/usia). Jangan gunakan warna hijau atau oranye tajam.
- **Kondisi Data Kosong (Empty State)**: Selalu sediakan wadah kosong bergaris putus-putus (`border-dashed border-slate-200 bg-slate-50`) dengan teks informatif ramah warga.
