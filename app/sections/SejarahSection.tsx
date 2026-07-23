import SectionTitle from '../components/SectionTitle';
import type { SejarahData } from '@/lib/types';

type SejarahSectionProps = {
  sejarah: SejarahData;
};

export default function SejarahSection({ sejarah }: SejarahSectionProps) {
  return (
    <section id="sejarah" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title="Sejarah Desa" subtitle="Kelompokkan perjalanan Desa Jadimulya sejak awal hingga kini." />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-2xl font-semibold text-slate-900">{sejarah.title}</h3>
          <p className="mt-4 leading-8 text-slate-700">{sejarah.content}</p>
        </div>
        {sejarah.milestones?.length ? (
          <div className="space-y-4">
            {sejarah.milestones.map((item) => (
              <div key={item.year} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">{item.year}</p>
                <p className="mt-3 text-slate-700">{item.description}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
