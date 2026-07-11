type SidebarLink = {
  label: string;
  href: string;
  active?: boolean;
};

type SidebarNavProps = {
  links: SidebarLink[];
};

export default function SidebarNav({ links }: SidebarNavProps) {
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 rounded-[2rem] bg-white p-6 shadow-sm lg:block">
      <nav className="space-y-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`block rounded-3xl px-4 py-3 text-sm font-semibold transition ${
              link.active ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
