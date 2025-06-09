import AppCard from '@/components/ant-music/app-card';

type Props = {};

export default function StreamsAnalysisCard({}: Props) {
    return (
        <AppCard title="Streams" headerButtonText="Xem thêm">
            <div className="flex min-h-[200px] items-center justify-center">
                <span className="font-bold">Không có dữ liệu để hiển thị</span>
            </div>
        </AppCard>
    );
}
