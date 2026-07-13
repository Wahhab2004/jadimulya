export const statistikSummary = [
  { label: 'Total Penduduk', value: '4,281', note: '+2.4% vs tahun lalu', noteClass: 'text-emerald-700' },
  { label: 'Kepala Keluarga', value: '1,142', note: 'Rata-rata 3.7 jiwa/KK', noteClass: 'text-sky-700' },
  { label: 'Laki-laki', value: '2,114', note: '49.4% dari populasi', noteClass: 'text-amber-700' },
  { label: 'Perempuan', value: '2,167', note: '50.6% dari populasi', noteClass: 'text-emerald-700' },
] as const;

export const ageGroups = [
  { label: '0-4', value: 320 },
  { label: '5-14', value: 580 },
  { label: '15-24', value: 710 },
  { label: '25-34', value: 840 },
  { label: '35-44', value: 690 },
  { label: '45-54', value: 520 },
  { label: '55-64', value: 390 },
  { label: '65+', value: 230 },
] as const;

export const educationStats = [
  { label: 'Tidak Sekolah', value: 0.08 },
  { label: 'SD', value: 0.42 },
  { label: 'SMP', value: 0.53 },
  { label: 'SMA/SMK', value: 0.69 },
  { label: 'Diploma', value: 0.36 },
  { label: 'Sarjana (S1)', value: 0.28 },
  { label: 'Pascasarjana', value: 0.09 },
] as const;

export const dataDusun = [
  { name: 'Dusun Krajan', kk: 342, male: 612, female: 630, total: 1242 },
  { name: 'Dusun Mekarsari', kk: 288, male: 524, female: 541, total: 1065 },
  { name: 'Dusun Sukamaju', kk: 310, male: 568, female: 582, total: 1150 },
  { name: 'Dusun Tanjung', kk: 202, male: 410, female: 414, total: 824 },
] as const;

export const genderDistribution = {
  male: 49.4,
  female: 50.6,
} as const;