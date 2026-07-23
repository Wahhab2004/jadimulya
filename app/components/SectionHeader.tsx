type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  linkLabel?: string;
  linkHref?: string;
};

export default function SectionHeader({ title, subtitle, linkLabel, linkHref }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-3 max-w-2xl text-slate-600">{subtitle}</p> : null}
      </div>
      {linkLabel && linkHref ? (
        <a href={linkHref} className="inline-flex items-center rounded-full border border-sky-200 bg-white px-5 py-3 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 hover:border-sky-300">
          {linkLabel}
        </a>
      ) : null}
    </div>
  );
}
