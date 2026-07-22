import { NextRequest, NextResponse } from 'next/server';
import { getBackendApiBaseUrl } from '@/lib/admin-auth';

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

async function forwardToBackend(request: NextRequest, context: RouteContext) {
  const backendUrl = buildBackendUrl(request, context.params.path);
  return NextResponse.redirect(backendUrl, { status: 307 });
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
