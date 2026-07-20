"use client";

import { useEffect, useState } from 'react';
import { ADMIN_TOAST_EVENT, type AdminToastPayload } from '@/lib/admin-toast';

type ToastItem = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

const toneClass: Record<ToastItem['type'], string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
};

export default function AdminToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(event: Event) {
      const customEvent = event as CustomEvent<AdminToastPayload>;
      const detail = customEvent.detail;
      if (!detail || !detail.message) {
        return;
      }

      const nextToast: ToastItem = {
        id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        message: detail.message,
        type: detail.type ?? 'info',
      };

      setToasts((current) => [...current, nextToast]);

      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== nextToast.id));
      }, 3200);
    }

    window.addEventListener(ADMIN_TOAST_EVENT, onToast);
    return () => window.removeEventListener(ADMIN_TOAST_EVENT, onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-[0_10px_24px_-20px_rgba(15,23,42,0.65)] ${toneClass[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
