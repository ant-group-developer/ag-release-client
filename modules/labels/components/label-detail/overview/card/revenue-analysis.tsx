import AppCard from '@/components/ant-music/app-card';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function RevenueAnalysisCard({}: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();
    return (
        <AppCard
            title={messages('common.revenue')}
            headerButtonText={messages('common.viewDetail')}
            style={{
                backgroundColor: token?.colorBgContainer,
            }}
            className="!border-none"
        >
            <div className="flex min-h-[200px] items-center justify-center">
                <span className="font-bold">
                    {messages('common.noDataAvailable')}
                </span>
            </div>
        </AppCard>
    );
}
