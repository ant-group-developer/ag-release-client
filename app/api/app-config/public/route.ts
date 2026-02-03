import { NextRequest, NextResponse } from 'next/server';

const API_BASE = (process.env.API_URL ?? '').replace(/\/+$/, '');

export async function GET() {
    try {
        const url = `${API_BASE}/app-config/public`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch public settings' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
