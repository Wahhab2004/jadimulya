import Image from 'next/image';

type FeatureCardProps = {
  category: string;
  title: string;
  description: string;
  imageUrl?: string;
};

export default function FeatureCard({ category, title, description, imageUrl }: FeatureCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-60 overflow-hidden bg-slate-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">{category}</span>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    </article>
  );
}
