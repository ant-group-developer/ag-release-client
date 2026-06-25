'use client';

import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="py-12 bg-zinc-950 border-t border-zinc-900 text-zinc-500 text-xs sm:text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="ANT Group Logo"
                        width={24}
                        height={24}
                        className="opacity-60"
                    />
                    <span>&copy; {new Date().getFullYear()} ANT Group. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-zinc-300 transition-colors">Support</a>
                </div>
            </div>
        </footer>
    );
}
