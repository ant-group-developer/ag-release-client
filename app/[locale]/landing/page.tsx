'use client';

import CTABanner from '@/modules/landing/components/cta-banner';
import FAQ from '@/modules/landing/components/faq';
import Features from '@/modules/landing/components/features';
import Footer from '@/modules/landing/components/footer';
import Header from '@/modules/landing/components/header';
import Hero from '@/modules/landing/components/hero';
import HowItWorks from '@/modules/landing/components/how-it-works';
import Platforms from '@/modules/landing/components/platforms';

export default function LandingPage() {
    return (
        <div
            className="relative min-h-screen overflow-x-hidden bg-zinc-950 font-sans text-zinc-100 selection:bg-purple-500 selection:text-white"
            style={{
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

            {/* Glowing Ambient Light Orbs - z-0 to stay above bg-zinc-950 but below page content */}
            <div className="animate-glow-1 pointer-events-none absolute left-[5%] top-[-10%] z-0 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
            <div className="animate-glow-2 pointer-events-none absolute right-[-5%] top-[20%] z-0 h-[600px] w-[600px] rounded-full bg-indigo-600/15 blur-[140px]" />
            <div className="bg-pink-600/12 animate-glow-3 pointer-events-none absolute left-[-10%] top-[50%] z-0 h-[550px] w-[550px] rounded-full blur-[130px]" />
            <div className="animate-glow-1 pointer-events-none absolute bottom-[10%] right-[10%] z-0 h-[500px] w-[500px] rounded-full bg-cyan-600/15 blur-[120px]" />

            {/* Content wrapper layered on top of glows */}
            <div className="relative z-10">
                <Header />
                <Hero />
                <Features />
                <HowItWorks />
                <Platforms />
                <FAQ />
                <CTABanner />
                <Footer />
            </div>
        </div>
    );
}
