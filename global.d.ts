import en from './messages/en.json';

type Messages = typeof en;

declare global {
    // Use type safe message keys with `next-intl`
    interface IntlMessages extends Messages {}
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            tenantId: string;
        };
        error?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        error?: string;
    }
}
