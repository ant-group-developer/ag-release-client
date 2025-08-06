import { DEFAULT_ROUTE } from '@/enums/routes';
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        returnTo: DEFAULT_ROUTE,
    }),
});
