type OrgMemberCardProps = {
  name: string;
  position: string;
  photoUrl?: string;
};

export default function OrgMemberCard({ name, position, photoUrl }: OrgMemberCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full bg-slate-100">
        {photoUrl ? <img src={photoUrl} alt={name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">Foto</div>}
      </div>
      <p className="font-semibold text-slate-900">{name}</p>
      <p className="mt-1 text-sm text-slate-600">{position}</p>
    </div>
  );
}
