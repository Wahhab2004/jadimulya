import SectionHeader from '../components/SectionHeader';
import type { FeatureItem, NewsItem } from '@/lib/homeData';
import FeatureCard from '../components/FeatureCard';
import NewsCard from '../components/NewsCard';

type HomepageOverviewProps = {
  features: FeatureItem[];
  news: NewsItem[];
};

export default function HomepageOverview({ features, news }: HomepageOverviewProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title="Potensi Desa Unggulan" subtitle="Kekayaan alam dan kreativitas warga yang menjadi pilar ekonomi mandiri Desa Jadimulya." linkLabel="Lihat Potensi Lengkap" linkHref="/potensi" />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-6">
          {features.slice(0, 2).map((feature) => (
            <FeatureCard key={feature.id} category={feature.category} title={feature.title} description={feature.description} imageUrl={feature.imageUrl} />
          ))}
        </div>
        <div className="space-y-6">
          <FeatureCard category={features[2].category} title={features[2].title} description={features[2].description} imageUrl={features[2].imageUrl} />
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Program Digitalisasi Desa</h3>
            <p className="mt-4 text-slate-600">Kami menerapkan sistem “Smart Village” untuk mempermudah akses pelayanan publik dan pemasaran produk UMKM desa.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#" className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">Cek Portal Layanan</a>
              <a href="#" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">Unduh Katalog Potensi (PDF)</a>
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
              tag={article.tag}
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
