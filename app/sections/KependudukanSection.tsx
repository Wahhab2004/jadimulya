import SectionTitle from '../components/SectionTitle';
import type { KependudukanData } from '@/lib/types';

type KependudukanSectionProps = {
  kependudukan: KependudukanData;
};

export default function KependudukanSection({ kependudukan }: KependudukanSectionProps) {
  const items = [
    { label: 'Jumlah KK', value: kependudukan.households },
    { label: 'Jumlah RT', value: kependudukan.rtCount },
    { label: 'Jumlah RW', value: kependudukan.rwCount },
    { label: 'Anak', value: kependudukan.children },
    { label: 'Dewasa', value: kependudukan.adults },
    { label: 'Lansia', value: kependudukan.seniors },
  ];

  return (
    <section id="kependudukan" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title="Kependudukan" subtitle="Data administratif dan distribusi penduduk Desa Jadimulya." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
