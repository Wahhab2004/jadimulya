"use client";

import { useRef, useState } from 'react';
import { exportCmsBackup, importCmsBackup } from '@/lib/cms-backup';
import { showAdminToast } from '@/lib/admin-toast';

export default function AdminPengaturanPage() {
  const [notice, setNotice] = useState('');
  const importInputRef = useRef<HTMLInputElement | null>(null);

  function handleExport() {
    const backup = exportCmsBackup();
    if (!backup) {
      const message = 'Gagal export backup.';
      setNotice(message);
      showAdminToast(message, 'error');
      return;
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `jadimulya-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);

    const message = 'Backup JSON berhasil diexport.';
    setNotice(message);
    showAdminToast(message, 'success');
  }

  async function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const confirmed = window.confirm('Import backup akan menimpa data CMS saat ini di browser ini. Lanjutkan?');
    if (!confirmed) {
      event.target.value = '';
      return;
    }

    const text = await file.text();
    const result = importCmsBackup(text);
    setNotice(result.message);
    showAdminToast(result.message, result.ok ? 'success' : 'error');
    event.target.value = '';
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Pengaturan CMS</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Backup dan Restore Data CMS</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
          Gunakan fitur ini untuk export semua data CMS dari localStorage ke file JSON dan import kembali saat dibutuhkan.
        </p>
        {notice ? <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">{notice}</div> : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
          <h3 className="text-xl font-semibold text-slate-900">Export Backup JSON</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Simpan snapshot seluruh data CMS ke file JSON agar bisa dipulihkan jika data browser terhapus.
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="mt-5 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:from-sky-700 hover:to-blue-800"
          >
            Export JSON
          </button>
        </article>

        <article className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
          <h3 className="text-xl font-semibold text-slate-900">Import Backup JSON</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Import file backup untuk mengembalikan data CMS sebelumnya. Tindakan ini akan menimpa data yang sedang aktif.
          </p>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="mt-5 rounded-full border border-sky-200 bg-sky-50 px-5 py-2.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
          >
            Import JSON
          </button>
        </article>
      </section>
    </div>
  );
}
