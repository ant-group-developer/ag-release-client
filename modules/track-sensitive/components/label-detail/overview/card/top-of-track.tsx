import AppCard from '@/components/ant-music/app-card';
import { Button } from 'antd';

type Props = {};

export default function TopOfTrackCard({}: Props) {
    return (
        <AppCard title="# của bài hát">
            <div className="flex flex-1 flex-col justify-between">
                <div className="py-10 text-4xl">3</div>
                <div>
                    <Button shape="round" className="">
                        Xem thêm
                    </Button>
                </div>
            </div>
        </AppCard>
    );
}
