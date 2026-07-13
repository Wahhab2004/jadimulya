type AdminModuleFeature = {
  title: string;
  description: string;
};

type AdminModuleShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  features: AdminModuleFeature[];
  children?: React.ReactNode;
};

export default function AdminModuleShell({ eyebrow, title, description, features, children }: AdminModuleShellProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </section>

      {children ? children : null}
    </div>
  );
}