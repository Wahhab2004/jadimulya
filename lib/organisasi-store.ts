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

export function saveOrganisasiMembers(members: OrganisasiMember[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ORGANISASI_STORAGE_KEY, JSON.stringify(members));
}
