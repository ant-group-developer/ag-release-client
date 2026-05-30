const DSP_CONFIG = [
    { key: 'spotify', label: 'Spotify',       color: '#1DB954' },
    { key: 'youtube', label: 'YouTube Music', color: '#FF4444' },
    { key: 'apple',   label: 'Apple Music',   color: '#A78BFA' },
    { key: 'tiktok',  label: 'TikTok',        color: '#38BDF8' },
    { key: 'amazon',  label: 'Amazon Music',  color: '#FBBF24' },
    { key: 'other',   label: 'Other',         color: '#94a3b8' },
];

export const DAY_OPTIONS = [
    { messageKey: 'analytics.chart.dayRange.last30Days', value: 30 },
    { messageKey: 'analytics.chart.dayRange.last15Days', value: 15 },
    { messageKey: 'analytics.chart.dayRange.last7Days',  value: 7  },
] as const;

export type DayOptionValue = (typeof DAY_OPTIONS)[number]['value'];