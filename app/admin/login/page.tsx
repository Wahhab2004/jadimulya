import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_CLIENT_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  getBackendApiBaseUrl,
} from '@/lib/admin-auth';

type AdminLoginPageProps = {
  searchParams?: {
    next?: string;
    error?: string;
  };
};

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  async function loginAction(formData: FormData) {
    'use server';

    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const nextPath = String(formData.get('next') ?? '/admin');
    const safeNextPath = nextPath.startsWith('/admin') ? nextPath : '/admin';

    try {
      const res = await fetch(`${getBackendApiBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        cache: 'no-store',
      });

      if (!res.ok) {
        redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNextPath)}`);
      }

      const payload = (await res.json()) as {
        success?: boolean;
        data?: {
          accessToken?: string;
          refreshToken?: string;
        };
      };

      const accessToken = payload?.data?.accessToken;
      const refreshToken = payload?.data?.refreshToken;

      if (!accessToken || !refreshToken) {
        redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNextPath)}`);
      }

      cookies().set(ADMIN_ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60,
      });

      cookies().set(ADMIN_CLIENT_ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: false,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60,
      });

      cookies().set(ADMIN_REFRESH_TOKEN_COOKIE, refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    } catch {
      redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNextPath)}`);
    }

    redirect(safeNextPath);
  }

  return (
    <section className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Akses Admin</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Masuk ke CMS Desa Jadimulya</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Login diperlukan untuk membuka modul organisasi, potensi, sejarah, demografi, berita, dan media desa.
      </p>

      {searchParams?.error ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Username atau password tidak cocok. Coba lagi.
        </div>
      ) : null}

      <form action={loginAction} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={searchParams?.next ?? '/admin'} />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            defaultValue="admin@jadimulya.desa.id"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            name="password"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-300"
            required
          />
        </label>

        <button type="submit" className="inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
          Masuk ke Admin Panel
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600">
        Demo backend seed: <span className="font-semibold text-slate-800">admin@jadimulya.desa.id</span> /{' '}
        <span className="font-semibold text-slate-800">ChangeMe123!</span>
      </div>
    </section>
  );
}