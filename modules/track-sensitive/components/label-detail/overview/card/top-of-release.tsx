import AppCard from '@/components/ant-music/app-card';
import { Button } from 'antd';

type Props = {};

export default function TopOfReleaseCard({}: Props) {
    return (
        <AppCard title="# của phát hành">
            <div className="flex flex-1 flex-col justify-between">
                <div className="py-10 text-4xl">1</div>
                <div>
                    <Button shape="round" className="">
                        Xem thêm
                    </Button>
                </div>
            </div>
        </AppCard>
    );
}
