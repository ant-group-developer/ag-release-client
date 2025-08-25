import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Session } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';

const TOKEN_EXPIRED_NAME = 'TokenExpiredError';
const TOKEN_ERROR_NAME = 'JsonWebTokenError';

export const REFRESH_FAILED_MESSAGE = 'RefreshFailed';

type AugmentedSession = Session & {
    accessToken?: string;
    error?: string;
};

const replacer = (_key: string, value: any) =>
    value === undefined ? null : value;

const config: AxiosRequestConfig = {
    baseURL: '/api/v1',
    headers: { 'Content-Type': 'application/json' },
    transformRequest: [
        function (data: any) {
            const method = (this as AxiosRequestConfig).method?.toLowerCase();
            if (
                method &&
                ['post', 'put', 'patch'].includes(method) &&
                data != null &&
                typeof data === 'object'
            ) {
                return JSON.stringify(data, replacer);
            }
            return data;
        },
    ],
};

const axiosInstance: AxiosInstance = axios.create(config);

/** ---------- single-flight guard for getSession ---------- */
let inFlightSessionPromise: Promise<AugmentedSession | null> | null = null;

function getSessionOnce(): Promise<AugmentedSession | null> {
    if (!inFlightSessionPromise) {
        inFlightSessionPromise = getSession()
            .then((s) => s as AugmentedSession | null)
            .finally(() => {
                // allow future refresh attempts
                inFlightSessionPromise = null;
            });
    }
    return inFlightSessionPromise;
}

/** ---------- response error handling with queueing ---------- */
axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error) => {
        const errName = error?.response?.data?.name as string | undefined;
        const status = error?.response?.status as number | undefined;

        // Prevent infinite loops
        const cfg = (error.config || {}) as AxiosRequestConfig & {
            _retry?: boolean;
        };
        if (cfg._retry) {
            return Promise.reject(error);
        }

        const shouldSignout = errName === TOKEN_ERROR_NAME;
        if (shouldSignout) {
            return signOut();
        }

        // Decide when to refresh: message match OR 401 (adjust to your API)
        const shouldRefresh = errName === TOKEN_EXPIRED_NAME || status === 401;

        if (!shouldRefresh) {
            return Promise.reject(error);
        }

        cfg._retry = true;

        try {
            // All concurrent 401/jwt-expired requests will await the same promise
            const session = await getSessionOnce();

            // If refresh failed, handle accordingly (sign out or surface error)
            if (!session || session.error === REFRESH_FAILED_MESSAGE) {
                // optionally redirect to sign-in
                await signOut();
                return Promise.reject(error);
            }

            // If your access token is in session and your API needs it on the request,
            // make sure the retried request has the latest Authorization header.
            if (session.accessToken) {
                cfg.headers = {
                    ...(cfg.headers || {}),
                    Authorization: `Bearer ${session.accessToken}`,
                };
            }

            // Retry the original request
            return axiosInstance(cfg);
        } catch (e) {
            return Promise.reject(e);
        }
    }
);

export default axiosInstance;
