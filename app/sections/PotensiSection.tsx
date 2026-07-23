import SectionTitle from '../components/SectionTitle';
import type { PotensiItem } from '@/lib/types';

type PotensiSectionProps = {
  potensi: PotensiItem[];
};

export default function PotensiSection({ potensi }: PotensiSectionProps) {
  return (
    <section id="potensi" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title="Potensi Desa" subtitle="Pertanian dan pariwisata unggulan Desa Jadimulya." />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {potensi.map((item) => (
          <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">{item.category}</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-3 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
