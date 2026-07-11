import SectionTitle from '../components/SectionTitle';
import StatGrid from '../components/StatGrid';
import type { DemografiData } from '@/lib/types';

type DemografiSectionProps = {
  demografi: DemografiData;
};

export default function DemografiSection({ demografi }: DemografiSectionProps) {
  const summaryItems = [
    { label: 'Jumlah Penduduk', value: demografi.totalPopulation },
    { label: 'Laki-laki', value: demografi.male },
    { label: 'Perempuan', value: demografi.female },
  ];

  return (
    <section id="demografi" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title="Demografi" subtitle="Informasi dasar demografi dan pekerjaan utama warga desa." />
      <StatGrid items={summaryItems} />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Kelompok Usia</h3>
          <div className="mt-5 space-y-4">
            {demografi.ageGroups.map((group) => (
              <div key={group.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-800">{group.label}</span>
                <span className="font-semibold text-slate-900">{group.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Pekerjaan Utama</h3>
          <div className="mt-5 space-y-4">
            {demografi.mainOccupations.map((occupation) => (
              <div key={occupation.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-slate-800">{occupation.label}</span>
                <span className="font-semibold text-slate-900">{occupation.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
