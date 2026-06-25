import { DATE_FORMAT } from '@/enums/common';
import { Link } from '@/i18n/routing';
import Footer from '@/modules/landing/components/footer';
import Header from '@/modules/landing/components/header';
import { NewsData } from '@/modules/news/types';
import dayjs from 'dayjs';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getSettingPublicServer } from '@/modules/setting/apis';
import Image from 'next/image';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface PageProps {
    params: {
        locale: string;
        slug: string;
    };
}

export async function generateStaticParams() {
    const locales = ['vi', 'en'];
    const paths: { locale: string; slug: string }[] = [];
    const baseUrl = process.env.API_URL;

    for (const locale of locales) {
        try {
            const queryParams = new URLSearchParams({
                pageSize: '100',
                page: '1',
            });
            const res = await fetch(
                `${baseUrl}/news-posts/public?${queryParams.toString()}`,
                {
                    headers: {
                        locale: locale,
                    },
                }
            );
            if (res.ok) {
                const result = await res.json();
                const items = result?.data?.items ?? [];
                for (const item of items) {
                    if (item.slug) {
                        paths.push({
                            locale,
                            slug: item.slug,
                        });
                    }
                }
            }
        } catch (error) {
            console.error(
                `Error generating static params for locale ${locale}:`,
                error
            );
        }
    }
    return paths;
}

export default async function LandingNewsDetailPage({ params }: PageProps) {
    const { locale, slug } = params;
    const baseUrl = process.env.API_URL;
    const t = await getTranslations('landing');

    let post: NewsData | null = null;
    let websiteName = 'ANT Group';
    try {
        const [res, settingPublic] = await Promise.all([
            fetch(`${baseUrl}/news-posts/public/${slug}`, {
                headers: {
                    locale: locale,
                },
            }),
            getSettingPublicServer(),
        ]);
        if (res.ok) {
            const result = await res.json();
            post = result?.data ?? null;
        }
        if (settingPublic?.data?.config?.website?.name) {
            websiteName = settingPublic.data.config.website.name;
        }
    } catch (error) {
        console.error('Error fetching news detail on server:', error);
    }

    if (!post) {
        return (
            <div
                className="relative overflow-x-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-purple-500 selection:text-white"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.015) 1px, transparent 0)',
                    backgroundSize: '32px 32px',
                }}
            >
                <Header />
                <main
                    className="relative z-10 flex flex-grow items-center justify-center"
                    style={{ flexGrow: 1 }}
                >
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white">
                            {t('newsNotFound')}
                        </h1>
                        <Link
                            href="/landing#news"
                            className="mt-4 inline-block text-purple-400 hover:underline"
                        >
                            {t('newsBackToList')}
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const isDocCategory =
        post?.newsCategory?.nameVi?.toLowerCase().includes('tài liệu') ||
        post?.newsCategory?.nameEn?.toLowerCase().includes('documentation');
    const backHref = isDocCategory ? '/landing#docs' : '/landing#news';

    return (
        <div
            className="relative overflow-x-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-purple-500 selection:text-white"
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.015) 1px, transparent 0)',
                backgroundSize: '32px 32px',
            }}
        >
            {/* Custom keyframe styles for smooth glow animations */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                @keyframes float-blob-1 {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.15); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                @keyframes float-blob-2 {
                    0%, 100% { transform: translate(0px, 0px) scale(1.1); }
                    50% { transform: translate(-40px, 40px) scale(0.85); }
                }
                @keyframes float-blob-3 {
                    0%, 100% { transform: translate(0px, 0px) scale(0.95); }
                    50% { transform: translate(25px, -30px) scale(1.1); }
                }
                .animate-glow-1 {
                    animation: float-blob-1 25s infinite ease-in-out;
                }
                .animate-glow-2 {
                    animation: float-blob-2 30s infinite ease-in-out;
                }
                .animate-glow-3 {
                    animation: float-blob-3 28s infinite ease-in-out;
                }
            `,
                }}
            />

            {/* Background glow container that clips any orb overflow */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                {/* Glowing Ambient Light Orbs */}
                <div className="animate-glow-1 absolute left-[5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
                <div className="animate-glow-2 absolute right-[-5%] top-[20%] h-[600px] w-[600px] rounded-full bg-indigo-600/15 blur-[140px]" />
                <div className="animate-glow-3 bg-pink-600/12 absolute left-[-10%] top-[60%] h-[550px] w-[550px] rounded-full blur-[130px]" />
            </div>

            <Header />

            <main
                className="relative z-10 mx-auto w-full max-w-4xl px-4 py-12"
                style={{ flexGrow: 1 }}
            >
                <div className="animate-fade-in space-y-8">
                    <Link
                        href={backHref}
                        className="group mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        {t('newsBackToList')}
                    </Link>

                    <div className="space-y-4">
                        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 border-b border-zinc-900 pb-6 text-sm font-light text-zinc-400">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-purple-400" />
                                {dayjs(post.createdAt).format(
                                    DATE_FORMAT.DATE_ONLY
                                )}
                            </span>
                            <span className="flex items-center gap-2">
                                <User className="h-4 w-4 text-indigo-400" />
                                {post.creator?.name || websiteName}
                            </span>
                        </div>
                    </div>

                    {post.thumbnail && (
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950">
                            <Image
                                src={post.thumbnail}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-invert max-w-none space-y-4 text-sm font-light leading-relaxed text-zinc-300 sm:text-base"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}
