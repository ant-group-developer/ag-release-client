import { getAccessToken as getAccessTokenAuth0 } from '@auth0/nextjs-auth0/edge';
import { NextRequest, NextResponse } from 'next/server';

export const getAccessToken = async (req: NextRequest) => {
    try {
        // Create a new response that Auth0 can modify
        const res = NextResponse.next();
        const { accessToken } = await getAccessTokenAuth0(req, res);
        return accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};
