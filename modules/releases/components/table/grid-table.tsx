import { SCREEN } from '@/enums/common';
import { useWindowSize } from '@uidotdev/usehooks';
import { Spin } from 'antd';
import { ReleasesData } from '../../types';
import GridCardRelease from './grid-card';

type Props = {
    data: ReleasesData[];
    loading: boolean;
};

export default function ReleasesGridTable({ data, loading }: Props) {
    const { height, width } = useWindowSize();
    const isSmallDevice = Number(width) <= SCREEN.MD;

    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        const headerFooterHeight = 170;
        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
    };
    return (
        <Spin spinning={loading} delay={200}>
            <div
                className="grid grid-cols-1 gap-5 px-4 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
                style={{
                    maxHeight: scrollY(),
                    overflowY: 'auto',
                }}
            >
                {data?.map((item) => {
                    return (
                        <>
                            <GridCardRelease key={item.id} data={item} />
                            <GridCardRelease key={item.id} data={item} />
                        </>
                    );
                })}
            </div>
        </Spin>
    );
}
