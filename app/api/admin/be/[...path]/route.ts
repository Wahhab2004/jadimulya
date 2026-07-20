import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
  getBackendApiBaseUrl,
  hasAdminAccessToken,
} from '@/lib/admin-auth';

type RouteContext = {
  params: {
    path: string[];
  };
};

function buildBackendUrl(request: NextRequest, path: string[]) {
  const baseUrl = getBackendApiBaseUrl().replace(/\/+$/, '');
  const backendUrl = new URL(`${baseUrl}/${path.join('/')}`);

  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  return backendUrl;
}

async function refreshAccessToken(refreshToken: string) {
  const refreshUrl = `${getBackendApiBaseUrl().replace(/\/+$/, '')}/auth/refresh`;
  const refreshRes = await fetch(refreshUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  if (!refreshRes.ok) {
    return null;
  }

  const payload = (await refreshRes.json()) as {
    success?: boolean;
    data?: {
      accessToken?: string;
    };
  };

  const nextAccessToken = payload?.data?.accessToken;
  return nextAccessToken && nextAccessToken.trim().length > 0 ? nextAccessToken : null;
}

async function forwardToBackend(request: NextRequest, context: RouteContext) {
  const accessToken = request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(ADMIN_REFRESH_TOKEN_COOKIE)?.value;

  if (!hasAdminAccessToken(accessToken)) {
    return NextResponse.json({ success: false, message: 'Tidak terautentikasi' }, { status: 401 });
  }

  const backendUrl = buildBackendUrl(request, context.params.path);
  const requestBody = request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();

  const runRequest = async (token: string) =>
    fetch(backendUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: requestBody,
      cache: 'no-store',
    });

  let backendRes = await runRequest(accessToken);
  let refreshedAccessToken: string | null = null;

  if (backendRes.status === 401 && refreshToken) {
    refreshedAccessToken = await refreshAccessToken(refreshToken);
    if (refreshedAccessToken) {
      backendRes = await runRequest(refreshedAccessToken);
    }
  }

  const raw = await backendRes.text();
  const response = new NextResponse(raw, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('content-type') ?? 'application/json',
    },
  });

  if (refreshedAccessToken) {
    response.cookies.set(ADMIN_ACCESS_TOKEN_COOKIE, refreshedAccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60,
    });
  }

  return response;
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forwardToBackend(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forwardToBackend(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return forwardToBackend(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return forwardToBackend(request, context);
}
