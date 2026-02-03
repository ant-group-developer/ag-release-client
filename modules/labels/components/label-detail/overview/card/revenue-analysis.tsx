import AppCard from '@/components/ant-music/app-card';
import { theme } from 'antd';

type Props = {};

export default function RevenueAnalysisCard({}: Props) {
    const { token } = theme.useToken();
    return (
        <AppCard
            title="Doanh thu"
            headerButtonText="Xem thêm"
            style={{
                backgroundColor: token?.colorBgContainer,
            }}
            className="!border-none"
        >
            <div className="flex min-h-[200px] items-center justify-center">
                <span className="font-bold">Không có dữ liệu để hiển thị</span>
            </div>
        </AppCard>
    );
}
