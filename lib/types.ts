export type OrganisasiItem = {
  id: string;
  name: string;
  position: string;
  photoUrl?: string;
};

export type PotensiItem = {
  id: string;
  title: string;
  description: string;
  category: 'UMKM' | 'Pertanian' | 'Wisata' | 'Lainnya';
  imageUrl?: string;
};

export type DemografiData = {
  totalPopulation: number;
  male: number;
  female: number;
  ageGroups: {
    label: string;
    value: number;
  }[];
  mainOccupations: {
    label: string;
    value: number;
  }[];
};

export type KependudukanData = {
  households: number;
  rtCount: number;
  rwCount: number;
  children: number;
  adults: number;
  seniors: number;
};

export type SejarahData = {
  title: string;
  content: string;
  milestones?: {
    year: string;
    description: string;
  }[];
};
