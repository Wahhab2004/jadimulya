export type OrganisasiGroup =
  | 'kepala-desa'
  | 'sekretaris-desa'
  | 'ketua-bpd'
  | 'kaur-kasi'
  | 'kepala-dusun'
  | 'staf';

export type OrganisasiMember = {
  id: string;
  name: string;
  position: string;
  group: OrganisasiGroup;
  photoUrl?: string;
  contact: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    facebook?: string;
  };
};

export const ORGANISASI_STORAGE_KEY = 'jadimulya_organisasi_members';

export const initialOrganisasiMembers: OrganisasiMember[] = [
  {
    id: 'org-1',
    name: 'H. Karsidi, S.Pd., M.Pd.',
    position: 'Kepala Desa',
    group: 'kepala-desa',
    photoUrl: '/images/karsidi-kades.jpeg',
    contact: {
      email: 'kepaladesa@jadimulya.id',
      phone: '+62 812-3456-7890',
      whatsapp: '+62 812-3456-7890',
      facebook: 'https://facebook.com/pemdes.jadimulya',
    },
  },
  {
    id: 'org-2',
    name: 'Sudrajat',
    position: 'Sekretaris Desa',
    group: 'sekretaris-desa',
    photoUrl: '/images/sudrajat-sekdes.jpeg',
    contact: {
      email: 'sekdes@jadimulya.id',
      phone: '+62 812-3456-7891',
      whatsapp: '+62 812-3456-7891',
    },
  },
  {
    id: 'org-3',
    name: 'Tatang Rohmat',
    position: 'Ketua BPD',
    group: 'ketua-bpd',
    photoUrl: '/images/person-placeholder.svg',
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      facebook: '',
    },
  },
  {
    id: 'org-4',
    name: 'Ahroli Hendriana',
    position: 'Kasi Pelayanan',
    group: 'kaur-kasi',
    photoUrl: '/images/person-placeholder.svg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-5',
    name: 'Anen',
    position: 'Kasi Kesejahteraan',
    group: 'kaur-kasi',
    photoUrl: '/images/person-placeholder.svg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-6',
    name: 'Karsid',
    position: 'Kasi Pemerintahan',
    group: 'kaur-kasi',
    photoUrl: '/images/person-placeholder.svg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-7',
    name: 'Hendaryat, S.IP.',
    position: 'Kaur Perencanaan',
    group: 'kaur-kasi',
    photoUrl: '/images/hendaryat-kaur-perencanaan.jpeg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-8',
    name: 'Lia Mulyani, S.E.',
    position: 'Kaur Umum',
    group: 'kaur-kasi',
    photoUrl: '/images/person-placeholder.svg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-9',
    name: 'Sri Wulansari, S.Pust.',
    position: 'Kaur Keuangan',
    group: 'kaur-kasi',
    photoUrl: '/images/wulan.jpeg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-10',
    name: 'Didin',
    position: 'Kepala Dusun Ciranto',
    group: 'kepala-dusun',
    photoUrl: '/images/person-placeholder.svg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-11',
    name: 'Aman Kostaman, A.Md.',
    position: 'Kepala Dusun Cisagu',
    group: 'kepala-dusun',
    photoUrl: '/images/aman-kadus-cisagu.jpeg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-12',
    name: 'Ahya',
    position: 'Kepala Dusun Mulyasari',
    group: 'kepala-dusun',
    photoUrl: '/images/ahya-kadus-mulyasari.jpeg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-13',
    name: 'Mira Sumirah',
    position: 'Kepala Dusun Sidikmulya',
    group: 'kepala-dusun',
    photoUrl: '/images/mira-kadus-sidikmulya.jpeg',
    contact: { whatsapp: '' },
  },
  {
    id: 'org-14',
    name: 'Otih Rohainah',
    position: 'Kepala Dusun Parinenggang',
    group: 'kepala-dusun',
    photoUrl: '/images/person-placeholder.svg',
    contact: { whatsapp: '' },
  },
];

function isOrganisasiGroup(value: unknown): value is OrganisasiGroup {
  return (
    value === 'kepala-desa' ||
    value === 'sekretaris-desa' ||
    value === 'ketua-bpd' ||
    value === 'kaur-kasi' ||
    value === 'kepala-dusun' ||
    value === 'staf'
  );
}

export function loadStoredOrganisasiMembers() {
  if (typeof window === 'undefined') {
    return initialOrganisasiMembers;
  }

  const rawValue = window.localStorage.getItem(ORGANISASI_STORAGE_KEY);
  if (!rawValue) {
    return initialOrganisasiMembers;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return initialOrganisasiMembers;
    }

    const items = parsed
      .map((item) => {
        if (!item || typeof item !== 'object') {
          return null;
        }

        const candidate = item as Record<string, unknown>;
        if (
          typeof candidate.id !== 'string' ||
          typeof candidate.name !== 'string' ||
          typeof candidate.position !== 'string' ||
          !isOrganisasiGroup(candidate.group)
        ) {
          return null;
        }

        const contactRaw = candidate.contact;
        const contact = contactRaw && typeof contactRaw === 'object' ? (contactRaw as Record<string, unknown>) : {};

        return {
          id: candidate.id,
          name: candidate.name,
          position: candidate.position,
          group: candidate.group,
          photoUrl: typeof candidate.photoUrl === 'string' ? candidate.photoUrl : '',
          contact: {
            email: typeof contact.email === 'string' ? contact.email : '',
            phone: typeof contact.phone === 'string' ? contact.phone : '',
            whatsapp: typeof contact.whatsapp === 'string' ? contact.whatsapp : '',
            facebook: typeof contact.facebook === 'string' ? contact.facebook : '',
          },
        } satisfies OrganisasiMember;
      })
      .filter((item): item is OrganisasiMember => item !== null);

    return items.length > 0 ? items : initialOrganisasiMembers;
  } catch {
    return initialOrganisasiMembers;
  }
}

export function saveOrganisasiMembers(members: OrganisasiMember[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ORGANISASI_STORAGE_KEY, JSON.stringify(members));
}
