"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  initialPopulationDataset,
  loadStoredPopulationDataset,
  savePopulationDataset,
  summarizeFromDusun,
  type OccupationItem,
  type PopulationDataset,
} from '@/lib/population-store';
import { showAdminToast } from '@/lib/admin-toast';

const emptyOccupation: Omit<OccupationItem, 'id'> = { label: '', value: 0 };

export default function AdminDemografiPage() {
  const [dataset, setDataset] = useState<PopulationDataset>(initialPopulationDataset);
  const [occupationForm, setOccupationForm] = useState(emptyOccupation);
  const [editingOccupationId, setEditingOccupationId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setDataset(loadStoredPopulationDataset());
  }, []);

  const totalOccupation = useMemo(
    () => dataset.occupations.reduce((acc, item) => acc + item.value, 0),
    [dataset.occupations]
  );

  function saveSummary() {
    if (dataset.summary.male + dataset.summary.female !== dataset.summary.totalPopulation) {
      setNotice('Validasi gagal: total penduduk harus sama dengan laki-laki + perempuan.');
      return;
    }

    const nextDataset = {
      ...dataset,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setDataset(nextDataset);
    savePopulationDataset(nextDataset);
    const message = 'Data ringkasan demografi berhasil disimpan.';
    setNotice(message);
    showAdminToast(message, 'success');
  }

  function syncSummaryFromDusun() {
    const syncedSummary = summarizeFromDusun(dataset.dusun);
    const nextDataset = {
      ...dataset,
      summary: syncedSummary,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setDataset(nextDataset);
    savePopulationDataset(nextDataset);
    const message = 'Ringkasan disinkronkan dari data per dusun.';
    setNotice(message);
    showAdminToast(message, 'success');
  }

  function saveOccupation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const label = occupationForm.label.trim();
    if (!label) {
      setNotice('Nama jenis pekerjaan wajib diisi.');
      return;
    }

    if (occupationForm.value < 0) {
      setNotice('Nilai jenis pekerjaan tidak boleh negatif.');
      return;
    }

    const duplicated = dataset.occupations.some(
      (item) => item.label.toLowerCase() === label.toLowerCase() && item.id !== editingOccupationId
    );

    if (duplicated) {
      setNotice('Jenis pekerjaan sudah ada. Gunakan label lain.');
      return;
    }

    const nextOccupations = editingOccupationId
      ? dataset.occupations.map((item) =>
          item.id === editingOccupationId ? { ...item, label, value: Math.round(occupationForm.value) } : item
        )
      : [
          ...dataset.occupations,
          { id: `job-${Date.now()}`, label, value: Math.round(occupationForm.value) },
        ];

    const nextDataset = {
      ...dataset,
      occupations: nextOccupations,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setDataset(nextDataset);
    savePopulationDataset(nextDataset);
    setOccupationForm(emptyOccupation);
    setEditingOccupationId(null);
    const message = editingOccupationId ? 'Jenis pekerjaan berhasil diperbarui.' : 'Jenis pekerjaan berhasil ditambahkan.';
    setNotice(message);
    showAdminToast(message, 'success');
  }

  function removeOccupation(id: string) {
    const confirmed = window.confirm('Hapus jenis pekerjaan ini?');
    if (!confirmed) {
      return;
    }

    const nextOccupations = dataset.occupations.filter((item) => item.id !== id);
    const nextDataset = {
      ...dataset,
      occupations: nextOccupations,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setDataset(nextDataset);
    savePopulationDataset(nextDataset);
    if (editingOccupationId === id) {
      setEditingOccupationId(null);
      setOccupationForm(emptyOccupation);
    }
    const message = 'Jenis pekerjaan berhasil dihapus.';
    setNotice(message);
    showAdminToast(message, 'success');
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Modul Demografi</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Kelola Ringkasan dan Jenis Pekerjaan</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base">
          Fitur disesuaikan dengan backend: ringkasan penduduk, data per dusun, dan distribusi jenis pekerjaan.
        </p>
        {notice ? <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">{notice}</div> : null}
      </section>

      <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold text-slate-900">Ringkasan Demografi</h3>
          <button
            type="button"
            onClick={syncSummaryFromDusun}
            className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
          >
            Sinkron dari Data Dusun
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Total Penduduk</span>
            <input
              type="number"
              min={0}
              value={dataset.summary.totalPopulation}
              onChange={(event) =>
                setDataset((current) => ({
                  ...current,
                  summary: { ...current.summary, totalPopulation: Math.max(0, Number(event.target.value) || 0) },
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Kepala Keluarga</span>
            <input
              type="number"
              min={0}
              value={dataset.summary.households}
              onChange={(event) =>
                setDataset((current) => ({
                  ...current,
                  summary: { ...current.summary, households: Math.max(0, Number(event.target.value) || 0) },
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Laki-laki</span>
            <input
              type="number"
              min={0}
              value={dataset.summary.male}
              onChange={(event) =>
                setDataset((current) => ({
                  ...current,
                  summary: { ...current.summary, male: Math.max(0, Number(event.target.value) || 0) },
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Perempuan</span>
            <input
              type="number"
              min={0}
              value={dataset.summary.female}
              onChange={(event) =>
                setDataset((current) => ({
                  ...current,
                  summary: { ...current.summary, female: Math.max(0, Number(event.target.value) || 0) },
                }))
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-sky-300"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">Update terakhir: {dataset.updatedAt}</p>
          <button
            type="button"
            onClick={saveSummary}
            className="rounded-full bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white transition hover:from-sky-700 hover:to-blue-800"
          >
            Simpan Ringkasan
          </button>
        </div>
      </section>

      <section>
        <section className="rounded-[1.6rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_44px_-30px_rgba(15,23,42,0.35)] backdrop-blur lg:rounded-[2rem] lg:p-6">
          <h3 className="text-xl font-semibold text-slate-900">Jenis Pekerjaan</h3>
          <p className="mt-1 text-sm text-slate-600">Total data pekerjaan saat ini: {totalOccupation.toLocaleString('id-ID')} jiwa</p>

          <form onSubmit={saveOccupation} className="mt-4 grid gap-2 sm:grid-cols-[1fr_160px_auto]">
            <input
              type="text"
              placeholder="Nama pekerjaan"
              value={occupationForm.label}
              onChange={(event) => setOccupationForm((current) => ({ ...current, label: event.target.value }))}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-sky-300"
            />
            <input
              type="number"
              min={0}
              value={occupationForm.value}
              onChange={(event) => setOccupationForm((current) => ({ ...current, value: Math.max(0, Number(event.target.value) || 0) }))}
              className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-sky-300"
            />
            <button type="submit" className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-800">
              {editingOccupationId ? 'Update' : 'Tambah'}
            </button>
          </form>

          <div className="mt-4 space-y-2">
            {dataset.occupations.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Belum ada data jenis pekerjaan. Tambahkan data agar grafik publik dapat ditampilkan.
              </div>
            ) : (
              dataset.occupations.map((item) => (
                <article key={item.id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-slate-600">{item.value.toLocaleString('id-ID')} jiwa</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingOccupationId(item.id);
                        setOccupationForm({ label: item.label, value: item.value });
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOccupation(item.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700"
                    >
                      Hapus
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
