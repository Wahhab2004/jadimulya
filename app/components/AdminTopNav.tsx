"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AdminNavItem } from '@/lib/admin-nav';

type AdminTopNavProps = {
  items: AdminNavItem[];
};

export default function AdminTopNav({ items }: AdminTopNavProps) {
  const pathname = usePathname();

  const iconPaths: Record<string, string> = {
    Dashboard: 'M3 12h18M12 3v18',
    Statistik: 'M4 19V9m5 10V5m5 14v-8m5 8V7',
    Demografi: 'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
    Penduduk: 'M5 5h14v14H5zM9 9h6M9 13h6',
    Organisasi: 'M12 4v4m0 0H7m5 0h5M7 8v5m10-5v5M4 18h6m4 0h6',
    Potensi: 'M7 13c0 3 2 5 5 5m5-7c0 4-2 8-5 8V6c2 0 5 2 5 5ZM12 10c-2 0-5 2-5 5',
    Sejarah: 'M7 5h10M7 9h10M7 13h6M5 3h14a2 2 0 0 1 2 2v14H3V5a2 2 0 0 1 2-2Z',
    Pengaturan: 'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8Zm8 4l-2.2.8a7.7 7.7 0 0 1-.6 1.5l1 2-2 2-2-1a7.7 7.7 0 0 1-1.5.6L12 20l-1.7-2.1a7.7 7.7 0 0 1-1.5-.6l-2 1-2-2 1-2a7.7 7.7 0 0 1-.6-1.5L4 12l2.2-.8a7.7 7.7 0 0 1 .6-1.5l-1-2 2-2 2 1a7.7 7.7 0 0 1 1.5-.6L12 4l1.7 2.1a7.7 7.7 0 0 1 1.5.6l2-1 2 2-1 2c.27.48.47.98.6 1.5L20 12Z',
  };

  return (
    <div className="min-w-0 flex-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <nav className="flex min-w-max items-center gap-1 rounded-full border border-emerald-100/80 bg-white/90 p-1 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.28)] backdrop-blur">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const iconKey = item.shortLabel ?? item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_16px_24px_-18px_rgba(5,150,105,0.9)]'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
                <path d={iconPaths[iconKey] ?? iconPaths.Dashboard} />
              </svg>
              {item.shortLabel ?? item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}