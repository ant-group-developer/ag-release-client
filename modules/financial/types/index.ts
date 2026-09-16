export interface SummaryMetricItem {
    id: string;
    label: string;
    amount: number;
    percentage?: number;
    growth?: number;
    growthLabel?: string;
    sparklineData?: { x: number; y: number }[];
}

export interface MonthlyRoyaltyItem {
    month: string;
    paid: number;
    pending: number;
    available: number;
    total: number;
}

export interface RevenueShareItem {
    id: string;
    name: string;
    share: number;
    revenue: number;
    color: string;
}

export type TransactionStatus = 'paid' | 'pending' | 'available';

export interface RoyaltyTransactionItem {
    id: string;
    date: string;
    workspaceId?: string;
    workspaceName?: string;
    workspaceLogo?: string | null;
    platform: string;
    period: string;
    type: string;
    amount: number;
    status: TransactionStatus;
}

export type RecentTransactionItem = RoyaltyTransactionItem;

export interface TopArtistRevenueItem {
    rank: number;
    artistId: string;
    artistName: string;
    picture?: string | null;
    labelName: string;
    revenue: number;
    share: number;
}
