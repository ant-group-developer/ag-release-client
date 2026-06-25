'use client';
import CTABanner from '@/modules/landing/components/cta-banner';
import DocsSection from '@/modules/landing/components/docs-section';
import FAQ from '@/modules/landing/components/faq';
import Features from '@/modules/landing/components/features';
import Footer from '@/modules/landing/components/footer';
import Header from '@/modules/landing/components/header';
import Hero from '@/modules/landing/components/hero';
import HowItWorks from '@/modules/landing/components/how-it-works';
import NewsSection from '@/modules/landing/components/news-section';
import Platforms from '@/modules/landing/components/platforms';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LandingPageProps {
    params: {
        locale: string;
    };
}

export default function LandingPage({ params }: LandingPageProps) {
    const routeParams = useParams();
    // const searchParams = useSearchParams();
    const locale = (routeParams?.locale as string) || params?.locale || 'vi';
    const [activeTab, setActiveTab] = useState<'home' | 'news' | 'docs'>(
        'home'
    );

    // Handle hash on initial mount or URL changes
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash === '#news') {
                setActiveTab('news');
            } else if (hash === '#docs') {
                setActiveTab('docs');
            } else {
                setActiveTab('home');
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleTabChange = (tab: 'home' | 'news' | 'docs') => {
        setActiveTab(tab);
        const params = new URLSearchParams(window.location.search);
        params.delete('tab');

        const queryString = params.toString();
        const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}${tab === 'home' ? '' : `#${tab}`}`;

        window.history.pushState(null, '', newUrl);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            className="relative min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-purple-500 selection:text-white"
            style={{
                backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.015) 1px, transparent 0)',
                backgroundSize: '32px 32px',
                display: 'flex',
                flexDirection: 'column',
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

            {/* Glowing Ambient Light Orbs - wrapped inside an absolute container with overflow-hidden to prevent breaking sticky layout */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="animate-glow-1 absolute left-[5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
                <div className="animate-glow-2 absolute right-[-5%] top-[20%] h-[600px] w-[600px] rounded-full bg-indigo-600/15 blur-[140px]" />
                <div className="bg-pink-600/12 animate-glow-3 absolute left-[-10%] top-[50%] h-[550px] w-[550px] rounded-full blur-[130px]" />
                <div className="animate-glow-1 absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-cyan-600/15 blur-[120px]" />
            </div>

            {/* Content wrapper layered on top of glows */}
            <div className="relative z-10 flex min-h-screen flex-col">
                <Header activeTab={activeTab} onChangeTab={handleTabChange} />

                <main className="flex-grow">
                    {activeTab === 'home' && (
                        <>
                            <Hero />
                            <Features />
                            <HowItWorks />
                            <Platforms />
                            <FAQ />
                            <CTABanner />
                        </>
                    )}

                    {activeTab === 'news' && (
                        <div id="news">
                            <NewsSection locale={locale} />
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div id="docs">
                            <DocsSection locale={locale} />
                        </div>
                    )}
                </main>

                <Footer onChangeTab={handleTabChange} />
            </div>
        </div>
    );
}
