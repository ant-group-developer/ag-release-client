import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './layouts/**/*.{js,ts,jsx,tsx,mdx}',
        './modules/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    'var(--font-inter)',
                    'var(--font-open-sans)',
                    ...defaultTheme.fontFamily.sans,
                ],
                inter: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
                opensans: [
                    'var(--font-open-sans)',
                    ...defaultTheme.fontFamily.sans,
                ],
            },
            fontWeight: {
                normal: '400',
                medium: '500',
                semibold: '600',
                bold: '700',
                extrabold: '800',
                black: '900',
            },
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                'card-bg': 'var(--card-bg)',
                'card-bg-hover': 'var(--card-bg-hover)',
                'card-bg-opacity': 'var(--card-bg-opacity)',
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'card-bg-dark': 'var(--card-bg-dark)',
                'card-bg-hover-dark': 'var(--card-bg-hover-dark)',
                'bg-dark': 'var(--bg-dark)',
            },
        },
    },
    plugins: [],
};
export default config;
