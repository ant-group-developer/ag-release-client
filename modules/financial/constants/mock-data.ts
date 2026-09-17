import {
    MonthlyRoyaltyItem,
    RevenueShareItem,
    RoyaltyTransactionItem,
    TopArtistRevenueItem,
} from '../types';

export const MOCK_SUMMARY_METRICS = {
    totalRoyalties: {
        amount: 482672.36,
        growth: 12.5,
        growthText: '+12.5% vs. previous 6 months',
        sparkline: [
            { x: 1, y: 32 },
            { x: 2, y: 38 },
            { x: 3, y: 35 },
            { x: 4, y: 46 },
            { x: 5, y: 42 },
            { x: 6, y: 58 },
            { x: 7, y: 64 },
        ],
    },
    paid: {
        amount: 321408.22,
        percentage: 66.6,
        color: '#10B981',
    },
    pending: {
        amount: 98573.17,
        percentage: 20.4,
        color: '#F59E0B',
    },
    available: {
        amount: 62690.97,
        percentage: 13.0,
        color: '#3B82F6',
    },
};

export const MOCK_MONTHLY_ROYALTIES: MonthlyRoyaltyItem[] = [
    {
        month: 'Apr 2026',
        paid: 35000,
        pending: 15000,
        available: 12318,
        total: 62318,
    },
    {
        month: 'May 2026',
        paid: 38000,
        pending: 16500,
        available: 17042,
        total: 71542,
    },
    {
        month: 'Jun 2026',
        paid: 45000,
        pending: 18000,
        available: 20176,
        total: 83176,
    },
    {
        month: 'Jul 2026',
        paid: 55000,
        pending: 19408,
        available: 18000,
        total: 92408,
    },
    {
        month: 'Aug 2026',
        paid: 68000,
        pending: 20000,
        available: 16732,
        total: 104732,
    },
    {
        month: 'Sep 2026',
        paid: 80408.22,
        pending: 9665.17,
        available: 28424.61,
        total: 118498,
    },
];

export const MOCK_REVENUE_SHARES: RevenueShareItem[] = [
    {
        id: '1',
        name: '22R',
        share: 36.5,
        revenue: 176200.0,
        color: '#8B5CF6',
    },
    {
        id: '2',
        name: 'Beta Music',
        share: 24.8,
        revenue: 119720.5,
        color: '#3B82F6',
    },
    {
        id: '3',
        name: 'VT Music',
        share: 18.2,
        revenue: 87850.2,
        color: '#10B981',
    },
    {
        id: '4',
        name: 'Cre8tive',
        share: 12.5,
        revenue: 60340.8,
        color: '#F97316',
    },
    {
        id: '5',
        name: 'Other Labels',
        share: 8.0,
        revenue: 38620.0,
        color: '#64748B',
    },
];

export const MOCK_RECENT_TRANSACTIONS: RoyaltyTransactionItem[] = [
    {
        id: 'tx-1',
        date: '2026-09-25',
        workspaceId: 'ws-1',
        workspaceName: 'Beta Music',
        workspaceLogo:
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        platform: 'Spotify',
        period: 'Jul 2026',
        type: 'Royalty',
        amount: 12482.34,
        status: 'paid',
    },
    {
        id: 'tx-2',
        date: '2026-09-22',
        workspaceId: 'ws-2',
        workspaceName: 'VT Music',
        workspaceLogo:
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80',
        platform: 'YouTube',
        period: 'Jul 2026',
        type: 'Royalty',
        amount: 8761.2,
        status: 'paid',
    },
    {
        id: 'tx-3',
        date: '2026-09-18',
        workspaceId: 'ws-3',
        workspaceName: '22R',
        workspaceLogo:
            'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80',
        platform: 'Apple Music',
        period: 'Jul 2026',
        type: 'Royalty',
        amount: 6432.17,
        status: 'pending',
    },
    {
        id: 'tx-4',
        date: '2026-09-15',
        workspaceId: 'ws-4',
        workspaceName: 'Cre8tive',
        workspaceLogo:
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&auto=format&fit=crop&q=80',
        platform: 'Amazon Music',
        period: 'Jun 2026',
        type: 'Royalty',
        amount: 4987.56,
        status: 'available',
    },
];

export const MOCK_TOP_ARTISTS: TopArtistRevenueItem[] = [
    {
        rank: 1,
        artistId: 'art-1',
        artistName: 'Luna Vance',
        labelName: '22R',
        revenue: 4866.77,
        share: 16.5,
        picture:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 2,
        artistId: 'art-2',
        artistName: 'Kai Sterling',
        labelName: 'Beta Music',
        revenue: 4773.15,
        share: 15.8,
        picture:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 3,
        artistId: 'art-3',
        artistName: 'Solara Thorne',
        labelName: 'VT Music',
        revenue: 3257.88,
        share: 11.2,
        picture:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 4,
        artistId: 'art-4',
        artistName: 'Zen Takahashi',
        labelName: 'Cre8tive',
        revenue: 2932.18,
        share: 9.8,
        picture:
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 5,
        artistId: 'art-5',
        artistName: 'Marcus Vex',
        labelName: '22R',
        revenue: 2097.43,
        share: 7.2,
        picture:
            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 6,
        artistId: 'art-6',
        artistName: 'Aria Montgomery',
        labelName: 'Beta Music',
        revenue: 1642.99,
        share: 5.6,
        picture:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 7,
        artistId: 'art-7',
        artistName: 'Nova Rivera',
        labelName: 'VT Music',
        revenue: 1527.06,
        share: 5.1,
        picture:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 8,
        artistId: 'art-8',
        artistName: 'Orion Blackwood',
        labelName: 'Cre8tive',
        revenue: 1264.7,
        share: 4.3,
        picture:
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 9,
        artistId: 'art-9',
        artistName: 'Lyra Bennett',
        labelName: '22R',
        revenue: 1085.4,
        share: 3.7,
        picture:
            'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 10,
        artistId: 'art-10',
        artistName: 'Elysia Ward',
        labelName: 'Beta Music',
        revenue: 942.3,
        share: 3.2,
        picture:
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 11,
        artistId: 'art-11',
        artistName: 'Kaelen Hayes',
        labelName: 'VT Music',
        revenue: 820.5,
        share: 2.8,
        picture:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 12,
        artistId: 'art-12',
        artistName: 'Serena Frost',
        labelName: 'Cre8tive',
        revenue: 715.2,
        share: 2.4,
        picture:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    {
        rank: 13,
        artistId: 'art-13',
        artistName: 'Darian Mercer',
        labelName: '22R',
        revenue: 630.8,
        share: 2.1,
        picture:
            'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    },
];
