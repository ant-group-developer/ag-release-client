import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
            },
        ];
    },
    async rewrites() {
        return [
            {
                source: '/api/cms/:path*', // get everything after /api/
                destination: `${process.env.API_URL}/:path*`, // send it to your API
            },
            {
                source: '/api/account/:path*', // get everything after /api/
                destination: `${process.env.CMS_API}/:path*`, // send it to your API
            },
        ];
    },
    env: {
        API_URL: process.env.API_URL,
        WEBSITE_URL: process.env.WEBSITE_URL,
        ANT_GROUP_WEBSITE: process.env.ANT_GROUP_WEBSITE,
        EMAIL: process.env.EMAIL,
        APP_NAME: process.env.APP_NAME,
        APP_SHORT_NAME: process.env.APP_SHORT_NAME,
        SLOGAN: process.env.SLOGAN,
        APP_IMAGE: process.env.APP_IMAGE,
        APP_DESCRIPTION: process.env.APP_DESCRIPTION,
        APP_KEYWORDS: process.env.APP_KEYWORDS,
        PRIMARY_COLOR: process.env.PRIMARY_COLOR,
        TEXT_COLOR: process.env.TEXT_COLOR,
        BACKGROUND_COLOR: process.env.BACKGROUND_COLOR,
        CLIENT: process.env.CLIENT,
        REDIRECT_URI: process.env.REDIRECT_URI,
        LOGIN_URL: process.env.LOGIN_URL,
        SUPPORT: process.env.SUPPORT,
        CMS_API: process.env.CMS_API,
        CMS_URL: process.env.CMS_URL,
        AG_API: process.env.AG_API,
        ANT_TASK_API: process.env.ANT_TASK_API,
        API_UPLOAD: process.env.API_UPLOAD,
        GOOGLE_ROOT_FOLDER_DRIVE_ID: process.env.GOOGLE_ROOT_FOLDER_DRIVE_ID,
        GOOGLE_ILLUSTRATIVE_FOLDER_ID:
            process.env.GOOGLE_ILLUSTRATIVE_FOLDER_ID,
        GOOGLE_THUMBNAIL_FOLDER_ID: process.env.GOOGLE_THUMBNAIL_FOLDER_ID,
        APP_UPLOAD_X_API_KEY: process.env.APP_UPLOAD_X_API_KEY,
        AUTH0_SECRET: process.env.AUTH0_SECRET,
        APP_BASE_URL: process.env.APP_BASE_URL,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
        AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
        AUTH0_SCOPE: process.env.AUTH0_SCOPE,
    },
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ant-group.net',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
        minimumCacheTTL: 1500000,
    },
    // transpilePackages: [
    //     'antd',
    //     '@ant-design',
    //     'rc-util',
    //     'rc-pagination',
    //     'rc-picker',
    //     'rc-notification',
    //     'rc-tooltip',
    //     'rc-tree',
    //     'rc-table',
    // ],
    output: 'standalone',
};

export default withNextIntl(nextConfig);
