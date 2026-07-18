import AppCard from '@/components/ant-music/app-card';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function StreamsAnalysisCard({}: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();
    return (
        <AppCard
            title="Streams"
            headerButtonText={messages('common.viewDetail')}
            style={{ backgroundColor: token.colorBgContainer, border: 'none' }}
        >
            <div className="flex min-h-[200px] items-center justify-center">
                <span className="font-bold">
                    {messages('common.noDataAvailable')}
                </span>
            </div>
        </AppCard>
    );
}
