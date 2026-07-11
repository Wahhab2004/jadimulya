type StatItem = {
  label: string;
  value: string | number;
};

type StatGridProps = {
  items: StatItem[];
};

export default function StatGrid({ items }: StatGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
