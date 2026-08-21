import { buildAdminBeUrl } from '@/lib/admin-api-client';

const configuredBackendOrigin = (() => {
  const configuredUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    return new URL(configuredUrl || buildAdminBeUrl('')).origin;
  } catch {
    return '';
  }
})();

export function resolveMediaUrl(url: string) {
  if (!url) {
    return url;
  }

  if (/^(data:|blob:)/i.test(url)) {
    return url;
  }

  try {
    const parsedUrl = new URL(url, configuredBackendOrigin || window.location.origin);

    if (
      configuredBackendOrigin &&
      (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1')
    ) {
      const backendUrl = new URL(configuredBackendOrigin);
      parsedUrl.protocol = backendUrl.protocol;
      parsedUrl.host = backendUrl.host;
    }

    if (parsedUrl.pathname.startsWith('/images/')) {
      return parsedUrl.pathname + parsedUrl.search;
    }

    if (parsedUrl.pathname.startsWith('/uploads/') || parsedUrl.pathname.startsWith('/storage/')) {
      return parsedUrl.pathname + parsedUrl.search;
    }

    return url;
  } catch {
    return url;
  }
}