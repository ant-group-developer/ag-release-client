'use client';

import CTABanner from '@/modules/landing/components/cta-banner';
import FAQ from '@/modules/landing/components/faq';
import Features from '@/modules/landing/components/features';
import Footer from '@/modules/landing/components/footer';
import Header from '@/modules/landing/components/header';
import Hero from '@/modules/landing/components/hero';
import HowItWorks from '@/modules/landing/components/how-it-works';
import Platforms from '@/modules/landing/components/platforms';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LandingClientPageProps {
    newsSection: React.ReactNode;
}

export default function LandingClientPage({
    newsSection,
}: LandingClientPageProps) {
    const [activeTab, setActiveTab] = useState<'home' | 'news' | 'docs'>('home');
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleHashOrQueryChange = () => {
            const hash = window.location.hash;
            const tabParam = searchParams.get('tab');

            if (hash === '#news' || tabParam === 'news') {
                setActiveTab('news');
            } else if (hash === '#docs' || tabParam === 'docs') {
                setActiveTab('docs');
            } else {
                setActiveTab('home');
            }
        };

        handleHashOrQueryChange();

        window.addEventListener('hashchange', handleHashOrQueryChange);
        return () =>
            window.removeEventListener('hashchange', handleHashOrQueryChange);
    }, [searchParams]);

    const handleTabChange = (tab: 'home' | 'news' | 'docs') => {
        setActiveTab(tab);
        window.location.hash = `#${tab}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

            <Header activeTab={activeTab} onChangeTab={handleTabChange} />

            <main
                className="animate-fade-in relative z-10"
                style={{ flexGrow: 1 }}
            >
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

                {activeTab === 'news' && newsSection}
            </main>

            <Footer />
        </div>
    );
}
