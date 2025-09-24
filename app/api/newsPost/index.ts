import { NewsData, NewsDataFilter } from '@/modules/news/types';

export const getDetailPostBySlug = async (slug: string) => {
    const res = await fetch(
        `${process.env.API_URL}/news-posts/public/${encodeURIComponent(slug)}`,
        {
            cache: 'no-store',
            headers: { accept: 'application/json' },
        }
    );
    const json = await res.json();
    return (json?.data as NewsData) ?? ({} as NewsData);
};

export const getListPostPublic = async (params: NewsDataFilter) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
        }
    });

    const res = await fetch(
        `${process.env.API_URL}/news-posts/public?${searchParams.toString()}`,
        {
            cache: 'no-store',
            headers: { accept: 'application/json' },
        }
    );

    const data = res.json();

    return data;
};
