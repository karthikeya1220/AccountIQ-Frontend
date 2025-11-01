import { NextRequest, NextResponse } from 'next/server';

// Backend URL - will be replaced by server-side env or fall back to localhost
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.proxy, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.proxy, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.proxy, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.proxy, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ proxy: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.proxy, 'PATCH');
}

async function proxyRequest(
  request: NextRequest,
  proxyPath: string[] | undefined,
  method: string
) {
  try {
    // Validate proxy path
    if (!proxyPath || proxyPath.length === 0) {
      return NextResponse.json(
        { error: 'Invalid proxy path' },
        { status: 400 }
      );
    }

    // Reconstruct the backend URL
    // Note: BACKEND_URL already includes /api, so we don't append it again
    const path = proxyPath.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const backendUrl = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

    // Get request body for methods that support it
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const text = await request.text();
        body = text || undefined;
      } catch {
        body = undefined;
      }
    }

    // Forward headers (excluding some that should not be forwarded)
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Skip host and connection headers
      if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    console.log(`[Proxy] ${method} ${backendUrl}`);
    console.log(`[Proxy] Authorization header: ${headers.get('authorization') ? '✓ Present' : '✗ Missing'}`);

    // Make request to backend
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      // Don't follow redirects automatically
      redirect: 'manual',
    });

    // Get response body
    const responseBody = await response.text();

    console.log(`[Proxy] Response ${response.status} from ${backendUrl}`);

    // Create response with same status
    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy relevant response headers
    response.headers.forEach((value, key) => {
      // Skip headers that Next.js handles
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        nextResponse.headers.set(key, value);
      }
    });

    return nextResponse;
  } catch (error: any) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json(
      { 
        error: 'Proxy error', 
        message: error.message || 'Failed to connect to backend',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 502 }
    );
  }
}
