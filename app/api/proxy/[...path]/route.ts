import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = (process.env.API_URL ?? '').replace(/\/+$/, '');

export async function GET(
    req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return proxy(req, params);
}
export async function POST(
    req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return proxy(req, params);
}
export async function PUT(
    req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return proxy(req, params);
}
export async function DELETE(
    req: NextRequest,
    { params }: { params: { path: string[] } }
) {
    return proxy(req, params);
}

async function proxy(req: NextRequest, { path }: { path: string[] }) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // if (!token?.accessToken)
    //     return new NextResponse('Unauthorized', { status: 401 });

    const url = `${API_BASE}/${path.join('/')}`;
    const init: RequestInit = {
        method: req.method,
        headers: {
            'Content-Type':
                req.headers.get('content-type') ?? 'application/json',
            Authorization: `Bearer ${String(token?.accessToken)}`,
        },
        body: ['GET', 'HEAD'].includes(req.method)
            ? undefined
            : await req.text(),
    };

    const res = await fetch(url, init);
    const body = await res.arrayBuffer();
    const headers = Object.fromEntries(res.headers);
    delete headers['content-encoding']; // tránh double decode
    return new NextResponse(body, { status: res.status, headers });
}
