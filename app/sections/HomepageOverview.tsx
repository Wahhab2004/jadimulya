import SectionHeader from '../components/SectionHeader';
import type { HomepageNewsItem } from '@/lib/homepage-store';
import type { PotensiItem } from '@/lib/potensi-store';
import FeatureCard from '../components/FeatureCard';
import NewsCard from '../components/NewsCard';

type HomepageOverviewProps = {
  features: PotensiItem[];
  news: HomepageNewsItem[];
};

export default function HomepageOverview({ features, news }: HomepageOverviewProps) {
  const primaryFeatures = features.slice(0, 2);
  const tertiaryFeature = features[2];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title="Potensi Desa Unggulan" subtitle="Kekuatan sektor pertanian dan pariwisata sebagai prioritas pengembangan desa." linkLabel="Lihat Potensi Lengkap" linkHref="/potensi" />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-6">
          {primaryFeatures.map((feature) => (
            <FeatureCard key={feature.id} category={feature.category} title={feature.title} description={feature.description} imageUrl={feature.imageUrl} />
          ))}
        </div>
        <div className="space-y-6">
          {tertiaryFeature ? (
            <FeatureCard category={tertiaryFeature.category} title={tertiaryFeature.title} description={tertiaryFeature.description} imageUrl={tertiaryFeature.imageUrl} />
          ) : null}
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Program Digitalisasi Desa</h3>
            <p className="mt-4 text-slate-600">Akses informasi desa dipusatkan dalam portal resmi agar warga mudah menemukan data penting secara cepat.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/potensi" className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">Jelajahi Potensi Desa</a>
              <a href="#" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">Unduh Katalog Potensi (PDF/Docs)</a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <SectionHeader title="Warta Desa Terkini" subtitle="Informasi terbaru dari Desa Jadimulya untuk masyarakat dan pemangku kepentingan." />
        <div className="grid gap-6 md:grid-cols-3">
          {news.map((article) => (
            <NewsCard
              key={article.id}
              tag={article.category}
              title={article.title}
              date={article.date}
              description={article.description}
              imageUrl={article.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
