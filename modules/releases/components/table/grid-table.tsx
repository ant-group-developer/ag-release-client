import AppGrid from '@/components/ui/grid/app-grid';
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
            <AppGrid
                className="px-4 py-4"
                style={{
                    maxHeight: scrollY(),
                    overflowY: 'auto',
                }}
            >
                {data?.map((item) => {
                    return (
                        <>
                            <GridCardRelease key={item.id} data={item} />
                        </>
                    );
                })}
            </AppGrid>
        </Spin>
    );
}
