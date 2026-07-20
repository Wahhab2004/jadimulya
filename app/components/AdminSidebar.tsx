"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AdminNavItem } from '@/lib/admin-nav';

type AdminSidebarProps = {
  items: AdminNavItem[];
  mode?: 'desktop' | 'mobile';
};

const iconPaths: Record<AdminNavItem['icon'], string> = {
  dashboard: 'M4 5h16v5H4zM4 14h7v5H4zM13 14h7v5h-7z',
  organisasi: 'M12 4v4m0 0H7m5 0h5M7 8v5m10-5v5M4 18h6m4 0h6',
  potensi: 'M7 13c0 3 2 5 5 5m5-7c0 4-2 8-5 8V6c2 0 5 2 5 5ZM12 10c-2 0-5 2-5 5',
  sejarah: 'M7 5h10M7 9h10M7 13h6M5 3h14a2 2 0 0 1 2 2v14H3V5a2 2 0 0 1 2-2Z',
  demografi: 'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  news: 'M5 5h14v14H5zM8 9h8M8 13h5',
  media: 'M4 6h16v12H4zM9 10l2 2 4-4 3 4',
};

function isActivePath(pathname: string, item: AdminNavItem) {
  if (item.href === '/admin') {
    return pathname === '/admin';
  }

  return pathname.startsWith(item.href);
}

export default function AdminSidebar({ items, mode = 'desktop' }: AdminSidebarProps) {
  const pathname = usePathname();

  if (mode === 'mobile') {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white p-3 shadow-sm lg:hidden">
        <nav className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items
            .filter((item) => item.enabled)
            .map((item) => {
              const active = isActivePath(pathname, item);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? 'border-sky-600 bg-sky-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                    <path d={iconPaths[item.icon]} />
                  </svg>
                  {item.shortLabel ?? item.label}
                </Link>
              );
            })}
        </nav>
      </div>
    );
  }

  return (
    <nav className="space-y-1.5">
      {items.map((item) => {
        const active = item.enabled ? isActivePath(pathname, item) : false;

        const content = (
          <>
            <span
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                active
                  ? 'border-sky-500/30 bg-sky-500/20 text-sky-50'
                  : item.enabled
                    ? 'border-slate-200 bg-slate-100 text-slate-500 group-hover:border-sky-200 group-hover:text-sky-700'
                    : 'border-slate-200 bg-slate-100 text-slate-400'
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <path d={iconPaths[item.icon]} />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block truncate text-sm font-medium ${active ? 'text-white' : item.enabled ? 'text-slate-700' : 'text-slate-400'}`}>
                {item.label}
              </span>
              <span className={`mt-0.5 block truncate text-xs ${active ? 'text-sky-100' : item.enabled ? 'text-slate-500' : 'text-slate-400'}`}>
                {item.description}
              </span>
            </span>
            {item.phase === 'Next' ? (
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${active ? 'border-sky-300/40 text-sky-100' : 'border-sky-100 bg-sky-50 text-sky-700'}`}>
                Next
              </span>
            ) : null}
          </>
        );

        if (!item.enabled) {
          return (
            <div key={item.label} className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-3 py-3 opacity-85">
              {content}
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 transition ${
              active
                ? 'border-sky-500/30 bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-[0_14px_26px_-18px_rgba(37,99,235,0.9)]'
                : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-sm'
            }`}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
