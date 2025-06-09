import { auth0 } from '@/lib/auth0';

export const getAccessToken = async () => {
    try {
        const { token: accessToken } = await auth0.getAccessToken();
        return accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};
