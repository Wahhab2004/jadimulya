export interface OrgMember {
  id: string;
  name: string;
  position: string;
  photoUrl?: string;
  level: number;
  colorTheme: 'green' | 'blue' | 'teal' | 'orange';
  parentId: string | null;
  nip?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
}

const photo = (seed: string) => `https://picsum.photos/seed/${seed}/500/500`;

export const strukturOrganisasi: OrgMember[] = [
  {
    id: '1',
    name: 'H. Karsidi, S.Pd., M.Pd.',
    position: 'Kepala Desa',
    photoUrl: photo('kepala-desa'),
    level: 1,
    colorTheme: 'green',
    parentId: null,
    nip: '19740512 201211 1 002',
    contact: { email: 'kepaladesa@jadimulya.id', phone: '+62 812-3456-7890' },
  },
  {
    id: '2',
    name: 'Sudrajat',
    position: 'Sekretaris Desa',
    photoUrl: photo('sekretaris-desa'),
    level: 2,
    colorTheme: 'blue',
    parentId: '1',
    nip: '19800517 200812 1 003',
    contact: { email: 'sekdes@jadimulya.id', phone: '+62 812-3456-7891' },
  },
  {
    id: '3',
    name: 'Ahroli Hendriana',
    position: 'Kasi Pelayanan',
    photoUrl: photo('ahroli-hendriana'),
    level: 3,
    colorTheme: 'teal',
    parentId: '1',
    nip: '19870611 201503 1 001',
  },
  {
    id: '4',
    name: 'Anen',
    position: 'Kasi Kesejahteraan',
    photoUrl: photo('anen'),
    level: 3,
    colorTheme: 'teal',
    parentId: '1',
  },
  {
    id: '5',
    name: 'Karsid',
    position: 'Kasi Pemerintahan',
    photoUrl: photo('karsid'),
    level: 3,
    colorTheme: 'teal',
    parentId: '1',
  },
  {
    id: '6',
    name: 'Hendaryat, S.IP.',
    position: 'Kaur Perencanaan',
    photoUrl: photo('hendaryat'),
    level: 4,
    colorTheme: 'teal',
    parentId: '2',
  },
  {
    id: '7',
    name: 'Lia Mulyani, S.E.',
    position: 'Kaur Umum',
    photoUrl: photo('lia-mulyani'),
    level: 4,
    colorTheme: 'teal',
    parentId: '2',
  },
  {
    id: '8',
    name: 'Sri Wulansari, S.Pust.',
    position: 'Kaur Keuangan',
    photoUrl: photo('sri-wulansari'),
    level: 4,
    colorTheme: 'teal',
    parentId: '2',
  },
  {
    id: '9',
    name: 'Didin',
    position: 'Kepala Dusun Ciranto',
    photoUrl: photo('didin'),
    level: 5,
    colorTheme: 'orange',
    parentId: '1',
  },
  {
    id: '10',
    name: 'Aman Kostaman, A.Md.',
    position: 'Kepala Dusun Cisagu',
    photoUrl: photo('aman-kostaman'),
    level: 5,
    colorTheme: 'orange',
    parentId: '1',
  },
  {
    id: '11',
    name: 'Ahya',
    position: 'Kepala Dusun Mulyasari',
    photoUrl: photo('ahya'),
    level: 5,
    colorTheme: 'orange',
    parentId: '1',
  },
  {
    id: '12',
    name: 'Mira Sumirah',
    position: 'Kepala Dusun Sidikmulya',
    photoUrl: photo('mira'),
    level: 5,
    colorTheme: 'orange',
    parentId: '1',
  },
  {
    id: '13',
    name: 'Otih Rohainah',
    position: 'Kepala Dusun Parinenggang',
    photoUrl: photo('otih-rohainah'),
    level: 5,
    colorTheme: 'orange',
    parentId: '1',
  },
  {
    id: '14',
    name: 'Irawan, S.T.',
    position: 'Staff Keuangan',
    photoUrl: photo('irawan'),
    level: 6,
    colorTheme: 'teal',
    parentId: '8',
  },
];
