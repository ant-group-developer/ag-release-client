import { NewsData, NewsDataFilter } from '@/modules/news/types';

export const getDetailPostBySlug = async (slug: string, locale?: string) => {
    try {
        const res = await fetch(
            `${process.env.API_URL}/news-posts/public/${encodeURIComponent(slug)}`,
            {
                cache: 'no-store',
                headers: {
                    accept: 'application/json',
                    locale: locale || '',
                },
            }
        );

        // Nếu status không phải 2xx thì return undefined
        if (!res.ok) {
            console.error(
                `getDetailPostBySlug failed: ${res.status} ${res.statusText}`
            );
            return undefined;
        }

        const json = await res.json().catch(() => null); // tránh crash khi body không phải JSON
        return (json?.data as NewsData) ?? undefined;
    } catch (err) {
        console.error('getDetailPostBySlug error:', err);
        return undefined;
    }
};

export const getListPostPublic = async (params: NewsDataFilter = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params)?.forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
        }
    });

    const res = await fetch(
        `${process.env.API_URL}/news-posts/public?${searchParams.toString()}`,
        {
            cache: 'no-store',
            headers: {
                accept: 'application/json',
                locale: params?.languageCode as string,
            },
        }
    );

    if (res.status !== 200) {
        return;
    }

    const data = res.json();

    return data;
};
