export type SejarahMilestone = {
  year: string;
  event: string;
  imageUrl?: string;
};

export type SejarahContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  visiTitle: string;
  visiDescription: string;
  originTitle: string;
  originSubtitle: string;
  originParagraphs: string[];
  expansionTitle: string;
  expansionSubtitle: string;
  currentDusunTitle: string;
  currentDusunSubtitle: string;
  dusunSaatIni: string[];
  milestones: SejarahMilestone[];
};

export const SEJARAH_STORAGE_KEY = 'jadimulya_sejarah_content';

export const initialSejarahContent: SejarahContent = {
  heroEyebrow: 'Napak Tilas Jadimulya',
  heroTitle: 'Dari Dua Lembur Menjadi Desa yang Tangguh dan Terus Bertumbuh',
  heroDescription:
    'Sejarah Desa Jadimulya bukan sekadar catatan tahun. Ini adalah kisah kesepakatan, kerja bersama, dan semangat warga yang menjaga identitas desa sambil menata masa depan. Dari pembentukan tahun 1928 hingga pemekaran wilayah, setiap fase menjadi pijakan untuk pelayanan publik yang lebih kuat hari ini.',
  visiTitle: 'Visi Desa',
  visiDescription:
    'Terwujudnya Desa Jadimulya yang mandiri, sejahtera, berdaya saing, dan berlandaskan gotong royong dalam pelayanan publik.',
  originTitle: 'Asal-usul Desa Jadimulya',
  originSubtitle: 'Terbentuk dari musyawarah masyarakat yang menyatukan Lembur Jajaway dan Lembur Jumleng.',
  originParagraphs: [
    'Pada masa pendudukan Belanda, tokoh masyarakat dari dua wilayah bersepakat membentuk satu entitas pemerintahan desa. Tahun 1928 menjadi tonggak resmi lahirnya Desa Jadimulya dengan kepemimpinan awal oleh Bp. Marta Sasmita sebagai Kuwu pertama.',
    'Pada awal pembentukannya, wilayah Desa Jadimulya meliputi Dusun Jumleng, Dusun Cigintung, Dusun Ciranto, Dusun Jajaway, dan Dusun Wangkalronyok.',
  ],
  expansionTitle: 'Infografik Pemekaran Wilayah',
  expansionSubtitle: 'Visual ringkas perkembangan wilayah berdasarkan dokumen sejarah Desa Jadimulya.',
  currentDusunTitle: 'Wilayah Dusun Saat Ini',
  currentDusunSubtitle: 'Lima wilayah dusun aktif sebagai ruang pelayanan, pembinaan, dan pengembangan masyarakat.',
  dusunSaatIni: ['Dusun Ciranto', 'Dusun Cisagu', 'Dusun Mulyasari', 'Dusun Sidikmulya', 'Dusun Parinenggang'],
  milestones: [
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
  ],
};

export function loadStoredSejarahContent() {
  if (typeof window === 'undefined') {
    return initialSejarahContent;
  }

  const rawValue = window.localStorage.getItem(SEJARAH_STORAGE_KEY);

  if (!rawValue) {
    return initialSejarahContent;
  }

  try {
    const parsed = JSON.parse(rawValue) as SejarahContent;
    return parsed ? { ...initialSejarahContent, ...parsed } : initialSejarahContent;
  } catch {
    return initialSejarahContent;
  }
}

export function saveSejarahContent(content: SejarahContent) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(SEJARAH_STORAGE_KEY, JSON.stringify(content));
}