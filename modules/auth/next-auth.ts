import { REFRESH_FAILED_MESSAGE } from '@/api/axios-auth';
import { APP_ROUTES } from '@/enums/routes';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from './api';
import { getDataFromToken } from './utils';

// ===== Helpers =====
const REFRESH_SKEW_MS = 60_000; // Refresh when <= 60s remains

function expMsFromJwt(accessToken?: string): number {
    if (!accessToken) return 0;
    const payload = getDataFromToken(accessToken);
    const expSec = (payload?.exp as number) || 0;
    return expSec * 1000;
}

async function maybeRefresh(token: any) {
    const expMs = token.accessTokenExp ?? expMsFromJwt(token.accessToken);
    const now = Date.now();

    if (token.error) return token;

    if (now <= expMs - REFRESH_SKEW_MS) return token;

    try {
        const res = await authApi.refreshToken({
            refreshToken: token.refreshToken,
        });
        const data = res.data.data;

        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken ?? token.refreshToken; // keep old if API doesn't rotate
        token.accessTokenExp = expMsFromJwt(token.accessToken);

        token.error = undefined;
    } catch (error: any) {
        console.log('callbacks refresh error:', error?.message || error);
        token.error = REFRESH_FAILED_MESSAGE;
    }

    return token;
}

async function switchTenantServerSide(accessToken: string, tenantId: string) {
    const res = await authApi.switchTenant(accessToken, {
        tenantId,
    });
    return res.data.data;
}

// ===== Auth options =====
export const authOptions: NextAuthOptions = {
    // 1) Provider đăng nhập bằng email/password
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            // @ts-ignore
            async authorize(credentials) {
                try {
                    const res = await authApi.signin({
                        email: credentials!.email,
                        password: credentials!.password,
                    });
                    const data = res.data.data;
                    // Khi login thành công, trả về đối tượng user chứa token
                    return {
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                    };
                } catch (err: any) {
                    console.log('err:', err);
                    const errorMessage =
                        err.response?.data?.messageCode ||
                        err.messageCode ||
                        err.response?.data?.message ||
                        err.message ||
                        'Authentication failed';
                    throw new Error(errorMessage);
                }
            },
        }),
    ],

    // 2) Sử dụng JSON Web Tokens cho session
    session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },

    // 3) Callback để lưu token vào JWT và session
    callbacks: {
        // Mỗi lần jwt được tạo/refresh
        async jwt({ token, user, trigger, session }) {
            // Lần đầu login
            if (user) {
                // @ts-ignore
                token.accessToken = (user as any).accessToken as string;
                // @ts-ignore
                token.refreshToken = (user as any).refreshToken as string;
                // Lưu exp (ms) để tránh decode nhiều lần
                // @ts-ignore
                token.accessTokenExp = expMsFromJwt((user as any).accessToken);

                token.error = undefined;
                return token;
            }

            // Xử lý đổi workspace: gọi bằng session.update({ tenantId })
            if (
                trigger === 'update' &&
                session?.tenantId &&
                session.tenantId !== (token as any).tenantId
            ) {
                try {
                    // đảm bảo accessToken hiện tại còn hạn trước khi gọi switch
                    await maybeRefresh(token);

                    const switched = await switchTenantServerSide(
                        String((token as any).accessToken),
                        String(session.tenantId)
                    );

                    // Cập nhật token sau khi switch
                    // @ts-ignore
                    token.accessToken = switched.accessToken;
                    // @ts-ignore
                    token.refreshToken =
                        switched.refreshToken ?? (token as any).refreshToken;
                    // @ts-ignore
                    token.accessTokenExp = expMsFromJwt(switched.accessToken);

                    token.error = undefined;
                } catch (error: any) {
                    console.log(
                        'switch-tenant error:',
                        error?.message || error
                    );
                    // Không đổi tenantId nếu lỗi; UI có thể đọc session.error
                    // @ts-ignore
                    token.error = 'SWITCH_TENANT_FAILED';
                }
                return token;
            }

            // Luồng bình thường: tự động refresh nếu sắp hết hạn
            await maybeRefresh(token);

            return token;
        },

        // Truyền accessToken/tenantId vào session trả về cho client
        async session({ session, token }) {
            const { accessToken, error, tenantId, refreshTokenExp } =
                token as any;

            const accessTokenData = getDataFromToken(accessToken);
            if (accessTokenData) {
                session.user = {
                    id: accessTokenData.sub,
                    tenantId: accessTokenData.tenantId,
                } as any;
            }

            // Nếu muốn: KHÔNG đưa accessToken xuống client, dùng route proxy server-side để gọi API
            // (session as any).accessToken = accessToken;

            (session as any).error = error;
            return session;
        },
    },

    // 4) Bảo mật
    // secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,

    // 5) Custom pages and redirects
    pages: {
        signIn: APP_ROUTES.SIGN_IN,
        error: APP_ROUTES.SIGN_IN, // Redirect to signin page on error
    },
};
