type NewsCardProps = {
  tag: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
};

export default function NewsCard({ tag, title, date, description, imageUrl }: NewsCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
        )}
        <span className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 shadow-sm">
          {tag}
        </span>
      </div>
      <div className="space-y-3 p-6">
        <p className="text-sm text-slate-500">{date}</p>
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-slate-600">{description}</p>
      </div>
    </article>
  );
}
