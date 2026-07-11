type CardProps = {
  title: string;
  description: string;
  footer?: string;
};

export default function Card({ title, description, footer }: CardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-slate-600">{description}</p>
      {footer ? <p className="mt-4 text-sm text-slate-500">{footer}</p> : null}
    </article>
  );
}
