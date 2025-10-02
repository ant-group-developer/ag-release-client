import { NewsData, NewsDataFilter } from '@/modules/news/types';

export const getDetailPostBySlug = async (slug: string, locale?: string) => {
    const res = await fetch(
        `${process.env.API_URL}/news-posts/public/${encodeURIComponent(slug)}`,
        {
            cache: 'no-store',
            headers: {
                accept: 'application/json',
                locale: locale as string,
            },
        }
    );
    if (res.status !== 200) {
        return;
    }
    const json = await res.json();
    return (json?.data as NewsData) ?? ({} as NewsData);
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

    const data = res.json();

    return data;
};
